package com.shoplite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoplite.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}