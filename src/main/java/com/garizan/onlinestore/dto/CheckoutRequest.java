package com.garizan.onlinestore.dto;

import java.util.List;

public record CheckoutRequest(
        Long customerId,
        List<CheckoutItemRequest> items
) {}