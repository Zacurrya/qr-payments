package com.example.qr_payments.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.qr_payments.dto.AuthResponse;
import com.example.qr_payments.dto.LoginRequest;
import com.example.qr_payments.dto.RegisterRequest;
import com.example.qr_payments.service.SupabaseAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SupabaseAuthService supabaseAuthService;

    // POST /api/v1/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        AuthResponse response = supabaseAuthService.registerUser(
                request.username(),
                request.password(),
                request.initialBalance(),
                request.currency(),
                request.accountType());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = supabaseAuthService.loginUser(
                request.username(),
                request.password());
        return ResponseEntity.ok(response);
    }
}
