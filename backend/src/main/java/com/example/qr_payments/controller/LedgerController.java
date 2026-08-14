package com.example.qr_payments.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.qr_payments.dto.LedgerEntryResponse;
import com.example.qr_payments.service.LedgerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/ledgers")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    // GET /api/v1/ledgers/account/{accountId}?limit=8
    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> getAccountLedgers(
            @PathVariable UUID accountId,
            @RequestParam(defaultValue = "100") int limit) {
        try {
            List<LedgerEntryResponse> responses = ledgerService.getAccountLedgers(accountId, limit);
            
            // Map to a list of maps to bypass any strict Record serialization issues
            List<java.util.Map<String, Object>> safeResponses = responses.stream().map(r -> {
                java.util.Map<String, Object> map = new java.util.HashMap<>();
                map.put("id", r.id());
                map.put("transactionId", r.transactionId());
                map.put("accountId", r.accountId());
                map.put("amount", r.amount());
                map.put("entryType", r.entryType().name());
                map.put("referenceCode", r.referenceCode());
                map.put("createdAt", r.createdAt() != null ? r.createdAt().toString() : null);
                map.put("counterpartyUsername", r.counterpartyUsername());
                return map;
            }).toList();

            return ResponseEntity.ok(safeResponses);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage() + " | Cause: " + (e.getCause() != null ? e.getCause().getMessage() : "null"));
        }
    }
}
