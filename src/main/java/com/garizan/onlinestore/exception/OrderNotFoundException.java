package com.garizan.onlinestore.exception;

public class OrderNotFoundException extends BookstoreException {

    public OrderNotFoundException(Long id) {
        super("Order not found with id: " + id);
    }
}