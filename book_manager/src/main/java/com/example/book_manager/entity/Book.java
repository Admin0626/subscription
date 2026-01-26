package com.example.book_manager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "book")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "书名不能为空")
    @Size(max = 200, message = "书名长度不能超过200个字符")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "作者不能为空")
    @Size(max = 100, message = "作者长度不能超过100个字符")
    @Column(nullable = false)
    private String author;

    @Size(max = 100, message = "ISBN长度不能超过100个字符")
    @Column(unique = true)
    private String isbn;

    @NotBlank(message = "分类不能为空")
    @Size(max = 50, message = "分类长度不能超过50个字符")
    @Column(nullable = false)
    private String category;

    @Size(max = 200, message = "出版社长度不能超过200个字符")
    @Column(length = 200)
    private String publisher;

    private LocalDate publishDate;

    @DecimalMin(value = "0.00", message = "价格不能小于0")
    @Digits(integer = 10, fraction = 2, message = "价格格式不正确")
    @Column(precision = 12, scale = 2)
    private BigDecimal price;

    @NotNull(message = "总库存数量不能为空")
    @Min(value = 0, message = "总库存数量不能小于0")
    @Column(nullable = false)
    private Integer totalStock;

    @NotNull(message = "可借数量不能为空")
    @Min(value = 0, message = "可借数量不能小于0")
    @Column(nullable = false)
    private Integer availableStock;

    @Size(max = 1000, message = "简介长度不能超过1000个字符")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Size(max = 500, message = "封面URL长度不能超过500个字符")
    private String coverUrl;

    @ColumnDefault("'AVAILABLE'")
    private String status;

    @CreationTimestamp
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;

    @ColumnDefault("'admin'")
    private String createdBy;

    @ColumnDefault("'admin'")
    private String updatedBy;

    @ColumnDefault("0")
    private Integer borrowCount;

    public boolean isAvailable() {
        return "AVAILABLE".equals(this.status) && this.availableStock > 0;
    }

    public Integer getBorrowedCount() {
        return this.totalStock - this.availableStock;
    }
}
