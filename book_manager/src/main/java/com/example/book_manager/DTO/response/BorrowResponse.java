package com.example.book_manager.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 借阅记录响应DTO
 *
 * 返回借阅记录的详细信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowResponse {

    /**
     * 借阅记录ID
     */
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 图书ID
     */
    private Long bookId;

    /**
     * 书名
     */
    private String bookTitle;

    /**
     * 作者
     */
    private String bookAuthor;

    /**
     * ISBN
     */
    private String isbn;

    /**
     * 借阅数量
     */
    private Integer quantity;

    /**
     * 借阅日期
     */
    private LocalDateTime borrowDate;

    /**
     * 应还日期
     */
    private LocalDate dueDate;

    /**
     * 实际归还日期
     */
    private LocalDate returnDate;

    /**
     * 借阅状态（BORROWED/RETURNED/OVERDUE）
     */
    private String status;

    /**
     * 是否超期
     */
    private Boolean isOverdue;

    /**
     * 超期天数
     */
    private Integer overdueDays;

    /**
     * 罚款金额
     */
    private Double fine;

    /**
     * 罚款状态（UNPAID/PAID/WAIVED）
     */
    private String fineStatus;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}
