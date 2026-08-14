package com.example.qr_payments.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.qr_payments.dto.LedgerEntryResponse;
import com.example.qr_payments.model.LedgerEntry;
import com.example.qr_payments.repository.LedgerEntryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerEntryRepository ledgerEntryRepository;

    @Transactional(readOnly = true)
    public List<LedgerEntryResponse> getAccountLedgers(UUID accountId, int limit) {
        Page<LedgerEntryResponse> entries = ledgerEntryRepository.findLedgersWithCounterparty(
            accountId, 
            PageRequest.of(0, limit)
        );

        return entries.getContent();
    }
}
