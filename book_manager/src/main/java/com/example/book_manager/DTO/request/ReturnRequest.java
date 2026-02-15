package com.example.book_manager.DTO.request;

import lombok.Data;

/**
 * 还书请求DTO
 *
 * 用于归还图书
 */
@Data
public class ReturnRequest {

    /**
     * 借阅记录ID
     */
    private Long borrowRecordId;

    /**
     * 归还数量（默认全部归还）
     */
    private Integer quantity = 1;
}
