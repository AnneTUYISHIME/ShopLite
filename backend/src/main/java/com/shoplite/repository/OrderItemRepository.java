package com.shoplite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoplite.entity.OrderItem;
import com.shoplite.entity.OrderStatus;
import com.shoplite.entity.User;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByProduct_SellerOrderByOrder_CreatedAtDesc(User seller);

    boolean existsByProduct_IdAndOrder_UserAndOrder_Status(Long productId, User user, OrderStatus status);
}