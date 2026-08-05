package com.shoplite.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public class CheckoutRequest {

    @NotEmpty(message = "Cart cannot be empty")
    @Valid
    private List<CartItemRequest> items;

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }
}