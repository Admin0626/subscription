package com.example.book_manager.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 分页响应DTO
 *
 * 用于返回分页查询结果，包含：
 *   - content: 当前页数据列表
 *   - currentPage: 当前页码
 *   - pageSize: 每页大小
 *   - totalElements: 总记录数
 *   - totalPages: 总页数
 *   - first: 是否第一页
 *   - last: 是否最后一页
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    /**
     * 当前页数据列表
     */
    private List<T> content;

    /**
     * 当前页码（从0开始）
     */
    private int currentPage;

    /**
     * 每页大小
     */
    private int pageSize;

    /**
     * 总记录数
     */
    private long totalElements;

    /**
     * 总页数
     */
    private int totalPages;

    /**
     * 是否第一页
     */
    private boolean first;

    /**
     * 是否最后一页
     */
    private boolean last;
}
