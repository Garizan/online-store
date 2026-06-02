package com.garizan.onlinestore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garizan.onlinestore.model.Book;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(String title);

    List<Book> findByQuantityGreaterThan(Integer quantity);

    List<Book> findByTitleContainingIgnoreCaseAndQuantityGreaterThan(
            String title,
            Integer quantity
    );
}
