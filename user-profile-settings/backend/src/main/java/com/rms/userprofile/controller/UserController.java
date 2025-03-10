package com.rms.userprofile.controller;

import com.rms.userprofile.model.User;
import com.rms.userprofile.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userManagementService;

    @Autowired
    public UserController(UserService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping("")
    public ResponseEntity<List<User>> fetchAllUsers() {
        List<User> users = userManagementService.getAllUsers();
        return users.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> fetchUserProfile(@PathVariable String userId) {
        User userProfile = userManagementService.getUserById(userId);
        return userProfile != null ? ResponseEntity.ok(userProfile) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> modifyUserProfile(@PathVariable String userId, @RequestBody User userData) {
        User updatedProfile = userManagementService.updateUserDetails(userId, userData);
        return updatedProfile != null ? ResponseEntity.ok(updatedProfile) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{userId}/visibility")
    public ResponseEntity<User> changeProfileVisibility(@PathVariable String userId, @RequestBody Map<String, Boolean> requestPayload) {
        Boolean visibilityStatus = requestPayload.get("isPublic");
        if (visibilityStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        User updatedProfile = userManagementService.toggleProfileVisibility(userId, visibilityStatus);
        return updatedProfile != null ? ResponseEntity.ok(updatedProfile) : ResponseEntity.notFound().build();
    }

    @PatchMapping("/{userId}/notifications")
    public ResponseEntity<User> adjustNotificationSettings(@PathVariable String userId, @RequestBody Map<String, Boolean> requestPayload) {
        Boolean notificationStatus = requestPayload.get("isEnabled");
        if (notificationStatus == null) {
            return ResponseEntity.badRequest().build();
        }
        User updatedProfile = userManagementService.updateNotificationPreferences(userId, notificationStatus);
        return updatedProfile != null ? ResponseEntity.ok(updatedProfile) : ResponseEntity.notFound().build();
    }
}
