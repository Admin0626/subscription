package com.example.book_manager.controller;

import com.example.book_manager.DTO.request.BorrowRequest;
import com.example.book_manager.DTO.request.ReturnRequest;
import com.example.book_manager.DTO.response.ApiResponse;
import com.example.book_manager.DTO.response.BorrowResponse;
import com.example.book_manager.DTO.response.PageResponse;
import com.example.book_manager.service.BorrowService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 借阅管理控制器
 *
 * 提供图书借阅、归还、查询等功能
 */
@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    /**
     * 借书
     *
     * @param request 借书请求
     * @param authentication 认证信息
     * @return 借阅记录
     */
    @PostMapping
    public ApiResponse<BorrowResponse> borrowBook(
            @Valid @RequestBody BorrowRequest request,
            Authentication authentication) {

        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        BorrowResponse response = borrowService.borrowBook(userId, request);

        return ApiResponse.success("借书成功", response);
    }

    /**
     * 还书
     *
     * @param request 还书请求
     * @param authentication 认证信息
     * @return 借阅记录
     */
    @PostMapping("/return")
    public ApiResponse<BorrowResponse> returnBook(
            @Valid @RequestBody ReturnRequest request,
            Authentication authentication) {

        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        BorrowResponse response = borrowService.returnBook(userId, request);

        return ApiResponse.success("还书成功", response);
    }

    /**
     * 查询我的借阅记录（分页）
     *
     * @param page 页码（默认0）
     * @param size 每页大小（默认10）
     * @param sort 排序字段（默认borrowDate）
     * @param direction 排序方向（asc/desc，默认desc）
     * @param authentication 认证信息
     * @return 借阅记录列表
     */
    @GetMapping("/my-records")
    public ApiResponse<PageResponse<BorrowResponse>> getMyBorrowRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "borrowDate") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            Authentication authentication) {

        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        // 构建分页对象
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort));

        PageResponse<BorrowResponse> response = borrowService.getUserBorrowRecords(userId, pageable);

        return ApiResponse.success(response);
    }

    /**
     * 查询我当前的借阅记录（未归还）
     *
     * @param authentication 认证信息
     * @return 借阅记录列表
     */
    @GetMapping("/my-active")
    public ApiResponse<List<BorrowResponse>> getMyActiveBorrows(Authentication authentication) {
        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        List<BorrowResponse> response = borrowService.getUserActiveBorrows(userId);

        return ApiResponse.success(response);
    }

    /**
     * 查询借阅记录详情
     *
     * @param recordId 借阅记录ID
     * @return 借阅记录
     */
    @GetMapping("/record/{recordId}")
    public ApiResponse<BorrowResponse> getBorrowRecord(@PathVariable Long recordId) {
        BorrowResponse response = borrowService.getBorrowRecord(recordId);
        return ApiResponse.success(response);
    }

    /**
     * 续借图书
     *
     * @param recordId 借阅记录ID
     * @param extendDays 续借天数（默认30天）
     * @param authentication 认证信息
     * @return 借阅记录
     */
    @PostMapping("/extend/{recordId}")
    public ApiResponse<BorrowResponse> extendBorrow(
            @PathVariable Long recordId,
            @RequestParam(defaultValue = "30") Integer extendDays,
            Authentication authentication) {

        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        BorrowResponse response = borrowService.extendBorrow(userId, recordId, extendDays);

        return ApiResponse.success("续借成功", response);
    }

    /**
     * 查询所有借阅记录（管理员）
     *
     * @param page 页码（默认0）
     * @param size 每页大小（默认10）
     * @param sort 排序字段（默认borrowDate）
     * @param direction 排序方向（asc/desc，默认desc）
     * @return 借阅记录列表
     */
    @GetMapping("/records")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<PageResponse<BorrowResponse>> getAllBorrowRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "borrowDate") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        // 构建分页对象
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort));

        PageResponse<BorrowResponse> response = borrowService.getAllBorrowRecords(pageable);

        return ApiResponse.success(response);
    }

    /**
     * 查询超期未归还的借阅记录（管理员）
     *
     * @return 超期记录列表
     */
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<BorrowResponse>> getOverdueRecords() {
        List<BorrowResponse> response = borrowService.getOverdueRecords();
        return ApiResponse.success(response);
    }

    /**
     * 检查是否可以借书
     *
     * @param authentication 认证信息
     * @return true可以借书，false不可以
     */
    @GetMapping("/can-borrow")
    public ApiResponse<Boolean> canBorrow(Authentication authentication) {
        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        boolean canBorrow = borrowService.canBorrow(userId);

        return ApiResponse.success(canBorrow);
    }

    /**
     * 获取借阅数量
     *
     * @param authentication 认证信息
     * @return 借阅数量
     */
    @GetMapping("/borrow-count")
    public ApiResponse<Integer> getBorrowCount(Authentication authentication) {
        // 获取当前登录用户ID
        Long userId = Long.parseLong(authentication.getName());

        int count = borrowService.getUserBorrowCount(userId);

        return ApiResponse.success(count);
    }
}
