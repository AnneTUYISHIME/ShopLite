package com.shoplite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoplite.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}