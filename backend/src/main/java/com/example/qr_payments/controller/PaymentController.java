package com.example.qr_payments.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.qr_payments.dto.PaymentRequest;
import com.example.qr_payments.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Void> processPayment(@RequestBody PaymentRequest request) {
        
        // Parse dto into service
        paymentService.processPayment(
            request.debtorId(), 
            request.creditorId(), 
            request.amount(), 
            request.reference()
        );
        
        return ResponseEntity.ok().build();
    }
}
