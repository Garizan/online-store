package com.garizan.onlinestore.controller;

import com.garizan.onlinestore.dto.AuthResponse;
import com.garizan.onlinestore.dto.LoginRequest;
import com.garizan.onlinestore.dto.RegisterRequest;
import com.garizan.onlinestore.security.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {
        return new AuthResponse(authService.register(req));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        return new AuthResponse(authService.login(req));
    }
}
