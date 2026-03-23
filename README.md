# 🪐 Halleyx — Multi-Tenant Order Management Dashboard

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://halleyxproject.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

**Halleyx** is a premium, multi-tenant SaaS platform designed for high-performance order management. It features a fully customizable dashboard with drag-and-drop widgets, real-time data visualization, and a secure infrastructure that isolates data for every tenant.

---

## 🚀 Live Demo
Experience the platform live at:https://halleyx-orders.vercel.app/

Demo Video:https://drive.google.com/file/d/1XarqX_3zR2LMhybYQnrGNsD0zAbalOru/view?usp=sharing

---

## ✨ Key Features

### 🏢 Multi-Tenant Architecture
- **Data Isolation**: Each tenant (user) operates within their own secure sandbox.
- **Dynamic Database Routing**: Automated connection management to dedicated tenant databases.
- **Secure Authentication**: JWT-based login and registration with environment-specific encryption.

### 📊 Customizable Analytics Dashboard
- **Drag-and-Drop Widgets**: Rearrange your workspace using high-performance drag-and-drop interactions (`@dnd-kit`).
- **KPI Cards**: Real-time monitoring of key performance indicators.
- **Advanced Charts**: Interactive data visualization powered by `Recharts` (Bar, Area, and Pie charts).
- **Flexible Layouts**: Save and recall multiple dashboard configurations.

### 📦 Robust Order Management
- **Centralized View**: Monitor all orders across your organization in a single, high-fidelity table.
- **Advanced Filtering**: Search and filter by order ID, status, customer, or date range.
- **Status Workflows**: Update order states (Pending, Processing, Shipped, Delivered) with instant UI feedback.

### 🎨 Premium Design System
- **Professional SaaS Aesthetic**: Dark-themed, glassmorphic UI with vibrant accents.
- **Micro-animations**: Smooth transitions and hover effects for an elite user experience.
- **Fully Responsive**: Optimized for desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: `React 19` (Vite)
- **State Management**: `Zustand`
- **Styling**: `Vanilla CSS` with a comprehensive custom variable system.
- **Interactions**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Charts**: `Recharts`

### Backend
- **Runtime**: `Node.js`
- **Framework**: `Express.js`
- **Database**: `MongoDB` (Atlas) + `Mongoose`
- **Security**: `JSON Web Tokens (JWT)`, `bcrypt`
- **CORS Management**: Fine-grained origin control for secure deployments.

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

### 1. Clone the Repository
```
git clone https://github.com/Sam-Prasith/Halleyx.git
cd Halleyx
```

### 2. Install Dependencies
Run this in the root directory to install dependencies for both client and server:
```bash
npm install # Root dependencies
cd client && npm install
cd ../server && npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Running the Project
From the **root directory**, you can start both the client and server concurrently:
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 🏗️ Project Structure
```
Halleyx/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Dashboard, Orders, Auth)
│   │   └── index.css    # Global design tokens & animations
├── server/           # Express Backend
│   ├── models/       # Mongoose Schemas (Multi-tenant)
│   ├── routes/       # API Routes
│   ├── controllers/  # Business Logic
│   └── index.js      # Server entry point
└── vercel.json       # Deployment configuration
```

---

## 📜 License
Internal use only, or MIT License. (Consult repository owners for details).

---
*Developed with ❤️ by [Sam Prasith](https://github.com/Sam-Prasith)*
