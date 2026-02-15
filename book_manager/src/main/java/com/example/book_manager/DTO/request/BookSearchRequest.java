package com.example.book_manager.DTO.request;

import lombok.Data;

/**
 * 图书搜索请求DTO
 *
 * 支持多条件搜索：
 *   - title: 书名（模糊匹配）
 *   - author: 作者（模糊匹配）
 *   - category: 分类（精确匹配）
 *   - status: 状态（精确匹配）
 *   - page: 页码（默认0）
 *   - size: 每页大小（默认10）
 *   - sort: 排序字段（默认createTime）
 *   - direction: 排序方向（asc/desc，默认desc）
 */
@Data
public class BookSearchRequest {

    /**
     * 书名（模糊匹配）
     */
    private String title;

    /**
     * 作者（模糊匹配）
     */
    private String author;

    /**
     * 分类（精确匹配）
     */
    private String category;

    /**
     * 状态（精确匹配）
     */
    private String status;

    /**
     * 页码（默认0）
     */
    private int page = 0;

    /**
     * 每页大小（默认10）
     */
    private int size = 10;

    /**
     * 排序字段（默认createTime）
     */
    private String sort = "createTime";

    /**
     * 排序方向（asc/desc，默认desc）
     */
    private String direction = "desc";
}
