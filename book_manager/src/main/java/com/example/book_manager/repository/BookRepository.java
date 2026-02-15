package com.example.book_manager.repository;

import com.example.book_manager.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long>, JpaSpecificationExecutor<Book> {

    Optional<Book> findByIsbn(String isbn);

    boolean existsByIsbn(String isbn);

    Page<Book> findByCategory(String category, Pageable pageable);

    Page<Book> findByTitleOrAuthorContaining(String title, String author, Pageable pageable);

    Page<Book> findByStatus(String status, Pageable pageable);

    Page<Book> findByStatusOrderByCreateTimeDesc(String status, Pageable pageable);

    Page<Book> findByCategoryAndStatus(String category, String status, Pageable pageable);

    @org.springframework.data.jpa.repository.Query(
            "SELECT b FROM Book b WHERE " +
                    "(:title IS NULL OR b.title LIKE %:title%) AND " +
                    "(:author IS NULL OR b.author LIKE %:author%) AND " +
                    "(:category IS NULL OR b.category = :category) AND " +
                    "(:status IS NULL OR b.status = :status) AND " +
                    "b.status != 'DELETED'"
    )
    Page<Book> searchBooks(
            String title,
            String author,
            String category,
            String status,
            Pageable pageable
    );
}
