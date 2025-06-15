package com.backenddailyboard.dailyboard.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.backenddailyboard.dailyboard.model.CanvasItem;

public interface CanvasItemRepository extends JpaRepository<CanvasItem, Long> {
    // Custom method to find CanvasItems by User ID
    List<CanvasItem> findAllByUserId(Long userId);
}
