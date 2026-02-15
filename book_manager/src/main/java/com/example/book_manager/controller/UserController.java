package com.example.book_manager.controller;

import com.example.book_manager.DTO.request.ResetPasswordRequest;
import com.example.book_manager.DTO.request.UserCreateRequest;
import com.example.book_manager.DTO.request.UserUpdateRequest;
import com.example.book_manager.DTO.response.ApiResponse;
import com.example.book_manager.DTO.response.PageResponse;
import com.example.book_manager.DTO.response.ResetPasswordResponse;
import com.example.book_manager.DTO.response.UserResponse;
import com.example.book_manager.entity.User;
import com.example.book_manager.service.UserService;
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
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * 创建用户（仅管理员）
     */
    @PostMapping
    @PreAuthorize("hasAuthority('admin')")  // 使用 hasAuthority 匹配数据库中的 "admin"
    public ApiResponse<UserResponse> create(@Valid @RequestBody UserCreateRequest request) {
        User user = new User();
        BeanUtils.copyProperties(request, user);

        User createdUser = userService.registerUser(user);
        UserResponse response = convertToResponse(createdUser);

        return ApiResponse.success("用户创建成功", response);
    }

    /**
     * 更新用户（仅管理员）
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")  // 使用 hasAuthority 匹配数据库中的 "admin"
    public ApiResponse<UserResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {

        // 先获取原用户
        User existingUser = userService.findById(id)
                .orElseThrow(() -> new com.example.book_manager.exception.ResourceNotFoundException("用户不存在"));

        // 只更新非空字段
        if (request.getUsername() != null) {
            existingUser.setUsername(request.getUsername());
        }
        if (request.getNickname() != null) {
            existingUser.setNickname(request.getNickname());
        }
        if (request.getEmail() != null) {
            existingUser.setEmail(request.getEmail());
        }
        if (request.getAvatar() != null) {
            existingUser.setAvatar(request.getAvatar());
        }
        if (request.getRole() != null) {
            existingUser.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            existingUser.setStatus(request.getStatus());
        }
        // 只有提供了新密码时才更新密码
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(request.getPassword());
        }

        // 更新用户
        User updatedUser = userService.update(existingUser);
        UserResponse response = convertToResponse(updatedUser);

        return ApiResponse.success("用户更新成功", response);
    }

    /**
     * 删除用户（仅管理员）
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")  // 使用 hasAuthority 匹配数据库中的 "admin"
    public ApiResponse<String> delete(@PathVariable Long id) {
        userService.delete(id);
        return ApiResponse.success("用户删除成功");
    }

    /**
     * 根据ID获取用户（需要认证）
     */
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUser(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new com.example.book_manager.exception.ResourceNotFoundException("用户不存在"));

        UserResponse response = convertToResponse(user);

        return ApiResponse.success(response);
    }

    /**
     * 获取所有用户（分页，需要认证）
     */
    @GetMapping
    public ApiResponse<PageResponse<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createTime") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort));

        Page<User> userPage = userService.findAll(pageable);

        List<UserResponse> content = userPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        PageResponse<UserResponse> response = PageResponse.<UserResponse>builder()
                .content(content)
                .currentPage(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();

        return ApiResponse.success(response);
    }

    /**
     * 搜索用户（需要认证）
     */
    @GetMapping("/search")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createTime") String sort,
            @RequestParam(defaultValue = "desc") String direction) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC, sort));

        Page<User> userPage = userService.searchUsers(username, email, pageable);

        List<UserResponse> content = userPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        PageResponse<UserResponse> response = PageResponse.<UserResponse>builder()
                .content(content)
                .currentPage(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();

        return ApiResponse.success(response);
    }

    /**
     * 重置密码（仅管理员）
     */
    @PostMapping("/reset-password")
    @PreAuthorize("hasAuthority('admin')")  // 使用 hasAuthority 匹配数据库中的 "admin"
    public ApiResponse<ResetPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        // 重置密码
        String newPassword = userService.resetPassword(request.getUserId());

        // 获取用户信息
        User user = userService.findById(request.getUserId())
                .orElseThrow(() -> new com.example.book_manager.exception.ResourceNotFoundException("用户不存在"));

        // 构建响应
        ResetPasswordResponse response = ResetPasswordResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .newPassword(newPassword)
                .message("密码重置成功")
                .build();

        return ApiResponse.success("密码重置成功", response);
    }

    private UserResponse convertToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .avatar(user.getAvatar())
                .createTime(user.getCreateTime())
                .updateTime(user.getUpdateTime())
                .build();
    }
}
