package com.garizan.onlinestore.service;

import lombok.RequiredArgsConstructor;
import com.garizan.onlinestore.model.Book;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.model.Order;
import com.garizan.onlinestore.model.OrderItem;
import com.garizan.onlinestore.repository.BookRepository;
import com.garizan.onlinestore.repository.CustomerRepository;
import com.garizan.onlinestore.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final CustomerRepository customerRepository;

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order create(Order order) {
        Customer customer = customerRepository.findById(order.getCustomer().getId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        order.setCustomer(customer);
        return orderRepository.save(order);
    }

    public Order addItem(Long id, OrderItem item) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (item.getBook() == null || item.getBook().getId() == null) {
            throw new RuntimeException("book id is null");
        }

        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new RuntimeException("quantity is empty");
        }

        Book book = bookRepository.findById(item.getBook().getId())
                .orElseThrow(() -> new RuntimeException("book not found"));

        item.setOrder(order);
        item.setBook(book);

        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        order.getItems().add(item);

        return orderRepository.save(order);
    }

    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}