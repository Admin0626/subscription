package com.example.book_manager.service.impl;

import com.example.book_manager.DTO.response.StatsResponse;
import com.example.book_manager.repository.BookRepository;
import com.example.book_manager.repository.BorrowRecordRepository;
import com.example.book_manager.repository.UserRepository;
import com.example.book_manager.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class StatsServiceImpl implements StatsService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Override
    public StatsResponse getStatistics(Long userId) {
        long bookCount = bookRepository.count();

        long userCount = userRepository.count();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().plusDays(1).atStartOfDay();

        long todayBorrowCount = borrowRecordRepository.countByBorrowDateBetween(startOfDay, endOfDay);

        long overdueCount = borrowRecordRepository.countOverdueRecords(LocalDate.now());

        return StatsResponse.builder()
                .bookCount(bookCount)
                .readerCount(userCount)
                .todayBorrowedCount(todayBorrowCount)
                .overdueCount(overdueCount)
                .build();
    }

}
