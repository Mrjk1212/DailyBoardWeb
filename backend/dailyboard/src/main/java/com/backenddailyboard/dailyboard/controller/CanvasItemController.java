package com.backenddailyboard.dailyboard.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.backenddailyboard.dailyboard.model.CanvasItem;
import com.backenddailyboard.dailyboard.repository.CanvasItemRepository;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // allow frontend to call backend
public class CanvasItemController {
    private final CanvasItemRepository repository;

    public CanvasItemController(CanvasItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CanvasItem> getAllItems() {
        return (List<CanvasItem>) repository.findAll();
    }

    @PostMapping
    public CanvasItem createItem(@RequestBody CanvasItem item) {
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanvasItem> updateItem(@PathVariable Long id, @RequestBody CanvasItem updatedItem) {
        return repository.findById(id)
            .map(existingItem -> {
                // Update fields explicitly
                existingItem.setX(updatedItem.getX());
                existingItem.setY(updatedItem.getY());
                existingItem.setWidth(updatedItem.getWidth());
                existingItem.setHeight(updatedItem.getHeight());
                existingItem.setType(updatedItem.getType());
                existingItem.setZIndex(updatedItem.getZIndex());
                existingItem.setData(updatedItem.getData());
                // Add other fields you want to update...

                CanvasItem savedItem = repository.save(existingItem);
                return ResponseEntity.ok(savedItem);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        repository.deleteById(id);
    }
}