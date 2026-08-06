package com.shoplite.controller;

import com.shoplite.dto.ProductRequest;
import com.shoplite.dto.ProductResponse;
import com.shoplite.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products")
public class SellerController {

    private final ProductService productService;

    public SellerController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<ProductResponse>> getMyProducts(Authentication authentication) {
        return ResponseEntity.ok(productService.getMyProducts(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request,
                                                           Authentication authentication) {
        ProductResponse response = productService.createProduct(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                          @Valid @RequestBody ProductRequest request,
                                                          Authentication authentication) {
        ProductResponse response = productService.updateProduct(id, request, authentication.getName(), false);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, Authentication authentication) {
        productService.deleteProduct(id, authentication.getName(), false);
        return ResponseEntity.noContent().build();
    }
}