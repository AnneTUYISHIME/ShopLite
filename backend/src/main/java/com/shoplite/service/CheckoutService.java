package com.shoplite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.shoplite.dto.CartItemRequest;
import com.shoplite.dto.CheckoutRequest;
import com.shoplite.dto.CheckoutResponse;
import com.shoplite.entity.Order;
import com.shoplite.entity.OrderItem;
import com.shoplite.entity.OrderStatus;
import com.shoplite.entity.Product;
import com.shoplite.entity.User;
import com.shoplite.repository.OrderItemRepository;
import com.shoplite.repository.OrderRepository;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.UserRepository;

@Service
public class CheckoutService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final FlutterwaveService flutterwaveService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public CheckoutService(ProductRepository productRepository,
                            OrderRepository orderRepository,
                            OrderItemRepository orderItemRepository,
                            UserRepository userRepository,
                            FlutterwaveService flutterwaveService) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.flutterwaveService = flutterwaveService;
    }

    public CheckoutResponse checkout(CheckoutRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // validate each item and calculate the real total ourselves
        double total = 0.0;
        for (CartItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("Product not found: " + item.getProductId()));

            if (product.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for: " + product.getName());
            }

            total += product.getPrice() * item.getQuantity();
        }

        //  create the Order record, status PENDING (not paid yet)
        String txRef = "shoplite-" + System.currentTimeMillis();
        Order order = new Order(user, OrderStatus.PENDING, total, txRef);
        Order savedOrder = orderRepository.save(order);

        
        for (CartItemRequest item : request.getItems()) {
            Product product = productRepository.findById(item.getProductId()).get();
            OrderItem orderItem = new OrderItem(savedOrder, product, item.getQuantity(), product.getPrice());
            orderItemRepository.save(orderItem);
        }

        
        String redirectUrl = frontendUrl + "/order-confirmation";
        String paymentLink = flutterwaveService.initiatePayment(
                txRef, total, user.getEmail(), user.getName(), redirectUrl);

        //  hand the link back so the frontend can redirect the customer
        return new CheckoutResponse(paymentLink, txRef);
    }
}