package com.example.book_manager.DTO.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BookUpdateRequest {

    @Size(max = 200, message = "书名长度不能超过200个字符")
    private String title;

    @Size(max = 100, message = "作者长度不能超过100个字符")
    private String author;

    @Size(max = 100, message = "ISBN长度不能超过100个字符")
    private String isbn;

    @Size(max = 50, message = "分类长度不能超过50个字符")
    private String category;

    @Size(max = 200, message = "出版社长度不能超过200个字符")
    private String publisher;

    private LocalDate publishDate;

    @DecimalMin(value = "0.00", message = "价格不能小于0")
    @Digits(integer = 10, fraction = 2, message = "价格格式不正确")
    private BigDecimal price;

    @Min(value = 0, message = "总库存数量不能小于0")
    private Integer totalStock;

    @Size(max = 1000, message = "简介长度不能超过1000个字符")
    private String description;

    @Size(max = 500, message = "封面URL长度不能超过500个字符")
    private String coverUrl;

    @Pattern(regexp = "^(AVAILABLE|MAINTENANCE|DELETED)$", message = "状态值无效")
    private String status;
}
