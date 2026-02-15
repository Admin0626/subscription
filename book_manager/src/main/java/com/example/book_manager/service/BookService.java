package com.example.book_manager.service;

import com.example.book_manager.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface BookService {
    Book createBook(Book book);
    Book updateBook(Long id, Book book);
    void deleteBook(Long id);
    Optional<Book> findById(Long id);
    Optional<Book> findByIsbn(String isbn);
    Page<Book> findAll(Pageable pageable);
    Page<Book> searchBooks(String title, String author, String category, String status, Pageable pageable);
    List<String> getAllCategories();
    void decreaseStock(Long bookId, Integer quantity);
    void increaseStock(Long bookId, Integer quantity);
    boolean checkStock(Long bookId, Integer quantity);
    void increaseBorrowCount(Long bookId);
}