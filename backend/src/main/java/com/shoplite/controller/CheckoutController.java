package com.shoplite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplite.dto.CheckoutRequest;
import com.shoplite.dto.CheckoutResponse;
import com.shoplite.service.CheckoutService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class CheckoutController {

    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request,
                                                       Authentication authentication) {
        CheckoutResponse response = checkoutService.checkout(request, authentication.getName());
        return ResponseEntity.ok(response);
    }
}