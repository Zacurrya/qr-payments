package com.example.qr_payments.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

import com.example.qr_payments.model.EntryType;

public record LedgerEntryResponse(
    UUID id,
    UUID transactionId,
    UUID accountId,
    BigDecimal amount,
    EntryType entryType,
    String referenceCode,
    OffsetDateTime createdAt,
    String counterpartyUsername
) {}
