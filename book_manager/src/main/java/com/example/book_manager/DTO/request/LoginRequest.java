package com.example.book_manager.DTO.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String status;
}