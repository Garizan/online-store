package com.garizan.onlinestore.service;

import lombok.RequiredArgsConstructor;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.repository.CustomerRepository;
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
                .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer update(Long id, Customer updated) {
        Customer customer = findById(id);
        customer.setName(updated.getName());
        customer.setEmail(updated.getEmail());
        return customerRepository.save(customer);
    }

    public void delete(Long id) {
        customerRepository.deleteById(id);
    }
}
