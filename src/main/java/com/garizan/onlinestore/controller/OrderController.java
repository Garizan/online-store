package com.garizan.onlinestore.controller;

import com.garizan.onlinestore.model.OrderItem;
import com.garizan.onlinestore.service.OrderService;
import com.garizan.onlinestore.model.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        return orderService.create(order);
    }

    @PostMapping("/{id}/items")
    public Order addItem(@PathVariable Long id, @RequestBody OrderItem item) {
        return orderService.addItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderService.delete(id);
    }
}
