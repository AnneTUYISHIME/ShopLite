package com.shoplite.service;

import java.time.LocalDateTime;
import java.util.UUID;

import com.shoplite.dto.AuthResponse;
import com.shoplite.dto.LoginRequest;
import com.shoplite.dto.RegisterRequest;
import com.shoplite.entity.PasswordResetToken;
import com.shoplite.entity.Role;
import com.shoplite.entity.User;
import com.shoplite.repository.PasswordResetTokenRepository;
import com.shoplite.repository.UserRepository;
import com.shoplite.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.password-reset.token-expiration-minutes}")
    private long tokenExpirationMinutes;

    public AuthService(UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuthenticationManager authenticationManager,
                        JwtService jwtService,
                        PasswordResetTokenRepository passwordResetTokenRepository,
                        EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Public registration only allows CUSTOMER or SELLER.
        // Admin accounts are created separately, directly in the database,
        // same protective pattern used in previous projects.
        Role role;
        try {
            role = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Role must be CUSTOMER or SELLER");
        }

        if (role == Role.ADMIN) {
            throw new IllegalArgumentException("Role must be CUSTOMER or SELLER");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                role
        );

        User saved = userRepository.save(user);

        return new AuthResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().name(),
                "User registered successfully",
                null
        );
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (Exception ex) {
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new SecurityException("This account has been deactivated. Contact support.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                "Login successful",
                token
        );
    }

    // Always returns the same generic outcome regardless of whether the email
    // exists, so this endpoint can't be used to check which emails are registered.
    public void requestPasswordReset(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            PasswordResetToken resetToken = new PasswordResetToken(
                    UUID.randomUUID().toString(),
                    user,
                    LocalDateTime.now().plusMinutes(tokenExpirationMinutes)
            );
            passwordResetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken.getToken();
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset link"));

        if (resetToken.isUsed() || resetToken.isExpired()) {
            throw new IllegalArgumentException("Invalid or expired reset link");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}