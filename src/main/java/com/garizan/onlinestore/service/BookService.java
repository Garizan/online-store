package com.garizan.onlinestore.service;

import com.garizan.onlinestore.exception.AuthorNotFoundException;
import com.garizan.onlinestore.exception.BookNotFoundException;
import com.garizan.onlinestore.exception.InvalidOperationException;
import com.garizan.onlinestore.model.Author;
import com.garizan.onlinestore.model.Book;
import com.garizan.onlinestore.repository.AuthorRepository;
import com.garizan.onlinestore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    public Book create(Book book) {
        validateBook(book);

        Author author = authorRepository.findById(book.getAuthor().getId())
                .orElseThrow(() -> new AuthorNotFoundException(book.getAuthor().getId()));

        book.setAuthor(author);

        return bookRepository.save(book);
    }

    public Book update(Long id, Book updated) {
        Book book = getById(id);

        validateBook(updated);

        book.setTitle(updated.getTitle());
        book.setGenre(updated.getGenre());
        book.setPrice(updated.getPrice());
        book.setQuantity(updated.getQuantity());

        if (updated.getAuthor() != null && updated.getAuthor().getId() != null) {
            Author author = authorRepository.findById(updated.getAuthor().getId())
                    .orElseThrow(() -> new AuthorNotFoundException(updated.getAuthor().getId()));

            book.setAuthor(author);
        }

        return bookRepository.save(book);
    }

    public void delete(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }

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

    private void validateBook(Book book) {
        if (book == null) {
            throw new InvalidOperationException("Book data is required");
        }

        if (book.getTitle() == null || book.getTitle().isBlank()) {
            throw new InvalidOperationException("Book title is required");
        }

        if (book.getGenre() == null) {
            throw new InvalidOperationException("Book genre is required");
        }

        if (book.getPrice() == null || book.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidOperationException("Book price must be greater than or equal to zero");
        }

        if (book.getQuantity() == null || book.getQuantity() < 0) {
            throw new InvalidOperationException("Book quantity must be greater than or equal to zero");
        }

        if (book.getAuthor() == null || book.getAuthor().getId() == null) {
            throw new InvalidOperationException("Author ID is required");
        }
    }
}