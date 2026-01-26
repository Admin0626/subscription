package com.example.book_manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "用户名不允许为空")
    @Size(min = 2, max = 20, message = "用户名长度必须要在2-20个字符之间")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "密码不能为空")
    @Column(nullable = false)
    private String password;

    @Email(message = "邮箱格式不正确")
    @Column(unique = true)
    private String email;

    private String nickname;

    private String avatar;

    @ColumnDefault("'user'")
    private String role;

    @ColumnDefault("'ACTIVE'")
    private String status;

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;
}
