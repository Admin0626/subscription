package com.example.book_manager.DTO.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 借书请求DTO
 *
 * 用于创建借阅记录
 */
@Data
public class BorrowRequest {

    /**
     * 图书ID
     */
    @NotNull(message = "图书ID不能为空")
    private Long bookId;

    /**
     * 借阅数量（默认1本）
     */
    @NotNull(message = "借阅数量不能为空")
    @Min(value = 1, message = "借阅数量不能少于1本")
    private Integer quantity = 1;

    /**
     * 借阅天数（默认30天）
     */
    @Min(value = 1, message = "借阅天数不能少于1天")
    private Integer borrowDays = 30;
}
