package com.example.qr_payments.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.HashMap;

@Service
public class CurrencyService {

    // Hardcoded conversion rates relative to USD
    // Temporary, eventually would use real-time conversion rates via an API
    private static final Map<String, BigDecimal> RATES = new HashMap<>();

    static {
        RATES.put("USD", new BigDecimal("1.0"));
        RATES.put("EUR", new BigDecimal("0.92"));
        RATES.put("GBP", new BigDecimal("0.79"));
        RATES.put("JPY", new BigDecimal("150.50"));
        RATES.put("AUD", new BigDecimal("1.53"));
        RATES.put("CAD", new BigDecimal("1.35"));
        RATES.put("CHF", new BigDecimal("0.88"));
        RATES.put("INR", new BigDecimal("83.00"));
        RATES.put("SGD", new BigDecimal("1.34"));
        RATES.put("NZD", new BigDecimal("1.64"));
        RATES.put("ZAR", new BigDecimal("18.80"));
        RATES.put("BRL", new BigDecimal("4.95"));
        RATES.put("MXN", new BigDecimal("17.10"));
        RATES.put("MYR", new BigDecimal("4.78"));
        RATES.put("IDR", new BigDecimal("15600.00"));
        RATES.put("THB", new BigDecimal("35.80"));
        RATES.put("PHP", new BigDecimal("55.90"));
        RATES.put("VND", new BigDecimal("24600.00"));
        RATES.put("KRW", new BigDecimal("1330.00"));
        RATES.put("SEK", new BigDecimal("10.40"));
        RATES.put("NOK", new BigDecimal("10.60"));
        RATES.put("DKK", new BigDecimal("6.85"));
        RATES.put("PLN", new BigDecimal("3.98"));
    }

    /**
     * Converts an amount from one currency to another.
     * Conversion logic: amount * (targetRate / sourceRate)
     */
    public BigDecimal convert(BigDecimal amount, String fromCurrency, String toCurrency) {
        if (fromCurrency.equalsIgnoreCase(toCurrency)) {
            return amount;
        }

        BigDecimal sourceRate = RATES.getOrDefault(fromCurrency.toUpperCase(), BigDecimal.ONE);
        BigDecimal targetRate = RATES.getOrDefault(toCurrency.toUpperCase(), BigDecimal.ONE);

        // amountInUsd = amount / sourceRate
        // targetAmount = amountInUsd * targetRate
        BigDecimal targetAmount = amount
                .divide(sourceRate, 10, RoundingMode.HALF_UP)
                .multiply(targetRate)
                .setScale(2, RoundingMode.HALF_UP);

        return targetAmount;
    }
}
