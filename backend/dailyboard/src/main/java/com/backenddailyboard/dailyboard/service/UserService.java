package com.backenddailyboard.dailyboard.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.security.oauth2.core.user.OAuth2User;

import com.backenddailyboard.dailyboard.model.User;
import com.backenddailyboard.dailyboard.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User getOrCreateUser(OAuth2User principal) {
        String googleId = principal.getAttribute("sub");
        String email = principal.getAttribute("email");
        String name = principal.getAttribute("name");

        Optional<User> existing = repo.findByGoogleId(googleId);
        if (existing.isPresent()) return existing.get();

        User user = new User();
        user.setGoogleId(googleId);
        user.setEmail(email);
        user.setName(name);
        return repo.save(user);
    }
}
