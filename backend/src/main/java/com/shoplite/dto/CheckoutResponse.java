package com.shoplite.dto;

public class CheckoutResponse {

    private String paymentLink;
    private String txRef;

    public CheckoutResponse() {
    }

    public CheckoutResponse(String paymentLink, String txRef) {
        this.paymentLink = paymentLink;
        this.txRef = txRef;
    }

    public String getPaymentLink() {
        return paymentLink;
    }

    public void setPaymentLink(String paymentLink) {
        this.paymentLink = paymentLink;
    }

    public String getTxRef() {
        return txRef;
    }

    public void setTxRef(String txRef) {
        this.txRef = txRef;
    }
}