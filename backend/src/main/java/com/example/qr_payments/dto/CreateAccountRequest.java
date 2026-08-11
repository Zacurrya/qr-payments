package com.example.qr_payments.dto;

import com.example.qr_payments.model.AccountType;

public record CreateAccountRequest(
    AccountType accountType,
    String currency
) {}
