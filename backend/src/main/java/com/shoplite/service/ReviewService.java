package com.shoplite.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoplite.dto.ReviewRequest;
import com.shoplite.dto.ReviewResponse;
import com.shoplite.entity.OrderStatus;
import com.shoplite.entity.Product;
import com.shoplite.entity.Review;
import com.shoplite.entity.User;
import com.shoplite.repository.OrderItemRepository;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.ReviewRepository;
import com.shoplite.repository.UserRepository;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository,
                          UserRepository userRepository, OrderItemRepository orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<ReviewResponse> getReviewsForProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        return reviewRepository.findByProductOrderByCreatedAtDesc(product)
                .stream()
                .map(r -> new ReviewResponse(r.getId(), r.getUser().getName(), r.getRating(), r.getComment(), r.getCreatedAt()))
                .toList();
    }

    public ReviewResponse addReview(Long productId, String userEmail, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean purchased = orderItemRepository.existsByProduct_IdAndOrder_UserAndOrder_Status(
                productId, user, OrderStatus.PAID);
        if (!purchased) {
            throw new IllegalArgumentException("You can only review products you've purchased and paid for.");
        }

        if (reviewRepository.existsByProductAndUser(product, user)) {
            throw new IllegalArgumentException("You've already reviewed this product.");
        }

        Review review = new Review(product, user, request.getRating(), request.getComment());
        Review saved = reviewRepository.save(review);

        return new ReviewResponse(saved.getId(), user.getName(), saved.getRating(), saved.getComment(), saved.getCreatedAt());
    }
}
