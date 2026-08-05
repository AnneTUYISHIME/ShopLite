package com.shoplite.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FlutterwaveService {

    @Value("${app.flutterwave.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String BASE_URL = "https://api.flutterwave.com/v3";

    // Step 1: ask Flutterwave to create a payment session, and get back a link
    // the customer can be redirected to, to actually pay.
    public String initiatePayment(String txRef, Double amount, String customerEmail,
                                   String customerName, String redirectUrl) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> customer = new HashMap<>();
        customer.put("email", customerEmail);
        customer.put("name", customerName);

        Map<String, Object> customizations = new HashMap<>();
        customizations.put("title", "ShopLite Checkout");

        Map<String, Object> body = new HashMap<>();
        body.put("tx_ref", txRef);
        body.put("amount", amount);
        body.put("currency", "RWF");
        body.put("redirect_url", redirectUrl);
        body.put("payment_options", "card,mobilemoneyrwanda");
        body.put("customer", customer);
        body.put("customizations", customizations);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                BASE_URL + "/payments", HttpMethod.POST, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");

        return (String) data.get("link");
    }

    
    public Map<String, Object> verifyTransaction(String transactionId) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                BASE_URL + "/transactions/" + transactionId + "/verify",
                HttpMethod.GET, request, Map.class);

        Map<String, Object> responseBody = response.getBody();
        return (Map<String, Object>) responseBody.get("data");
    }
}