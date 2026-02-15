package com.example.book_manager.service;

import com.example.book_manager.DTO.response.StatsResponse;

public interface StatsService {

    StatsResponse getStatistics(Long userId);
}
