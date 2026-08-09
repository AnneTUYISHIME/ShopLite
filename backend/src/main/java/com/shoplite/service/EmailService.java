package com.shoplite.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(toEmail);
        message.setSubject("Reset your ShopLite password");
        message.setText(
                "We received a request to reset your ShopLite password.\n\n" +
                "Click the link below to choose a new password. This link expires in 30 minutes:\n\n" +
                resetLink + "\n\n" +
                "If you didn't request this, you can safely ignore this email."
        );
        mailSender.send(message);
    }
}
