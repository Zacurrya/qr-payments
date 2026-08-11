package com.example.qr_payments.service;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.qr_payments.model.Account;
import com.example.qr_payments.model.EntryType;
import com.example.qr_payments.model.LedgerEntry;
import com.example.qr_payments.repository.AccountRepository;
import com.example.qr_payments.repository.LedgerEntryRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final AccountRepository accountRepository;
    private final LedgerEntryRepository ledgerEntryRepository;

    @Transactional
    public void processPayment(UUID debtorId, UUID creditorId, BigDecimal amount, String reference) {

        // Pessimisticly lock both accounts
        Account debtor = accountRepository.findByIdForUpdate(debtorId)
        .orElseThrow(() -> new RuntimeException("Debtor account not found"));
        Account creditor = accountRepository.findByIdForUpdate(creditorId)
        .orElseThrow(() -> new RuntimeException("Creditor account not found"));
        
        // Validate funds
        if (debtor.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        // Process transaction
        debtor.setBalance(debtor.getBalance().subtract(amount));
        creditor.setBalance(creditor.getBalance().add(amount));

        accountRepository.save(debtor);
        accountRepository.save(creditor);

        // Record the immutable ledger entries for both the creditor and debtor
        UUID transactionId = UUID.randomUUID();

        LedgerEntry debitEntry = new LedgerEntry();
        debitEntry.setTransactionId(transactionId);
        debitEntry.setAccountId(debtor.getId());
        debitEntry.setAmount(amount.negate()); // Money leaving the debtor
        debitEntry.setEntryType(EntryType.DEBIT);
        debitEntry.setReferenceCode(reference);        

        LedgerEntry creditEntry = new LedgerEntry();
        creditEntry.setTransactionId(transactionId);
        creditEntry.setAccountId(creditor.getId());
        creditEntry.setAmount(amount); // Money arriving at the creditor
        creditEntry.setEntryType(EntryType.CREDIT);
        creditEntry.setReferenceCode(reference);

        ledgerEntryRepository.save(debitEntry);
        ledgerEntryRepository.save(creditEntry);        
    }
}
