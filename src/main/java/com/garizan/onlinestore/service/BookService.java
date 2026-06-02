package com.garizan.onlinestore.service;

import lombok.RequiredArgsConstructor;
import com.garizan.onlinestore.model.Author;
import com.garizan.onlinestore.model.Book;
import com.garizan.onlinestore.repository.AuthorRepository;
import com.garizan.onlinestore.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public List<Book> getAll() {
        return bookRepository.findByQuantityGreaterThan(0);
    }

    public Book getById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public Book create(Book book) {
        Author author = authorRepository.findById(book.getAuthor().getId()).orElse(null);
        book.setAuthor(author);
        return bookRepository.save(book);
    }

    public Book update(Long id, Book updated) {
        Book book = getById(id);

        book.setTitle(updated.getTitle());
        book.setPrice(updated.getPrice());
        book.setQuantity(updated.getQuantity());

        if (updated.getAuthor() != null && updated.getAuthor().getId() != null) {
            Author author = authorRepository.findById(updated.getAuthor().getId()).orElse(null);
            book.setAuthor(author);
        }

        return bookRepository.save(book);
    }

    public void delete(Long id) {
        bookRepository.deleteById(id);
    }

    public List<Book> searchByTitle(String title) {
        if (title == null || title.isBlank()) {
            return bookRepository.findByQuantityGreaterThan(0);
        }

        return bookRepository.findByTitleContainingIgnoreCaseAndQuantityGreaterThan(
                title.trim(),
                0
        );
    }
}