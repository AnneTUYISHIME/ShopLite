package com.shoplite.dto;

import java.time.LocalDateTime;

public class SellerSaleResponse {

    private Long orderId;
    private String status;
    private LocalDateTime createdAt;
    private String buyerName;
    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private Double priceAtPurchase;
    private Double subtotal;

    public SellerSaleResponse() {
    }

    public SellerSaleResponse(Long orderId, String status, LocalDateTime createdAt, String buyerName,
                               String productName, String productImageUrl, Integer quantity,
                               Double priceAtPurchase, Double subtotal) {
        this.orderId = orderId;
        this.status = status;
        this.createdAt = createdAt;
        this.buyerName = buyerName;
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
        this.subtotal = subtotal;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(Double priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }
}
