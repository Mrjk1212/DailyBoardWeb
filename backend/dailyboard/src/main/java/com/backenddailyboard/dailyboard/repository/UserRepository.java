package com.backenddailyboard.dailyboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.backenddailyboard.dailyboard.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    // You can add custom queries here if needed
    Optional<User> findByGoogleId(String googleId);
}
