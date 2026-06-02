package com.garizan.onlinestore.exception;

public class BookNotFoundException extends BookstoreException {

    public BookNotFoundException(Long id) {
        super("Book not found with id: " + id);
    }
}