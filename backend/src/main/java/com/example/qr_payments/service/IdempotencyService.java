package com.example.qr_payments.service;

import java.time.Duration;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Manages idempotency keys in Redis to prevent duplicate payment processing.
 *
 * <p>A key is stored as "idempotency:<key>" with a 24-hour TTL. The first
 * request with a given key is allowed through; subsequent requests with the
 * same key are detected as duplicates and silently skipped.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private static final String KEY_PREFIX = "idempotency:";
    private static final Duration TTL = Duration.ofHours(24);

    private final StringRedisTemplate redisTemplate;

    /**
     * Atomically checks whether the given idempotency key is fresh, and if so
     * marks it as seen.
     *
     * @param idempotencyKey the client-supplied idempotency key
     * @return {@code true} if this is the first time we've seen this key
     *         (i.e. the request should be processed); {@code false} if the key
     *         was already present (i.e. this is a duplicate that should be
     *         skipped).
     */
    public boolean isFirstRequest(String idempotencyKey) {
        String redisKey = KEY_PREFIX + idempotencyKey;

        // SETNX — set only if absent; returns true when the key was newly created
        Boolean wasAbsent = redisTemplate.opsForValue().setIfAbsent(redisKey, "1", TTL);

        if (Boolean.TRUE.equals(wasAbsent)) {
            log.debug("Idempotency key accepted (first request): {}", idempotencyKey);
            return true;
        }

        log.warn("Duplicate payment request detected. Idempotency key already used: {}", idempotencyKey);
        return false;
    }
}
