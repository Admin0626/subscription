package com.example.book_manager.controller;

import com.example.book_manager.DTO.request.BookCreateRequest;
import com.example.book_manager.DTO.request.BookSearchRequest;
import com.example.book_manager.DTO.request.BookUpdateRequest;
import com.example.book_manager.DTO.response.ApiResponse;
import com.example.book_manager.DTO.response.BookResponse;
import com.example.book_manager.DTO.response.PageResponse;
import com.example.book_manager.entity.Book;
import com.example.book_manager.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BookResponse> createBook(@Valid @RequestBody BookCreateRequest request) {
        // 1. 创建图书实体
        Book book = new Book();
        BeanUtils.copyProperties(request, book);  // 属性拷贝

        Book createdBook = bookService.createBook(book);

        BookResponse response = convertToResponse(createdBook);

        return ApiResponse.success("图书创建成功", response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<BookResponse> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody BookUpdateRequest request) {

        Book book = new Book();
        BeanUtils.copyProperties(request, book);

        Book updatedBook = bookService.updateBook(id, book);

        BookResponse response = convertToResponse(updatedBook);

        return ApiResponse.success("图书更新成功", response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ApiResponse.success("图书删除成功");
    }

    @GetMapping("/{id}")
    public ApiResponse<BookResponse> getBook(@PathVariable Long id) {
        // 查询图书
        Book book = bookService.findById(id)
                .orElseThrow(() -> new com.example.book_manager.exception.ResourceNotFoundException("图书不存在"));

        // 转换为响应DTO
        BookResponse response = convertToResponse(book);

        return ApiResponse.success(response);
    }

    /**
     * 搜索图书（复合查询）
     *
     * @param request 搜索请求DTO
     * @return 分页的图书列表
     *
     * 权限要求：所有登录用户
     *
     * 支持搜索条件：
     *   - title: 书名（模糊匹配）
     *   - author: 作者（模糊匹配）
     *   - category: 分类（精确匹配）
     *   - status: 状态（精确匹配）
     *   - page: 页码（默认0）
     *   - size: 每页大小（默认10）
     *   - sort: 排序字段（默认createTime）
     *   - direction: 排序方向（asc/desc，默认desc）
     *
     * 示例：
     *   GET /api/books/search?title=Java&category=计算机&page=0&size=10&sort=borrowCount&direction=desc
     */
    @GetMapping("/search")
    public ApiResponse<PageResponse<BookResponse>> searchBooks(BookSearchRequest request) {
        // 1. 构建分页对象
        Sort sort = Sort.by(
                request.getDirection().equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                request.getSort()
        );
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        // 2. 调用服务层搜索图书
        Page<Book> bookPage = bookService.searchBooks(
                request.getTitle(),
                request.getAuthor(),
                request.getCategory(),
                request.getStatus(),
                pageable
        );

        // 3. 转换为响应DTO
        List<BookResponse> content = bookPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        // 4. 构建分页响应
        PageResponse<BookResponse> response = PageResponse.<BookResponse>builder()
                .content(content)
                .currentPage(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .first(bookPage.isFirst())
                .last(bookPage.isLast())
                .build();

        return ApiResponse.success(response);
    }

    /**
     * 获取所有图书（分页查询）
     *
     * @param page 页码（默认0）
     * @param size 每页大小（默认10）
     * @param sort 排序字段（默认createTime）
     * @param direction 排序方向（asc/desc，默认desc）
     * @return 分页的图书列表
     *
     * 权限要求：所有登录用户
     *
     * 示例：
     *   GET /api/books?page=0&size=10&sort=borrowCount&direction=desc
     */
    @GetMapping
    public ApiResponse<PageResponse<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createTime") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        // 1. 构建分页对象
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort));

        // 2. 调用服务层查询所有图书
        Page<Book> bookPage = bookService.findAll(pageable);

        // 3. 转换为响应DTO
        List<BookResponse> content = bookPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        // 4. 构建分页响应
        PageResponse<BookResponse> response = PageResponse.<BookResponse>builder()
                .content(content)
                .currentPage(bookPage.getNumber())
                .pageSize(bookPage.getSize())
                .totalElements(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .first(bookPage.isFirst())
                .last(bookPage.isLast())
                .build();

        return ApiResponse.success(response);
    }

    /**
     * 获取所有图书分类
     *
     * @return 分类列表
     *
     * 权限要求：所有登录用户
     *
     * 用途：
     *   - 前端分类筛选下拉框
     *   - 分类统计
     */
    @GetMapping("/categories")
    public ApiResponse<List<String>> getAllCategories() {
        List<String> categories = bookService.getAllCategories();
        return ApiResponse.success(categories);
    }

    /**
     * 根据ISBN查找图书
     *
     * @param isbn 图书ISBN
     * @return 图书详细信息
     *
     * 权限要求：所有登录用户
     *
     * 用途：
     *   - 扫码借书
     *   - 唯一性校验
     */
    @GetMapping("/isbn/{isbn}")
    public ApiResponse<BookResponse> getBookByIsbn(@PathVariable String isbn) {
        // 查询图书
        Book book = bookService.findByIsbn(isbn)
                .orElseThrow(() -> new com.example.book_manager.exception.ResourceNotFoundException("图书不存在"));

        // 转换为响应DTO
        BookResponse response = convertToResponse(book);

        return ApiResponse.success(response);
    }

    /**
     * 转换为响应DTO
     *
     * @param book 图书实体
     * @return 图书响应DTO
     *
     * 转换内容：
     *   - 基本信息：id, title, author, isbn, category
     *   - 库存信息：totalStock, availableStock, borrowedCount
     *   - 借阅统计：borrowCount
     *   - 状态信息：status
     *   - 时间信息：createTime, updateTime
     *   - 操作信息：createdBy, updatedBy
     *   - 其他信息：description, coverUrl
     */
    private BookResponse convertToResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .isbn(book.getIsbn())
                .category(book.getCategory())
                .publisher(book.getPublisher())
                .publishDate(book.getPublishDate())
                .price(book.getPrice())
                .totalStock(book.getTotalStock())
                .availableStock(book.getAvailableStock())
                .borrowedCount(book.getBorrowedCount())  // 计算值
                .description(book.getDescription())
                .coverUrl(book.getCoverUrl())
                .status(book.getStatus())
                .createTime(book.getCreateTime())
                .updateTime(book.getUpdateTime())
                .createdBy(book.getCreatedBy())
                .updatedBy(book.getUpdatedBy())
                .borrowCount(book.getBorrowCount())
                .build();
    }
}