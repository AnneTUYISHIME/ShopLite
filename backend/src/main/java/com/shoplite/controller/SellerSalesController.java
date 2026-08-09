package com.shoplite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplite.dto.SellerSaleResponse;
import com.shoplite.service.OrderService;

@RestController
@RequestMapping("/api/seller/sales")
public class SellerSalesController {

    private final OrderService orderService;

    public SellerSalesController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<SellerSaleResponse>> getMySales(Authentication authentication) {
        return ResponseEntity.ok(orderService.getSellerSales(authentication.getName()));
    }
}
