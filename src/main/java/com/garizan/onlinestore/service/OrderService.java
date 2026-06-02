package com.garizan.onlinestore.service;

import com.garizan.onlinestore.dto.CheckoutItemRequest;
import com.garizan.onlinestore.dto.CheckoutRequest;
import com.garizan.onlinestore.exception.BookNotFoundException;
import com.garizan.onlinestore.exception.CustomerNotFoundException;
import com.garizan.onlinestore.exception.InvalidOperationException;
import com.garizan.onlinestore.exception.OrderNotFoundException;
import com.garizan.onlinestore.model.Book;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.model.Order;
import com.garizan.onlinestore.model.OrderItem;
import com.garizan.onlinestore.repository.BookRepository;
import com.garizan.onlinestore.repository.CustomerRepository;
import com.garizan.onlinestore.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
                .orElseThrow(() -> new OrderNotFoundException(id));
    }

    public List<Order> getByCustomerId(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new CustomerNotFoundException(customerId);
        }

        return orderRepository.findByCustomerId(customerId);
    }

    @Transactional
    public Order checkout(CheckoutRequest request) {
        validateCheckoutRequest(request);

        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new CustomerNotFoundException(request.customerId()));

        Order order = new Order();
        order.setCustomer(customer);

        List<OrderItem> orderItems = new ArrayList<>();

        for (CheckoutItemRequest itemRequest : request.items()) {
            if (itemRequest.bookId() == null) {
                throw new InvalidOperationException("Book ID is required");
            }

            if (itemRequest.quantity() == null || itemRequest.quantity() <= 0) {
                throw new InvalidOperationException("Quantity must be greater than zero");
            }

            Book book = bookRepository.findById(itemRequest.bookId())
                    .orElseThrow(() -> new BookNotFoundException(itemRequest.bookId()));

            if (book.getQuantity() < itemRequest.quantity()) {
                throw new InvalidOperationException(
                        "Not enough books in stock: " + book.getTitle()
                );
            }

            book.setQuantity(book.getQuantity() - itemRequest.quantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(book);
            orderItem.setQuantity(itemRequest.quantity());

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        return orderRepository.save(order);
    }

    public Order create(Order order) {
        if (order == null || order.getCustomer() == null || order.getCustomer().getId() == null) {
            throw new InvalidOperationException("Customer ID is required");
        }

        Customer customer = customerRepository.findById(order.getCustomer().getId())
                .orElseThrow(() -> new CustomerNotFoundException(order.getCustomer().getId()));

        order.setCustomer(customer);

        return orderRepository.save(order);
    }

    public Order addItem(Long id, OrderItem item) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));

        if (item.getBook() == null || item.getBook().getId() == null) {
            throw new InvalidOperationException("Book ID is required");
        }

        if (item.getQuantity() == null || item.getQuantity() <= 0) {
            throw new InvalidOperationException("Quantity must be greater than zero");
        }

        Book book = bookRepository.findById(item.getBook().getId())
                .orElseThrow(() -> new BookNotFoundException(item.getBook().getId()));

        if (book.getQuantity() < item.getQuantity()) {
            throw new InvalidOperationException(
                    "Not enough books in stock: " + book.getTitle()
            );
        }

        book.setQuantity(book.getQuantity() - item.getQuantity());

        item.setOrder(order);
        item.setBook(book);

        if (order.getItems() == null) {
            order.setItems(new ArrayList<>());
        }

        order.getItems().add(item);

        return orderRepository.save(order);
    }

    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new OrderNotFoundException(id);
        }

        orderRepository.deleteById(id);
    }

    private void validateCheckoutRequest(CheckoutRequest request) {
        if (request == null) {
            throw new InvalidOperationException("Checkout request is required");
        }

        if (request.customerId() == null) {
            throw new InvalidOperationException("Customer ID is required");
        }

        if (request.items() == null || request.items().isEmpty()) {
            throw new InvalidOperationException("Order items are required");
        }
    }
}