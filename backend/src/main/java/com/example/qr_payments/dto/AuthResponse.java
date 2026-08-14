package com.example.qr_payments.dto;

import java.math.BigDecimal;
import java.util.UUID;
import com.example.qr_payments.model.AccountType;

public record AuthResponse(
    String accessToken,
    UUID userId,
    String username,
    UUID accountId,
    AccountType accountType,
    BigDecimal balance,
    String currency
) {}

