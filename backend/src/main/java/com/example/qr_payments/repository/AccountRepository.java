package com.example.qr_payments.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.example.qr_payments.model.Account;

import io.lettuce.core.dynamic.annotation.Param;
import jakarta.persistence.LockModeType;

public interface AccountRepository extends JpaRepository<Account, UUID> {
    
    // Finds a user row by ID and applies a pessimistic lock
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") UUID id);

    Optional<Account> findBySupabaseUserId(UUID supabaseUserId);

    Optional<Account> findByUsername(String username);

    boolean existsByUsername(String username);
}

