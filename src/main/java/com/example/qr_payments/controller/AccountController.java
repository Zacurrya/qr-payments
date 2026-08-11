package com.example.qr_payments.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.qr_payments.dto.AccountResponse;
import com.example.qr_payments.dto.CreateAccountRequest;
import com.example.qr_payments.service.AccountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;

    // POST /api/v1/accounts
    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@RequestBody CreateAccountRequest request) {

        AccountResponse response = accountService.createAccount(
            request.accountType(),
            request.currency()    
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/v1/accounts/{user_id}
    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable UUID id) {
        
        AccountResponse response = accountService.getAccount(id);

        return ResponseEntity.ok(response);
    }
}
