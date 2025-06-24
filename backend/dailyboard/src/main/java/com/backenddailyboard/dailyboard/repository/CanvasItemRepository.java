package com.backenddailyboard.dailyboard.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backenddailyboard.dailyboard.model.CanvasItem;

public interface CanvasItemRepository extends JpaRepository<CanvasItem, Long> {
    // Custom method to find CanvasItems by User ID
    List<CanvasItem> findAllByUserId(Long userId);
    @Query("SELECT c FROM CanvasItem c WHERE c.userId = :userId AND c.deleted = true ORDER BY c.deletedAt ASC")
    List<CanvasItem> findSoftDeletedItems(@Param("userId") Long userId);
}
