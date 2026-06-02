package com.garizan.onlinestore.exception;

public class CustomerNotFoundException extends BookstoreException {

    public CustomerNotFoundException(Long id) {
        super("Customer not found with id: " + id);
    }
}