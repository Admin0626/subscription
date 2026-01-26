package com.example.book_manager.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 借阅记录实体
 *
 * 功能说明：
 *   - 记录图书借阅信息（谁借了哪本书、什么时候借的、什么时候还）
 *   - 支持借阅状态跟踪（借阅中、已归还、已超期）
 *   - 支持超期罚款计算
 */
@Data
@Entity
@Table(name = "borrow_record", indexes = {
        @Index(name = "idx_user_id", columnList = "userId"),
        @Index(name = "idx_book_id", columnList = "bookId"),
        @Index(name = "idx_status", columnList = "status")
})
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 借阅用户ID
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    /**
     * 借阅图书ID
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "book_id", insertable = false, updatable = false)
    private Long bookId;

    /**
     * 借阅数量（默认1本）
     */
    @Column(nullable = false)
    private Integer quantity = 1;

    /**
     * 借阅日期
     */
    @CreationTimestamp
    @Column(name = "borrow_date", nullable = false)
    private LocalDateTime borrowDate;

    /**
     * 应还日期（借阅日期 + 借阅天数）
     * 默认借阅期：30天
     */
    @Column(nullable = false)
    private LocalDate dueDate;

    /**
     * 实际归还日期
     */
    @Column(name = "return_date")
    private LocalDate returnDate;

    /**
     * 借阅状态
     *   - BORROWED: 借阅中
     *   - RETURNED: 已归还
     *   - OVERDUE: 已超期
     */
    @Column(nullable = false, length = 20)
    private String status = "BORROWED";

    /**
     * 是否超期
     */
    @Column(nullable = false)
    private Boolean isOverdue = false;

    /**
     * 超期天数
     */
    @Column
    private Integer overdueDays = 0;

    /**
     * 罚款金额（按每本书每天0.1元计算）
     */
    @Column(columnDefinition = "DECIMAL(10,2)")
    private Double fine = 0.0;

    /**
     * 罚款状态
     *   - UNPAID: 未支付
     *   - PAID: 已支付
     *   - WAIVED: 已免除
     */
    @Column(length = 20)
    private String fineStatus = "UNPAID";

    @UpdateTimestamp
    private LocalDateTime updateTime;

    /**
     * 判断是否超期
     */
    public boolean isOverdue() {
        if ("RETURNED".equals(status)) {
            return false;
        }
        return LocalDate.now().isAfter(dueDate);
    }

    /**
     * 计算超期天数
     */
    public Integer calculateOverdueDays() {
        if ("RETURNED".equals(status) || returnDate != null) {
            return 0;
        }
        if (isOverdue()) {
            return (int) java.time.temporal.ChronoUnit.DAYS.between(dueDate, LocalDate.now());
        }
        return 0;
    }

    /**
     * 计算罚款金额（每本书每天0.1元）
     */
    public Double calculateFine() {
        return overdueDays * quantity * 0.1;
    }
}
