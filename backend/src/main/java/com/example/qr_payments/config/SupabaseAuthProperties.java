package com.example.qr_payments.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Data;

@Data
@ConfigurationProperties(prefix = "supabase")
public class SupabaseAuthProperties {
    private String url;
    private String serviceRoleKey;
    private String anonKey;
}
