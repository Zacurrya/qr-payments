package com.example.qr_payments.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.qr_payments.model.LedgerEntry;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {
    
    List<LedgerEntry> findByTransactionId(UUID transactionId);
}
