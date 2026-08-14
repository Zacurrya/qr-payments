package com.example.qr_payments.dto;

import java.math.BigDecimal;
import com.example.qr_payments.model.AccountType;

public record RegisterRequest(
    String username,
    String password,
    BigDecimal initialBalance,
    String currency,
    AccountType accountType
) {}

