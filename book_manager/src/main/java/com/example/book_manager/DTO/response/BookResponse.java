package com.example.book_manager.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String category;
    private String publisher;
    private LocalDate publishDate;
    private BigDecimal price;
    private Integer totalStock;
    private Integer availableStock;
    private Integer borrowedCount;
    private String description;
    private String coverUrl;
    private String status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private String createdBy;
    private String updatedBy;
    private Integer borrowCount;
}
