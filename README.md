# Project Name

> A modern full-stack web application with Java Spring Boot backend and React frontend, featuring PostgreSQL database and Google OAuth authentication.
- A Daily Planner Inspired By Outlooks (Now Extinct) Daily Board
---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Backend Setup](#backend-setup)  
- [Frontend Setup](#frontend-setup)  
- [Environment Variables](#environment-variables)  
- [License](#license)  

---

## Features

![Picture Display Of Features](Screenshots/Full%20Board%20Capture.PNG)

![Picture Display Of Features Zoomed Out](Screenshots/Infinite%20Canvas%20Example%20Capture.PNG)

- RESTful API built with Java Spring Boot  
- User authentication and authorization using Google OAuth 2.0  
- Persistent data storage with PostgreSQL  
- Responsive frontend built with React and TailwindCSS  
- Secure API endpoints with JWT tokens  
- Modern development experience with Maven and npm/yarn  

---

## Tech Stack

| Layer          | Technology                 |
| -------------- | --------------------------|
| Backend        | Java Spring Boot, Maven    |
| Database       | PostgreSQL                 |
| Authentication | Google OAuth 2.0, JWT      |
| Frontend       | React (JSX), TailwindCSS   |
| Build Tools    | Maven (backend), npm (frontend) |

---

## Getting Started

### Prerequisites

- Java JDK 17+  
- Maven 3.6+  
- Node.js 16+ and npm 
- PostgreSQL database  
- Google Cloud Console project with OAuth credentials  

---

## Backend Setup

1. Clone the repository and navigate to the backend folder:

   ```bash
   cd backend

2. install and compile maven dependencies:
    ```bash
    cd dailyboard
    
    mvn clean install

    mvn clean compile

3. Start the DailyboardApplication.java however you like

    mvn exec:java OR right click and hit run java.

## Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend

2. start the react server:
    ```bash
    npm start

## Environment Variables
Configure the following environment variables for your backend and frontend as needed:

### Backend
- SPRING_DATASOURCE_URL — PostgreSQL connection URL

- SPRING_DATASOURCE_USERNAME — DB username

- SPRING_DATASOURCE_PASSWORD — DB password

- GOOGLE_CLIENT_ID — Google OAuth client ID

- GOOGLE_CLIENT_SECRET — Google OAuth client secret

- JWT_SECRET — JWT signing secret

### Frontend
- REACT_APP_API_BASE_URL — URL for backend API

- REACT_APP_GOOGLE_CLIENT_ID — Google OAuth client ID (for frontend use)


# License
This project is licensed under the MIT License.