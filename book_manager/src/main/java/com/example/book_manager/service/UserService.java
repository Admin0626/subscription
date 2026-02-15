package com.example.book_manager.service;

import com.example.book_manager.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {
    User registerUser(User user);
    User login(String username, String password);
    Optional<User> findByUsername(String username);
    Optional<User> findById(Long id);
    User update(User user);
    void delete(Long id);
    Page<User> findAll(Pageable pageable);
    Page<User> searchUsers(String username, String email, Pageable pageable);

    String resetPassword(Long userId);
}