package com.garizan.onlinestore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garizan.onlinestore.model.Book;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
}
