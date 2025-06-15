// AuthController.java
package com.backenddailyboard.dailyboard.controller;

import com.backenddailyboard.dailyboard.model.User;
import com.backenddailyboard.dailyboard.repository.UserRepository;
import com.backenddailyboard.dailyboard.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth/oauth") // ✅ matches your SecurityConfig defaultSuccessUrl
@CrossOrigin(origins = "http://localhost:3000") // ✅ React frontend allowed
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/success")
    public void handleOAuthSuccess(@AuthenticationPrincipal OAuth2User oAuth2User,
                                   HttpServletResponse response) throws IOException {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // Save user to DB if not already present
        userRepository.findByGoogleId(googleId).orElseGet(() -> {
            User newUser = new User();
            newUser.setGoogleId(googleId);
            newUser.setEmail(email);
            newUser.setName(name);
            return userRepository.save(newUser);
        });

        // Generate JWT token
        String token = jwtUtil.generateToken(googleId, email);

        // Redirect to frontend with token
        response.sendRedirect("http://localhost:3000?token=" + token);
    }

    @GetMapping("/failure")
    public ResponseEntity<?> handleOAuthFailure() {
        return ResponseEntity.status(401).body("OAuth2 login failed");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer "
            String userId = jwtUtil.extractUserId(token);
            String email = jwtUtil.extractEmail(token);

            Optional<User> userOptional = userRepository.findByGoogleId(userId);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                return ResponseEntity.ok(Map.of(
                    "userId", user.getGoogleId(),
                    "email", user.getEmail(),
                    "name", user.getName()
                ));
            }

            return ResponseEntity.ok(Map.of(
                "userId", userId,
                "email", email
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }
}
