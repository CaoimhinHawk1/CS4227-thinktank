# User Profile Settings Module # by Fawad Shahzad 18265693

## About This Project ##
Hey there! 👋 This is the User Profile & Settings Module for the Research Management System (RMS). This part of the project lets users log in, manage their profile, and customize their settings—like making their profile public or private and enabling/disabling notifications.

It’s built with React for the frontend and Spring Boot for the backend, following a microservices approach to keep things modular and scalable

 ## What Can You Do Here? ##
✅ Log in with demo credentials (hardcoded for now).
✅ View your profile (name, email, role).
✅ Edit your profile (update name and email).
✅ Change visibility (public/private toggle).
✅ Turn notifications on/off (manage alerts).
✅ Log out when you're done.

## Tech Behind the Scenes ##
🔹 Frontend: React (with components for login, profile, settings).
🔹 Backend: Spring Boot (handles user data and authentication).
🔹 API Calls: RESTful APIs connect the frontend and backend.
🔹 Storage: No real database yet—just mock data for now.

## How to Run It Locally ##
1- Clone this repository

git clone https://github.com/CaoimhinHawk1/CS4227-thinktank.git

cd user-profile-settings

2- Start the Backend

Make sure you have Java & Maven installed, then run:

mvn spring-boot:run

This starts the backend, so it can handle login and profile updates.

3- Start the Frontend

Open another terminal, go to the React frontend folder, and run: 

*cd frontend*

*npm install*

*npm start*

Now open http://localhost:3000 in your browser—you should see the login page! 🎉
