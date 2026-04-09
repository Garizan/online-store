package com.garizan.onlinestore.security;

import com.garizan.onlinestore.dto.LoginRequest;
import com.garizan.onlinestore.dto.RegisterRequest;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CustomerRepository customerRepository;
    private final JwtService jwtService;

    public String register(RegisterRequest req) {

        if (customerRepository.existsByEmail(req.email())) {
            throw new RuntimeException("User already exists");
        }

        Customer user = new Customer();
        user.setName(req.name());
        user.setEmail(req.email());

        user.setPasswordHash(req.password());

        customerRepository.save(user);

        return jwtService.generateToken(user.getEmail());
    }

    public String login(LoginRequest req) {

        Customer user = customerRepository.findByEmail(req.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPasswordHash().equals(req.password())) {
            throw new RuntimeException("Wrong password");
        }

        return jwtService.generateToken(user.getEmail());
    }
}