package com.garizan.onlinestore.controller;

import com.garizan.onlinestore.dto.AuthResponse;
import com.garizan.onlinestore.dto.LoginRequest;
import com.garizan.onlinestore.dto.RegisterRequest;
import com.garizan.onlinestore.model.Customer;
import com.garizan.onlinestore.security.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        Customer customer = authService.register(req);
        String token = authService.generateToken(customer);

        return new AuthResponse(
                token,
                customer.getId(),
                customer.getRole()
        );
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        Customer customer = authService.login(req);
        String token = authService.generateToken(customer);

        return new AuthResponse(
                token,
                customer.getId(),
                customer.getRole()
        );
    }
}