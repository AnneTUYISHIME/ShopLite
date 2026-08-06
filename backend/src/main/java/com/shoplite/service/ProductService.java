package com.shoplite.service;

import com.shoplite.dto.ProductRequest;
import com.shoplite.dto.ProductResponse;
import com.shoplite.entity.Product;
import com.shoplite.entity.User;
import com.shoplite.repository.ProductRepository;
import com.shoplite.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return toResponse(product);
    }

    public List<ProductResponse> getMyProducts(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        return productRepository.findBySeller(seller)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse createProduct(ProductRequest request, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getImageUrl(),
                request.getCategory(),
                request.getStock(),
                seller
        );
        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    // isAdmin lets an admin override ownership for moderation purposes -
    // sellers can only ever touch their own products.
    public ProductResponse updateProduct(Long id, ProductRequest request, String requesterEmail, boolean isAdmin) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!isAdmin && !product.getSeller().getEmail().equals(requesterEmail)) {
            throw new SecurityException("You can only edit your own products");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setStock(request.getStock());

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    public void deleteProduct(Long id, String requesterEmail, boolean isAdmin) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!isAdmin && !product.getSeller().getEmail().equals(requesterEmail)) {
            throw new SecurityException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory(),
                product.getStock(),
                product.getSeller().getId(),
                product.getSeller().getName()
        );
    }
}