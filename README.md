# 🍽️ React Food Recipe Website

A dynamic and responsive **Food Recipe Web Application** that allows users to explore, search, and view detailed recipes. Built with **React.js** for the frontend and **Node.js (Express)** for the backend.

---

## 🌟 Features

### 👩‍🍳 Frontend (React.js)
- Search and filter recipes by name or ingredient
- Recipe detail pages with ingredients and steps
- Fully responsive layout (mobile/tablet/desktop)

### 🌐 Backend (Node.js + Express)
- RESTful API to manage:
  - Recipes
  - Categories
  - Users (optional)
- MySQL for data storage
- Basic authentication (optional)

---

## 🛠️ Tech Stack

| Layer     | Technology                |
|-----------|----------------------------|
| Frontend  | React.js, Axios, React Router |
| Backend   | Node.js, Express.js         |
| Database  | MySQL       |
| Styling   | CSS Modules |
| Hosting   | Sharehosting (cpanel) |

---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js (v14+)
- MySQL
- npm or yarn

---

### 🧱 1. Clone the Repository

```bash
git clone https://github.com/yourusername/food-recipe-app.git
cd food-recipe-app
```
### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env    # Add DB credentials and JWT secret
npm run dev
```

### 3. Frontend Setup

```bash
cd ../foodRecipe
npm install
npm start
```

## 🔒 Authentication
- JWT-based login for secure access
- User roles for permission control
- Middleware to protect routes


🧑‍💻 Author
Built with ❤️ by Denis Nasution
