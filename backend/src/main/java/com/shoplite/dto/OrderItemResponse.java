package com.shoplite.dto;

public class OrderItemResponse {

    private String productName;
    private Integer quantity;
    private Double priceAtPurchase;

    public OrderItemResponse() {
    }

    public OrderItemResponse(String productName, Integer quantity, Double priceAtPurchase) {
        this.productName = productName;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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