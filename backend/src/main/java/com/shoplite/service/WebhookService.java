package com.shoplite.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.shoplite.entity.Order;
import com.shoplite.entity.OrderStatus;
import com.shoplite.entity.Product;
import com.shoplite.repository.OrderRepository;
import com.shoplite.repository.ProductRepository;

@Service
public class WebhookService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final FlutterwaveService flutterwaveService;

    @Value("${app.flutterwave.webhook-hash}")
    private String webhookHash;

    public WebhookService(OrderRepository orderRepository,
                           ProductRepository productRepository,
                           FlutterwaveService flutterwaveService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.flutterwaveService = flutterwaveService;
    }

    public void handleFlutterwaveWebhook(String receivedHash, Map<String, Object> payload) {

        // Step 1: reject the request outright if the secret hash doesn't match.
        // This is what stops a stranger from just POSTing fake "payment succeeded"
        // data straight to this URL.
        if (webhookHash == null || !webhookHash.equals(receivedHash)) {
            throw new SecurityException("Invalid webhook signature");
        }

        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        String transactionId = String.valueOf(data.get("id"));
        String txRef = (String) data.get("tx_ref");

        // Step 2: never trust the webhook payload's "status" field alone -
        // call Flutterwave directly and ask "is this really paid?"
        Map<String, Object> verifiedData = flutterwaveService.verifyTransaction(transactionId);
        String verifiedStatus = (String) verifiedData.get("status");

        Order order = orderRepository.findByFlutterwaveTxRef(txRef)
                .orElseThrow(() -> new IllegalArgumentException("Order not found for tx_ref: " + txRef));

        if ("successful".equals(verifiedStatus)) {
            order.setStatus(OrderStatus.PAID);
            orderRepository.save(order);

            // Now that payment is confirmed
            for (var item : order.getItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }
        } else {
            order.setStatus(OrderStatus.FAILED);
            orderRepository.save(order);
        }
    }
}