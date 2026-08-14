package com.example.qr_payments.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.qr_payments.model.LedgerEntry;

public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {
    
    List<LedgerEntry> findByTransactionId(UUID transactionId);

    @org.springframework.data.jpa.repository.Query("SELECT new com.example.qr_payments.dto.LedgerEntryResponse(" +
       "l.id, l.transactionId, l.accountId, l.amount, l.entryType, l.referenceCode, l.createdAt, a.username) " +
       "FROM LedgerEntry l " +
       "LEFT JOIN LedgerEntry opp ON l.transactionId = opp.transactionId AND l.id != opp.id " +
       "LEFT JOIN Account a ON opp.accountId = a.id " +
       "WHERE l.accountId = :accountId " +
       "ORDER BY l.createdAt DESC")
    Page<com.example.qr_payments.dto.LedgerEntryResponse> findLedgersWithCounterparty(@org.springframework.data.repository.query.Param("accountId") UUID accountId, Pageable pageable);
}
