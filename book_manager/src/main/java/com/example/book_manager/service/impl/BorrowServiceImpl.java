package com.example.book_manager.service.impl;

import com.example.book_manager.DTO.request.BorrowRequest;
import com.example.book_manager.DTO.request.ReturnRequest;
import com.example.book_manager.DTO.response.BorrowResponse;
import com.example.book_manager.DTO.response.PageResponse;
import com.example.book_manager.entity.Book;
import com.example.book_manager.entity.BorrowRecord;
import com.example.book_manager.entity.User;
import com.example.book_manager.exception.BusinessException;
import com.example.book_manager.exception.ResourceNotFoundException;
import com.example.book_manager.repository.BookRepository;
import com.example.book_manager.repository.BorrowRecordRepository;
import com.example.book_manager.repository.UserRepository;
import com.example.book_manager.service.BorrowService;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 借阅服务实现
 */
@Service
@Transactional
public class BorrowServiceImpl implements BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public BorrowResponse borrowBook(Long userId, BorrowRequest request) {
        // 1. 检查用户是否存在
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        // 2. 检查用户状态
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BusinessException("用户账户已冻结，无法借书");
        }

        // 3. 检查用户是否可以借书（借阅数量限制：最多5本）
        long borrowCount = borrowRecordRepository.countByUserIdAndStatus(userId, "BORROWED");
        if (borrowCount >= 5) {
            throw new BusinessException("借阅数量已达上限，最多可借5本");
        }

        // 4. 检查图书是否存在
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("图书不存在"));

        // 5. 检查图书状态
        if (!"AVAILABLE".equals(book.getStatus())) {
            throw new BusinessException("图书当前不可借阅");
        }

        // 6. 检查库存是否足够
        if (book.getAvailableStock() < request.getQuantity()) {
            throw new BusinessException("库存不足，当前可借数量为：" + book.getAvailableStock());
        }

        // 7. 检查用户是否已经借阅了这本书且未归还
        if (borrowRecordRepository.existsByUserIdAndBookIdAndStatus(userId, request.getBookId(), "BORROWED")) {
            throw new BusinessException("您已借阅此书且未归还，请先归还后再借");
        }

        // 8. 创建借阅记录
        BorrowRecord record = new BorrowRecord();
        record.setUser(user);
        record.setBook(book);
        record.setUserId(userId);
        record.setBookId(request.getBookId());
        record.setQuantity(request.getQuantity());
        record.setBorrowDate(LocalDateTime.now());
        record.setDueDate(LocalDate.now().plusDays(request.getBorrowDays()));
        record.setStatus("BORROWED");
        record.setIsOverdue(false);
        record.setOverdueDays(0);
        record.setFine(0.0);
        record.setFineStatus("UNPAID");

        // 9. 保存借阅记录
        BorrowRecord savedRecord = borrowRecordRepository.save(record);

        // 10. 减少图书库存
        book.setAvailableStock(book.getAvailableStock() - request.getQuantity());
        book.setBorrowCount(book.getBorrowCount() + 1);
        bookRepository.save(book);

        // 11. 检查是否需要更新图书状态（库存为0时）
        if (book.getAvailableStock() == 0) {
            book.setStatus("BORROWED_OUT");
            bookRepository.save(book);
        }

        return convertToResponse(savedRecord, user, book);
    }

    @Override
    public BorrowResponse returnBook(Long userId, ReturnRequest request) {
        // 1. 查找借阅记录
        BorrowRecord record = borrowRecordRepository.findById(request.getBorrowRecordId())
                .orElseThrow(() -> new ResourceNotFoundException("借阅记录不存在"));

        // 2. 检查是否是本人的借阅记录
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException("只能归还自己的借阅记录");
        }

        // 3. 检查借阅状态
        if ("RETURNED".equals(record.getStatus())) {
            throw new BusinessException("该借阅记录已归还");
        }

        // 4. 获取图书信息
        Book book = bookRepository.findById(record.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("图书不存在"));

        // 5. 检查归还数量
        if (request.getQuantity() > record.getQuantity()) {
            throw new BusinessException("归还数量不能超过借阅数量");
        }

        // 6. 处理超期罚款
        LocalDate returnDate = LocalDate.now();
        if (returnDate.isAfter(record.getDueDate())) {
            record.setIsOverdue(true);
            record.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), returnDate));
            record.setFine(record.calculateFine());
            record.setFineStatus("UNPAID");
        }

        // 7. 部分归还或全部归还
        if (request.getQuantity().equals(record.getQuantity())) {
            // 全部归还
            record.setStatus("RETURNED");
            record.setReturnDate(returnDate);
        } else {
            // 部分归还（减少借阅数量）
            record.setQuantity(record.getQuantity() - request.getQuantity());
        }

        // 8. 更新借阅记录
        BorrowRecord savedRecord = borrowRecordRepository.save(record);

        // 9. 增加图书库存
        book.setAvailableStock(book.getAvailableStock() + request.getQuantity());

        // 10. 更新图书状态
        if (book.getAvailableStock() > 0 && "BORROWED_OUT".equals(book.getStatus())) {
            book.setStatus("AVAILABLE");
        }
        bookRepository.save(book);

        return convertToResponse(savedRecord, record.getUser(), book);
    }

    @Override
    public PageResponse<BorrowResponse> getUserBorrowRecords(Long userId, Pageable pageable) {
        Page<BorrowRecord> recordPage = borrowRecordRepository.findByUserId(userId, pageable);

        List<BorrowResponse> content = recordPage.getContent().stream()
                .map(record -> convertToResponse(record, record.getUser(), record.getBook()))
                .collect(Collectors.toList());

        return PageResponse.<BorrowResponse>builder()
                .content(content)
                .currentPage(recordPage.getNumber())
                .pageSize(recordPage.getSize())
                .totalElements(recordPage.getTotalElements())
                .totalPages(recordPage.getTotalPages())
                .first(recordPage.isFirst())
                .last(recordPage.isLast())
                .build();
    }

    @Override
    public List<BorrowResponse> getUserActiveBorrows(Long userId) {
        List<BorrowRecord> records = borrowRecordRepository.findActiveBorrowsByUserId(userId);

        return records.stream()
                .map(record -> convertToResponse(record, record.getUser(), record.getBook()))
                .collect(Collectors.toList());
    }

    @Override
    public BorrowResponse getBorrowRecord(Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("借阅记录不存在"));

        return convertToResponse(record, record.getUser(), record.getBook());
    }

    @Override
    public BorrowResponse extendBorrow(Long userId, Long recordId, Integer extendDays) {
        // 1. 查找借阅记录
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("借阅记录不存在"));

        // 2. 检查是否是本人的借阅记录
        if (!record.getUserId().equals(userId)) {
            throw new BusinessException("只能续借自己的借阅记录");
        }

        // 3. 检查借阅状态
        if ("RETURNED".equals(record.getStatus())) {
            throw new BusinessException("已归还的借阅记录不能续借");
        }

        // 4. 检查是否超期（超期不能续借）
        if (record.isOverdue()) {
            throw new BusinessException("超期的借阅记录不能续借，请先归还并缴纳罚款");
        }

        // 5. 检查续借次数（限制最多续借2次）
        // TODO: 需要增加续借次数字段

        // 6. 延长应还日期
        record.setDueDate(record.getDueDate().plusDays(extendDays));
        BorrowRecord savedRecord = borrowRecordRepository.save(record);

        return convertToResponse(savedRecord, record.getUser(), record.getBook());
    }

    @Override
    public PageResponse<BorrowResponse> getAllBorrowRecords(Pageable pageable) {
        Page<BorrowRecord> recordPage = borrowRecordRepository.findAll(pageable);

        List<BorrowResponse> content = recordPage.getContent().stream()
                .map(record -> convertToResponse(record, record.getUser(), record.getBook()))
                .collect(Collectors.toList());

        return PageResponse.<BorrowResponse>builder()
                .content(content)
                .currentPage(recordPage.getNumber())
                .pageSize(recordPage.getSize())
                .totalElements(recordPage.getTotalElements())
                .totalPages(recordPage.getTotalPages())
                .first(recordPage.isFirst())
                .last(recordPage.isLast())
                .build();
    }

    @Override
    public List<BorrowResponse> getOverdueRecords() {
        List<BorrowRecord> records = borrowRecordRepository.findOverdueRecords(LocalDate.now());

        return records.stream()
                .map(record -> {
                    record.setIsOverdue(true);
                    record.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), LocalDate.now()));
                    record.setFine(record.calculateFine());
                    return record;
                })
                .map(record -> convertToResponse(record, record.getUser(), record.getBook()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean canBorrow(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || !"ACTIVE".equals(user.getStatus())) {
            return false;
        }

        long borrowCount = borrowRecordRepository.countByUserIdAndStatus(userId, "BORROWED");
        return borrowCount < 5;
    }

    @Override
    public int getUserBorrowCount(Long userId) {
        return (int) borrowRecordRepository.countByUserIdAndStatus(userId, "BORROWED");
    }

    /**
     * 转换为响应DTO
     */
    private BorrowResponse convertToResponse(BorrowRecord record, User user, Book book) {
        // 重新加载完整关联对象以避免懒加载问题
        if (user != null && book != null) {
            return BorrowResponse.builder()
                    .id(record.getId())
                    .userId(record.getUserId())
                    .username(user.getUsername())
                    .bookId(record.getBookId())
                    .bookTitle(book.getTitle())
                    .bookAuthor(book.getAuthor())
                    .isbn(book.getIsbn())
                    .quantity(record.getQuantity())
                    .borrowDate(record.getBorrowDate())
                    .dueDate(record.getDueDate())
                    .returnDate(record.getReturnDate())
                    .status(record.getStatus())
                    .isOverdue(record.getIsOverdue())
                    .overdueDays(record.getOverdueDays())
                    .fine(record.getFine())
                    .fineStatus(record.getFineStatus())
                    .updateTime(record.getUpdateTime())
                    .build();
        }

        // 备用方案：使用基础字段
        return BorrowResponse.builder()
                .id(record.getId())
                .userId(record.getUserId())
                .username(null)
                .bookId(record.getBookId())
                .bookTitle(null)
                .bookAuthor(null)
                .isbn(null)
                .quantity(record.getQuantity())
                .borrowDate(record.getBorrowDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .status(record.getStatus())
                .isOverdue(record.getIsOverdue())
                .overdueDays(record.getOverdueDays())
                .fine(record.getFine())
                .fineStatus(record.getFineStatus())
                .updateTime(record.getUpdateTime())
                .build();
    }
}
