package com.garizan.onlinestore.security;

import com.garizan.onlinestore.dto.LoginRequest;
import com.garizan.onlinestore.dto.RegisterRequest;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public Customer register(RegisterRequest req) {

        if (customerRepository.existsByEmail(req.email())) {
            throw new RuntimeException("User already exists");
        }

        Customer user = new Customer();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));

        return customerRepository.save(user);
    }

    public Customer login(LoginRequest req) {
        Customer user = customerRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    public String generateToken(Customer customer) {
        return jwtService.generateToken(customer.getEmail());
    }
}