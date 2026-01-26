package com.example.book_manager.service;

import com.example.book_manager.DTO.request.BorrowRequest;
import com.example.book_manager.DTO.request.ReturnRequest;
import com.example.book_manager.DTO.response.BorrowResponse;
import com.example.book_manager.DTO.response.PageResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 借阅服务接口
 *
 * 提供图书借阅、归还、查询等功能
 */
public interface BorrowService {

    /**
     * 借书
     *
     * @param userId 用户ID
     * @param request 借书请求
     * @return 借阅记录
     */
    BorrowResponse borrowBook(Long userId, BorrowRequest request);

    /**
     * 还书
     *
     * @param userId 用户ID
     * @param request 还书请求
     * @return 借阅记录
     */
    BorrowResponse returnBook(Long userId, ReturnRequest request);

    /**
     * 查询用户的借阅记录（分页）
     *
     * @param userId 用户ID
     * @param pageable 分页参数
     * @return 借阅记录列表
     */
    PageResponse<BorrowResponse> getUserBorrowRecords(Long userId, Pageable pageable);

    /**
     * 查询用户当前的借阅记录（未归还）
     *
     * @param userId 用户ID
     * @return 借阅记录列表
     */
    List<BorrowResponse> getUserActiveBorrows(Long userId);

    /**
     * 查询借阅记录详情
     *
     * @param recordId 借阅记录ID
     * @return 借阅记录
     */
    BorrowResponse getBorrowRecord(Long recordId);

    /**
     * 续借图书
     *
     * @param userId 用户ID
     * @param recordId 借阅记录ID
     * @param extendDays 续借天数
     * @return 借阅记录
     */
    BorrowResponse extendBorrow(Long userId, Long recordId, Integer extendDays);

    /**
     * 查询所有借阅记录（管理员，分页）
     *
     * @param pageable 分页参数
     * @return 借阅记录列表
     */
    PageResponse<BorrowResponse> getAllBorrowRecords(Pageable pageable);

    /**
     * 查询超期未归还的借阅记录（管理员）
     *
     * @return 超期记录列表
     */
    List<BorrowResponse> getOverdueRecords();

    /**
     * 检查用户是否可以借书
     *
     * @param userId 用户ID
     * @return true可以借书，false不可以
     */
    boolean canBorrow(Long userId);

    /**
     * 获取用户的借阅数量
     *
     * @param userId 用户ID
     * @return 借阅数量
     */
    int getUserBorrowCount(Long userId);
}
