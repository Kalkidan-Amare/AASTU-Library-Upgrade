﻿# AASTU Library Management System

## https://aastu-library.vercel.app/
A comprehensive **Library Management System** designed to simplify and streamline library operations at Addis Ababa Science and Technology University (AASTU). This project enables users to check in, borrow books, and manage their accounts while ensuring robust role-based access control and data integrity.

---

## **Features**
- **User Management**: 
  - Register, log in, and manage user roles (e.g., admin, student).
  - Role-based access control for key actions (e.g., only admins can approve users or manage other roles).
  - Tracks user check-in status and borrowed books.
  
- **Check-In/Check-Out System**:
  - Students can check in and out of the library.
  - Admins can monitor library activity in real-time.

- **Book Borrowing System**:
  - Borrow and return books, with records maintained for each transaction.
  - Supports filtering borrowed books by date or status (read/not read).

- **Secure Authentication**:
  - Secure password handling with hashed storage.
  - JSON Web Tokens (JWT) for session management and middleware for route protection.

- **Database Integration**:
  - MongoDB for managing users, check-ins, and book records.

---

## **Architecture**
This project follows a **Service Layer + MVC Design Pattern**, ensuring a modular and maintainable structure:
- **Controllers**: Handle HTTP requests and route them to the appropriate service.
- **Service Layer**: Implements business logic and interacts with the database layer.
- **Middleware**: Handles authentication, authorization, and other pre-processing.
- **Database Layer**: Manages interactions with MongoDB.

---

## **Technologies Used**
- **Programming Language**: Go (Golang), Typescript
- **Framework**: Gin Web Framework, Nextjs
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker
- **Deployment**: Render (cloud deployment platform)

---

## **Project Structure**
