package com.example.book_manager.repository;

import com.example.book_manager.entity.BorrowRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 借阅记录Repository
 *
 * 提供借阅记录的数据访问功能
 */
@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    /**
     * 根据用户ID和图书ID查找未归还的借阅记录
     */
    Optional<BorrowRecord> findByUserIdAndBookIdAndStatus(
            Long userId, Long bookId, String status
    );

    /**
     * 根据用户ID查找借阅记录（分页）
     */
    Page<BorrowRecord> findByUserId(Long userId, Pageable pageable);

    /**
     * 根据用户ID和状态查找借阅记录
     */
    Page<BorrowRecord> findByUserIdAndStatus(Long userId, String status, Pageable pageable);

    /**
     * 根据图书ID查找借阅记录
     */
    Page<BorrowRecord> findByBookId(Long bookId, Pageable pageable);

    /**
     * 查找所有超期未归还的记录
     */
    @Query("SELECT br FROM BorrowRecord br WHERE br.status = 'BORROWED' AND br.dueDate < :currentDate")
    List<BorrowRecord> findOverdueRecords(@Param("currentDate") LocalDate currentDate);

    /**
     * 统计用户的借阅数量
     */
    long countByUserIdAndStatus(Long userId, String status);

    /**
     * 统计图书的借阅次数
     */
    long countByBookId(Long bookId);

    /**
     * 查找用户当前借阅的所有未归还图书
     */
    @Query("SELECT br FROM BorrowRecord br WHERE br.userId = :userId AND br.status = 'BORROWED'")
    List<BorrowRecord> findActiveBorrowsByUserId(@Param("userId") Long userId);

    /**
     * 检查用户是否已经借阅了某本书且未归还
     */
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, String status);

    /**
     * 统计今日借阅数量
     */
    long countByBorrowDateBetween(LocalDateTime start, LocalDateTime end);

    /**
     * 统计逾期图书数量
     */
    @Query("SELECT COUNT(br) FROM BorrowRecord br WHERE br.status = 'BORROWED' AND br.dueDate < :currentDate")
    long countOverdueRecords(@Param("currentDate") LocalDate currentDate);
}