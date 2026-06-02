package com.garizan.onlinestore.dto;

public record CheckoutItemRequest(
        Long bookId,
        Integer quantity
) {}
