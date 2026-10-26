package com.placement.portal.controller;

import com.placement.portal.dto.AuthRequest;
import com.placement.portal.dto.AuthResponse;
import com.placement.portal.dto.RegisterRequest;
import com.placement.portal.dto.UserDto;
import com.placement.portal.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody(required = false) Map<String, String> body) {
        String token = (body != null && body.containsKey("token")) ? body.get("token") : "mock_token";
        return ResponseEntity.ok(authService.socialLogin("Google", token));
    }

    @PostMapping("/apple")
    public ResponseEntity<AuthResponse> appleLogin(@RequestBody(required = false) Map<String, String> body) {
        String token = (body != null && body.containsKey("token")) ? body.get("token") : "mock_token";
        return ResponseEntity.ok(authService.socialLogin("Apple", token));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.getCurrentUser(userDetails.getUsername()));
    }
}
