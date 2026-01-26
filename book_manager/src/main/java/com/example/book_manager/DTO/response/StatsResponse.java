package com.example.book_manager.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {

    private Long bookCount;

    private Long readerCount;

    private Long todayBorrowedCount;

    private Long overdueCount;
}
