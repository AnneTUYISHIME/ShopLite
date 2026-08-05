package com.shoplite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoplite.entity.Order;
import com.shoplite.entity.User;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);

    Optional<Order> findByFlutterwaveTxRef(String flutterwaveTxRef);
}