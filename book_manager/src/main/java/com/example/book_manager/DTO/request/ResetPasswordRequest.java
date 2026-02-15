package com.example.book_manager.DTO.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 重置密码请求DTO
 */
@Data
public class ResetPasswordRequest {

    @NotNull(message = "用户ID不能为空")
    private Long userId;
}

