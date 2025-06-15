package com.backenddailyboard.dailyboard.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.backenddailyboard.dailyboard.model.CanvasItem;
import com.backenddailyboard.dailyboard.model.User;
import com.backenddailyboard.dailyboard.repository.CanvasItemRepository;
import com.backenddailyboard.dailyboard.repository.UserRepository;

@RestController
@RequestMapping("/api/items") // Changed to /api/ for consistency
@CrossOrigin(origins = "http://localhost:3000")
public class CanvasItemController {

    private final CanvasItemRepository canvasItemRepository;
    private final UserRepository userRepository;

    public CanvasItemController(CanvasItemRepository canvasItemRepository, UserRepository userRepository) {
        this.canvasItemRepository = canvasItemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<CanvasItemDTO>> getCanvasItems() {
        // Get current authenticated user's Google ID from JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String googleId = auth.getName();
        
        // Find user by Google ID
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        List<CanvasItem> items = canvasItemRepository.findAllByUserId(user.getId());

        List<CanvasItemDTO> itemDTOs = items.stream()
            .map(item -> new CanvasItemDTO(
                item.getId(),
                item.getType(),
                item.getX(),
                item.getY(),
                item.getWidth(),
                item.getHeight(),
                item.getZIndex(),
                item.getData()
            ))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(itemDTOs);
    }

    @PostMapping
    public ResponseEntity<CanvasItemDTO> createCanvasItem(@RequestBody CanvasItemCreateDTO createDTO) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String googleId = auth.getName();        
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        // Create new canvas item
        CanvasItem item = new CanvasItem();
        item.setType(createDTO.getType());
        item.setX(createDTO.getX());
        item.setY(createDTO.getY());
        item.setWidth(createDTO.getWidth());
        item.setHeight(createDTO.getHeight());
        item.setZIndex(createDTO.getZIndex());
        item.setData(createDTO.getData());
        item.setUser(user); // Associate with current user
        
        CanvasItem savedItem = canvasItemRepository.save(item);
        
        CanvasItemDTO responseDTO = new CanvasItemDTO(
            savedItem.getId(),
            savedItem.getType(),
            savedItem.getX(),
            savedItem.getY(),
            savedItem.getWidth(),
            savedItem.getHeight(),
            savedItem.getZIndex(),
            savedItem.getData()
        );
        
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CanvasItemDTO> updateCanvasItem(@PathVariable Long id, @RequestBody CanvasItemUpdateDTO updateDTO) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String googleId = auth.getName();
        
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        // Find item and verify ownership
        Optional<CanvasItem> itemOptional = canvasItemRepository.findById(id);
        if (itemOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        CanvasItem item = itemOptional.get();
        if (!item.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden - not the owner
        }
        
        // Update item
        item.setType(updateDTO.getType());
        item.setX(updateDTO.getX());
        item.setY(updateDTO.getY());
        item.setWidth(updateDTO.getWidth());
        item.setHeight(updateDTO.getHeight());
        item.setZIndex(updateDTO.getZIndex());
        item.setData(updateDTO.getData());
        
        CanvasItem savedItem = canvasItemRepository.save(item);
        
        CanvasItemDTO responseDTO = new CanvasItemDTO(
            savedItem.getId(),
            savedItem.getType(),
            savedItem.getX(),
            savedItem.getY(),
            savedItem.getWidth(),
            savedItem.getHeight(),
            savedItem.getZIndex(),
            savedItem.getData()
        );
        
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCanvasItem(@PathVariable Long id) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String googleId = auth.getName();
        
        Optional<User> userOptional = userRepository.findByGoogleId(googleId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User user = userOptional.get();
        
        // Find item and verify ownership
        Optional<CanvasItem> itemOptional = canvasItemRepository.findById(id);
        if (itemOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        CanvasItem item = itemOptional.get();
        if (!item.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden - not the owner
        }
        
        canvasItemRepository.delete(item);
        return ResponseEntity.ok().build();
    }

    // DTOs
    public static class CanvasItemDTO {
        private Long id;
        private String type;
        private double x;
        private double y;
        private double width;
        private double height;
        private int zIndex;
        private String data;

        public CanvasItemDTO(Long id, String type, double x, double y, double width, double height, int zIndex, String data) {
            this.id = id;
            this.type = type;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.zIndex = zIndex;
            this.data = data;
        }

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }

        public double getWidth() { return width; }
        public void setWidth(double width) { this.width = width; }

        public double getHeight() { return height; }
        public void setHeight(double height) { this.height = height; }

        public int getZIndex() { return zIndex; }
        public void setZIndex(int zIndex) { this.zIndex = zIndex; }

        public String getData() { return data; }
        public void setData(String data) { this.data = data; }
    }

    // DTO for creating items (no ID needed)
    public static class CanvasItemCreateDTO {
        private String type;
        private double x;
        private double y;
        private double width;
        private double height;
        private int zIndex;
        private String data;

        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }

        public double getWidth() { return width; }
        public void setWidth(double width) { this.width = width; }

        public double getHeight() { return height; }
        public void setHeight(double height) { this.height = height; }

        public int getZIndex() { return zIndex; }
        public void setZIndex(int zIndex) { this.zIndex = zIndex; }

        public String getData() { return data; }
        public void setData(String data) { this.data = data; }
    }

    // DTO for updating items (no ID in body, comes from path)
    public static class CanvasItemUpdateDTO {
        private String type;
        private double x;
        private double y;
        private double width;
        private double height;
        private int zIndex;
        private String data;

        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public double getX() { return x; }
        public void setX(double x) { this.x = x; }

        public double getY() { return y; }
        public void setY(double y) { this.y = y; }

        public double getWidth() { return width; }
        public void setWidth(double width) { this.width = width; }

        public double getHeight() { return height; }
        public void setHeight(double height) { this.height = height; }

        public int getZIndex() { return zIndex; }
        public void setZIndex(int zIndex) { this.zIndex = zIndex; }

        public String getData() { return data; }
        public void setData(String data) { this.data = data; }
    }
}