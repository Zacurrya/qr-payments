package com.example.qr_payments.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.qr_payments.dto.PaymentRequest;
import com.example.qr_payments.service.IdempotencyService;
import com.example.qr_payments.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final IdempotencyService idempotencyService;

    @PostMapping
    public ResponseEntity<Void> processPayment(
            @RequestBody PaymentRequest request,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey) {

        // If the client supplied an idempotency key, enforce deduplication via Redis.
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            boolean isFirst = idempotencyService.isFirstRequest(idempotencyKey);
            if (!isFirst) {
                // Duplicate request — return 200 OK without reprocessing.
                log.info("Returning cached 200 for duplicate idempotency key: {}", idempotencyKey);
                return ResponseEntity.ok().build();
            }
        }

        paymentService.processPayment(
                request.debtorId(),
                request.creditorId(),
                request.amount(),
                request.reference()
        );

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
