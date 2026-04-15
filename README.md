# VistaView

A full-stack tourism review platform where travelers discover authentic places, read verified reviews, and connect with verified place owners  built with the MERN stack.

**Live Demo:** [vistaview-kappa.vercel.app](https://vistaview-kappa.vercel.app) &nbsp;|&nbsp; **API:** [vistaview-api.onrender.com](https://vistaview-api.onrender.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)

---

## Overview

VistaView is a community-driven travel platform with three distinct user roles  **User**, **Owner**, and **Admin**  each with their own dedicated interface and permissions. Owners can list and manage tourism places, users can review them, and admins oversee the entire platform.

---

## Features

### Public / User
- Browse and search places with full-text search, filters (category, city, rating, price range), and sorting
- View place details with an interactive map (Leaflet + OpenStreetMap)
- Discover nearby places using geospatial queries
- Write, edit, and delete reviews with up to 3 image uploads
- Mark reviews as helpful and report inappropriate content
- Wishlist management with optimistic UI updates
- OTP-based email verification and password reset flow
- Real-time notification bell with mark-as-read and clear-all

### Owner
- Apply for owner verification with document uploads
- Dashboard with overview stats (total places, views, reviews, avg rating)
- Add and edit place listings with up to 5 images and map-based location picking
- Reply to, edit, and delete review responses
- Analytics page with bar charts (views per place, rating distribution)

### Admin
- Full user management: view all users, block/unblock with reason
- Place moderation: approve, reject (with reason), and feature/un-feature places
- Review moderation: soft delete, restore, and hard delete reviews
- Owner verification queue: approve or reject applications with document preview
- Report management: resolve or reject user reports with admin notes
- Dashboard with platform-wide stats

### Security & Infrastructure
- JWT access + refresh token rotation with HTTP-only cookies
- Rate limiting on auth, OTP, and report endpoints
- Input sanitization with DOMPurify on every text field
- Joi schema validation on all API routes
- Helmet security headers + CORS configuration
- Spam detection scoring on review comments
- Cloudinary CDN for all image storage with auto-optimization

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Redux Toolkit + RTK Query | State management and data fetching |
| React Router DOM v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| React Leaflet | Interactive maps |
| Chart.js | Analytics charts |
| React Hook Form + Zod | Form handling and validation |
| React Hot Toast | Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | Server and REST API |
| MongoDB + Mongoose | Database and ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcrypt | Password hashing |
| Cloudinary | Image storage and CDN |
| Multer + multer-storage-cloudinary | File upload pipeline |
| Brevo | Transactional emails |
| Joi | Request validation |
| Helmet + cors | Security headers |
| express-rate-limit | API rate limiting |
| isomorphic-dompurify | Input sanitization |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Client (React)              │
│  PublicLayout │ OwnerLayout │ AdminLayout    │
│       RTK Query ← HTTP/Cookies → Express     │
└─────────────────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Express API   │
              │  /api/v1/*      │
              │                 │
              │  authMiddleware │
              │  roleMiddleware │
              │  validate (Joi) │
              │  sanitize       │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   MongoDB        Cloudinary       Brevo
  (Mongoose)   (Image Storage)   (Email)
```

**Data flow for protected routes:**
1. RTK Query sends request with `credentials: include`
2. `authMiddleware` verifies access token from HTTP-only cookie
3. On 401, `baseQueryWithReauth` silently calls `/auth/refresh-token`
4. New access token is set; original request retries automatically

---

## Getting Started

### Prerequisites

- Node.js >= 20
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Brevo account (for transactional emails)

### Clone the Repository

```bash
git clone https://github.com/deepx-sh/vistaview.git
cd vistaview
```

### Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Run in Development

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev
```

The client runs on `http://localhost:5173` and the server on `http://localhost:5000`.

---

## Environment Variables

### Server (`server/.env`)

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/

# JWT
JWT_ACCESS_TOKEN_SECRET=your_access_secret
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret
JWT_REFRESH_TOKEN_EXPIRY=7d
JWT_RESET_PASSWORD_SECRET=your_reset_secret
JWT_RESET_PASSWORD_SECRET_EXPIRE=5m

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Brevo (Email)
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_PASS=your_smtp_password

# CORS
FRONTEND_URL_LOCAL=http://localhost:5173
FRONTEND_URL_PROD=https://your-frontend.vercel.app
```

### Client (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## API Endpoints

### Auth — `/api/v1/auth`
| Method | Route | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/verify-email` | Verify email with OTP |
| POST | `/resend-verify-otp` | Resend verification OTP |
| POST | `/login` | Login and receive tokens |
| POST | `/logout` | Logout and clear cookies |
| POST | `/forgot-password` | Send password reset OTP |
| POST | `/verify-reset-otp` | Verify reset OTP, get reset token |
| POST | `/reset-password` | Reset password with token |
| GET | `/me` | Get current user |
| POST | `/refresh-token` | Refresh access token |

### Places — `/api/v1/places`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/search` | Public | Full-text search with filters |
| GET | `/nearby` | Public | Geospatial nearby search |
| GET | `/:id` | Public | Get place by ID |
| GET | `/owner` | Owner | Get owner's places |
| POST | `/` | Owner | Create a place |
| PUT | `/:id` | Owner | Update a place |
| DELETE | `/:id` | Owner | Delete a place |

### Reviews — `/api/v1/reviews`
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/place/:placeId` | Public | Get reviews for a place |
| POST | `/:placeId` | User | Add a review |
| PUT | `/:reviewId` | User | Update own review |
| DELETE | `/:reviewId` | User | Delete own review |
| POST | `/:reviewId/like` | User | Toggle helpful vote |

### Additional Routes
- **Users** `/api/v1/users` — profile, avatar, password change
- **Wishlist** `/api/v1/wishlist` — add, remove, list
- **Owners** `/api/v1/owners` — apply, dashboard, review replies
- **Admin** `/api/v1/admin` — users, places, reviews, reports, owners
- **Notifications** `/api/v1/notifications` — list, mark read, clear
- **Reports** `/api/v1/reports` — submit a report

---

## Project Structure

```
vistaview/
├── client/                    # React frontend
│   ├── src/
│   │   ├── app/               # Redux store + router
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── common/        # Shared components
│   │   │   ├── layout/        # Layout wrappers
│   │   │   ├── notifications/ # Notification bell
│   │   │   ├── owner/         # Owner-specific components
│   │   │   ├── reviews/       # Review components
│   │   │   └── ui/            # Generic UI primitives
│   │   ├── features/          # RTK Query API slices
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Route-level page components
│   │   │   ├── admin/         # Admin pages
│   │   │   ├── auth/          # Login, Register, OTP pages
│   │   │   └── owner/         # Owner pages
│   │   ├── routes/            # Role-based route guards
│   │   ├── services/          # Base API configuration
│   │   └── utils/             # Helper utilities
│   └── vercel.json            # Vercel deployment config + CSP headers
│
└── server/                    # Express backend
    └── src/
        ├── config/            # DB, Cloudinary, Multer, rate limiters
        ├── controllers/       # Route handler logic
        ├── middlewares/       # Auth, role, validate, sanitize
        ├── models/            # Mongoose schemas
        ├── routes/            # Express route definitions
        ├── utils/             # Helpers (tokens, OTP, email templates)
        └── validators/        # Joi validation schemas
```

---

## Key Implementation Details

### Silent Token Refresh
RTK Query's `baseQuery` is wrapped to automatically retry requests after refreshing the access token on 401 responses, providing a seamless auth experience without redirecting users to login.

### Geospatial Search
MongoDB's `2dsphere` index on the `location` field enables `$near` queries for finding places within a specified radius. The frontend uses OpenStreetMap's Nominatim API for reverse geocoding when a user picks a location on the map.

### Optimistic Wishlist Updates
Wishlist add/remove mutations use RTK Query's `onQueryStarted` to optimistically update the cached wishlist before the server responds, with automatic rollback on failure.

### Spam Detection
A lightweight scoring function evaluates review comments for spam signals (short length, known spam keywords, excessive caps, emoji overload) and stores a `spamScore` on each review for admin moderation.

---

## Deployment

- **Frontend:** Vercel  with `vercel.json` rewrites for SPA routing and strict CSP headers
- **Backend:** Render  Node.js web service
- **Database:** MongoDB Atlas
- **Media:** Cloudinary
