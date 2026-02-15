package com.example.book_manager.service.impl;

import com.example.book_manager.entity.Book;
import com.example.book_manager.repository.BookRepository;
import com.example.book_manager.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public Book createBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public Book updateBook(Long id, Book book) {
        book.setId(id);
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        // 物理删除：直接从数据库删除
        bookRepository.deleteById(id);
    }

    @Override
    public Optional<Book> findById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public Optional<Book> findByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }

    @Override
    public Page<Book> findAll(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    @Override
    public Page<Book> searchBooks(String title, String author, String category, String status, Pageable pageable) {
        Specification<Book> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isEmpty()) {
                predicates.add(cb.like(root.get("title"), "%" + title + "%"));
            }
            if (author != null && !author.isEmpty()) {
                predicates.add(cb.like(root.get("author"), "%" + author + "%"));
            }
            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return bookRepository.findAll(spec, pageable);
    }

    @Override
    public List<String> getAllCategories() {
        return bookRepository.findAll().stream()
                .map(Book::getCategory)
                .distinct()
                .toList();
    }

    @Override
    public void decreaseStock(Long bookId, Integer quantity) {
        Book book = findById(bookId).orElseThrow(() ->
                new RuntimeException("图书不存在"));
        if (book.getAvailableStock() < quantity) {
            throw new RuntimeException("库存不足");
        }
        book.setAvailableStock(book.getAvailableStock() - quantity);
        bookRepository.save(book);
    }

    @Override
    public void increaseStock(Long bookId, Integer quantity) {
        Book book = findById(bookId).orElseThrow(() ->
                new RuntimeException("图书不存在"));
        book.setAvailableStock(book.getAvailableStock() + quantity);
        bookRepository.save(book);
    }

    @Override
    public boolean checkStock(Long bookId, Integer quantity) {
        Book book = findById(bookId).orElseThrow(() ->
                new RuntimeException("图书不存在"));
        return book.getAvailableStock() >= quantity;
    }

    @Override
    public void increaseBorrowCount(Long bookId) {
        Book book = findById(bookId).orElseThrow(() ->
                new RuntimeException("图书不存在"));
        book.setBorrowCount(book.getBorrowCount() + 1);
        bookRepository.save(book);
    }
}