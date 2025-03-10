package com.rms.userprofile.service;

import com.rms.userprofile.model.User;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@Service
public class UserService {

    private final Map<String, User> userStorage = new ConcurrentHashMap<>();

    public UserService() {
        User defaultUser = new User(
            "usr_001",
            "Fawad Khan",
            "fawad.khan@example.com",
            "Researcher",
            true,  // Profile is public
            true   // Notifications enabled
        );
        userStorage.put(defaultUser.getUserId(), defaultUser);
    }



    // Get all users
    public List<User> getAllUsers() {
        return new ArrayList<>(userStorage.values());
    }

    /**
     * @param userId
     * @return
     */
    public User getUserById(String userId) {
        return userStorage.get(userId);
    }

    /**
     * @param userId
     * @param updatedUser
     * @return
     */
    public User updateUserDetails(String userId, User updatedUser) {
        if (userStorage.containsKey(userId)) {
            User existingUser = userStorage.get(userId);
            
            updatedUser.setUserId(userId);
            updatedUser.setUserRole(existingUser.getUserRole());
            
            userStorage.put(userId, updatedUser);
            return updatedUser;
        }
        return null;
    }

    /**
     * @param userId
     * @param isPublic
     * @return
     */
    public User toggleProfileVisibility(String userId, boolean isPublic) {
        User user = userStorage.get(userId);
        if (user != null) {
            user.setProfilePublic(isPublic);
            return user;
        }
        return null;
    }

    /**
     * @param userId
     * @param isEnabled
     * @return
     */
    public User updateNotificationPreferences(String userId, boolean isEnabled) {
        User user = userStorage.get(userId);
        if (user != null) {
            user.setNotificationsEnabled(isEnabled);
            return user;
        }
        return null;
    }
}
