package com.example.book_manager.DTO.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {

    @Size(min = 2, max = 20, message = "用户名长度必须在2-20个字符之间")
    private String username;

    @Size(min = 6, message = "密码长度不能少于6位")
    private String password;

    @Email(message = "邮箱格式不正确")
    private String email;

    private String nickname;

    private String avatar;

    @Size(min = 4, max = 20, message = "角色长度必须在4-20个字符之间")
    private String role;

    @Size(min = 6, max = 20, message = "状态长度必须在6-20个字符之间")
    private String status;
}
