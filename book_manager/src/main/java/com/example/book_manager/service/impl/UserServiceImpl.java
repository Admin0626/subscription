package com.example.book_manager.service.impl;

import com.example.book_manager.entity.User;
import com.example.book_manager.exception.BusinessException;
import com.example.book_manager.exception.ResourceNotFoundException;
import com.example.book_manager.repository.UserRepository;
import com.example.book_manager.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessException("用户名已存在");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessException("邮箱已存在");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if(user.getRole() == null){
            user.setRole("user");
        }

        if(user.getStatus() ==null){
            user.setStatus("ACTIVE");
        }

        return userRepository.save(user);
    }

    @Override
    public User login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            throw new BusinessException("用户名或密码错误");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BusinessException("用户名或密码错误");
        }

        return user;
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User update(User user) {
        if (!userRepository.existsById(user.getId())) {
            throw new ResourceNotFoundException("用户不存在");
        }
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("用户不存在");
        }
        userRepository.deleteById(id);
    }

    @Override
    public Page<User> searchUsers(String username, String email, Pageable pageable) {
        return userRepository.searchUsers(username, email, pageable);
    }


    @Override
    public String resetPassword(Long userId) {
        // 查找用户
        User user = findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("用户不存在"));

        // 生成随机8位密码（包含大小写字母和数字）
        String newPassword = generateRandomPassword(8);

        // 加密新密码
        user.setPassword(passwordEncoder.encode(newPassword));

        // 保存更新
        userRepository.save(user);

        return newPassword;
    }

    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.util.Random();

        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }

        return password.toString();
    }

}
