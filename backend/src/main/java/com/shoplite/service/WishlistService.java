package com.shoplite.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoplite.dto.ProductResponse;
import com.shoplite.entity.Product;
import com.shoplite.entity.User;
import com.shoplite.entity.WishlistItem;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.UserRepository;
import com.shoplite.repository.WishlistItemRepository;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public WishlistService(WishlistItemRepository wishlistItemRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository,
                            ProductService productService) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    public List<ProductResponse> getMyWishlist(String userEmail) {
        User user = findUser(userEmail);
        return wishlistItemRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(item -> productService.toResponse(item.getProduct()))
                .toList();
    }

    public List<Long> getMyWishlistProductIds(String userEmail) {
        User user = findUser(userEmail);
        return wishlistItemRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(item -> item.getProduct().getId())
                .toList();
    }

    public void addToWishlist(String userEmail, Long productId) {
        User user = findUser(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (wishlistItemRepository.existsByUserAndProduct(user, product)) {
            return;
        }

        wishlistItemRepository.save(new WishlistItem(user, product));
    }

    public void removeFromWishlist(String userEmail, Long productId) {
        User user = findUser(userEmail);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        wishlistItemRepository.findByUserAndProduct(user, product)
                .ifPresent(wishlistItemRepository::delete);
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
