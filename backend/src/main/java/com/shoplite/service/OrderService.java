package com.shoplite.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoplite.dto.OrderItemResponse;
import com.shoplite.dto.OrderResponse;
import com.shoplite.dto.SellerSaleResponse;
import com.shoplite.entity.Order;
import com.shoplite.entity.OrderItem;
import com.shoplite.entity.User;
import com.shoplite.repository.OrderItemRepository;
import com.shoplite.repository.OrderRepository;
import com.shoplite.repository.UserRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                         OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items
        );
    }

    // Only returns line items for products the seller actually owns - never
    // exposes other sellers' items or the buyer's full order total.
    public List<SellerSaleResponse> getSellerSales(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        return orderItemRepository.findByProduct_SellerOrderByOrder_CreatedAtDesc(seller)
                .stream()
                .map(this::toSellerSaleResponse)
                .toList();
    }

    private SellerSaleResponse toSellerSaleResponse(OrderItem item) {
        Order order = item.getOrder();
        return new SellerSaleResponse(
                order.getId(),
                order.getStatus().name(),
                order.getCreatedAt(),
                order.getUser().getName(),
                item.getProduct().getName(),
                item.getProduct().getImageUrl(),
                item.getQuantity(),
                item.getPriceAtPurchase(),
                item.getPriceAtPurchase() * item.getQuantity()
        );
    }
}