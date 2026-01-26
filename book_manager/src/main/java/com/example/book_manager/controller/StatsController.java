package com.example.book_manager.controller;

import com.example.book_manager.DTO.response.ApiResponse;
import com.example.book_manager.DTO.response.StatsResponse;
import com.example.book_manager.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 统计控制器
 *
 * 提供首页统计数据的接口
 */
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private StatsService statsService;

    /**
     * 获取统计数据
     *
     * @return 统计数据响应
     */
    @GetMapping
    public ApiResponse<StatsResponse> getStatistics() {
        StatsResponse stats = statsService.getStatistics(null);
        return ApiResponse.success(stats);
    }
}