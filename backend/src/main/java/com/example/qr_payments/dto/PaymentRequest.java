package com.example.qr_payments.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentRequest(    
    UUID debtorId,
    UUID creditorId,
    BigDecimal amount,
    String currency,
    String reference
) {}
