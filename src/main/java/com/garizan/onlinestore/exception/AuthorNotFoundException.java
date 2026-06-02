package com.garizan.onlinestore.exception;

public class AuthorNotFoundException extends BookstoreException {

    public AuthorNotFoundException(Long id) {
        super("Author not found with id: " + id);
    }
}