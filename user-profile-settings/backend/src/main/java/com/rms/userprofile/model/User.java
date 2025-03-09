package com.rms.userprofile.model;

public class User {
    private String userId;
    private String fullName;
    private String emailAddress;
    private String userRole;
    private boolean isProfilePublic;
    private boolean isNotificationsEnabled;

    public User() {
    }

    /**
     * @param userId
     * @param fullName
     * @param emailAddress
     * @param userRole
     * @param isProfilePublic
     * @param isNotificationsEnabled
     */
    public User(String userId, String fullName, String emailAddress, String userRole, boolean isProfilePublic, boolean isNotificationsEnabled) {
        this.userId = userId;
        this.fullName = fullName;
        this.emailAddress = emailAddress;
        this.userRole = userRole;
        this.isProfilePublic = isProfilePublic;
        this.isNotificationsEnabled = isNotificationsEnabled;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public boolean isProfilePublic() {
        return isProfilePublic;
    }

    public void setProfilePublic(boolean profilePublic) {
        isProfilePublic = profilePublic;
    }

    public boolean isNotificationsEnabled() {
        return isNotificationsEnabled;
    }

    public void setNotificationsEnabled(boolean notificationsEnabled) {
        isNotificationsEnabled = notificationsEnabled;
    }
}
