package com.example.book_manager.controller;


import com.example.book_manager.DTO.request.LoginRequest;
import com.example.book_manager.DTO.response.ApiResponse;
import com.example.book_manager.entity.User;
import com.example.book_manager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        ApiResponse<User> response = ApiResponse.success("注册成功", registeredUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@RequestBody LoginRequest request) {
        try {
            // 1. 先尝试登录（验证用户名和密码）
            User user = userService.login(request.getUsername(), request.getPassword());

            // 2. 检查用户状态
            if ("INACTIVE".equals(user.getStatus())) {
                ApiResponse<User> response = ApiResponse.error(401, "账户已被禁用，请联系管理员");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }

            // 4. 登录成功，返回用户信息
            ApiResponse<User> response = ApiResponse.success("登录成功", user);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (RuntimeException e) {
            // 5. 捕获登录异常（用户名或密码错误）
            ApiResponse<User> response = ApiResponse.error(401, "用户名或密码错误");
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/me")
    public ApiResponse<User> getCurrentUser() {
        User mockUser = new User();
        mockUser.setUsername("test");
        return ApiResponse.success(mockUser);
    }
}
