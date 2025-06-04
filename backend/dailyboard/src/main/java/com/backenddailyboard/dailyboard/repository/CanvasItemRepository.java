package com.backenddailyboard.dailyboard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.backenddailyboard.dailyboard.model.CanvasItem;

@Repository
public interface CanvasItemRepository extends CrudRepository<CanvasItem, Long> {
}