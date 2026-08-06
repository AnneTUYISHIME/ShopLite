package com.shoplite.service;

import com.shoplite.dto.AdminOrderResponse;
import com.shoplite.dto.AdminUserResponse;
import com.shoplite.dto.OrderItemResponse;
import com.shoplite.entity.Order;
import com.shoplite.entity.User;
import com.shoplite.repository.OrderRepository;
import com.shoplite.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;

    public AdminService(UserRepository userRepository, OrderRepository orderRepository, ProductService productService) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productService = productService;
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(u -> new AdminUserResponse(u.getId(), u.getName(), u.getEmail(), u.getRole().name(), u.isEnabled()))
                .toList();
    }

    public AdminUserResponse setUserEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setEnabled(enabled);
        User saved = userRepository.save(user);

        return new AdminUserResponse(saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().name(), saved.isEnabled());
    }

    public void deleteProductAsAdmin(Long productId) {
        // isAdmin = true bypasses the "must own this product" check
        productService.deleteProduct(productId, null, true);
    }

    public List<AdminOrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toAdminOrderResponse)
                .toList();
    }

    private AdminOrderResponse toAdminOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase()
                ))
                .toList();

        return new AdminOrderResponse(
                order.getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                order.getStatus().name(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items
        );
    }
}