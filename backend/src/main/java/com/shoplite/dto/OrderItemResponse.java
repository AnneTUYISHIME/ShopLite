package com.shoplite.dto;

public class OrderItemResponse {

    private String productName;
    private String productImageUrl;
    private Integer quantity;
    private Double priceAtPurchase;

    public OrderItemResponse() {
    }

    public OrderItemResponse(String productName, String productImageUrl, Integer quantity, Double priceAtPurchase) {
        this.productName = productName;
        this.productImageUrl = productImageUrl;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
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
}