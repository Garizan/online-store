package com.garizan.onlinestore.service;

import com.garizan.onlinestore.exception.CustomerNotFoundException;
import com.garizan.onlinestore.exception.InvalidOperationException;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException(id));
    }

    public Customer create(Customer customer) {
        validateCustomer(customer);

        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer customer = findById(id);

        validateCustomer(updated);

        customer.setName(updated.getName());
        customer.setEmail(updated.getEmail());

        return customerRepository.save(customer);
    }

    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException(id);
        }

        customerRepository.deleteById(id);
    }

    private void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new InvalidOperationException("Customer data is required");
        }

        if (customer.getName() == null || customer.getName().isBlank()) {
            throw new InvalidOperationException("Customer name is required");
        }

        if (customer.getEmail() == null || customer.getEmail().isBlank()) {
            throw new InvalidOperationException("Customer email is required");
        }
    }
}