package com.shoplite.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplite.dto.ProductResponse;
import com.shoplite.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getMyWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getMyWishlist(authentication.getName()));
    }

    @GetMapping("/ids")
    public ResponseEntity<List<Long>> getMyWishlistIds(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getMyWishlistProductIds(authentication.getName()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId, Authentication authentication) {
        wishlistService.addToWishlist(authentication.getName(), productId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId, Authentication authentication) {
        wishlistService.removeFromWishlist(authentication.getName(), productId);
        return ResponseEntity.noContent().build();
    }
}
