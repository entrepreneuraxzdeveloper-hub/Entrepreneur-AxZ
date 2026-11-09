# Entrepreneur AxZ — Enterprise Backend & Admin Panel

A standalone backend API and full-featured Admin Panel for **Entrepreneur AxZ (A Brand by Roychowdhury and Sons)**, created in the root folder (`/backend`) completely decoupled from the frontend (`/frontend`).

---

## ⚡ Quick Start

### 1. Install Dependencies
Dependencies are already installed in `backend/node_modules`. If needed again:
```bash
cd backend
npm install
```

### 2. Run the Backend Server
```bash
npm start
# or for auto-reloading dev mode:
npm run dev
```

The server will start on port `5000`:
- **Admin Panel Dashboard:** [http://localhost:5000](http://localhost:5000)
- **API Base URL:** [http://localhost:5000/api](http://localhost:5000/api)
- **Static Media & Uploads:** [http://localhost:5000/uploads](http://localhost:5000/uploads)

---

## 🔐 Authentication Credentials

The system comes pre-seeded with encrypted administrator and client accounts:

| Role | Name | Email | Password | Access Level |
|------|------|-------|----------|--------------|
| **Administrator** | Rahul Roy Chowdhury | `admin@axz.com` | `admin123` | Full CRUD, Photo Pipelines, User Access |
| **Customer** | Tanmay Dutta | `tanmay@axz.com` | `client123` | Catalog & Services browsing |

*You can also register new accounts anytime via the Admin Panel or `POST /api/auth/register`.*

---

## 🖥️ Admin Panel Features

Visit **`http://localhost:5000`** in your browser:

1. **Live Key Metrics Dashboard:**
   - Real-time counts of products, active services, registered accounts, and health status.
2. **Products & Construction Materials (Full CRUD):**
   - Search by name, variety, or category.
   - Filter by categories: *Masonry, Cement & Steel, Sand & Aggregate, Finishes & Paints*.
   - **Add New Product Modal:** Name, Category, Price, Unit, Variety, Quality Badge, Technical Specs, Stock status, and image files.
   - **Edit Product Modal:** Update any field.
   - **Delete Product:** Deletes record and cleans up associated uploaded photos from disk.
3. **Photo Pipeline Manager:**
   - Click **"Photos"** on any product card.
   - Inspect all current images.
   - Upload and attach new photos.
   - **Replace Photo:** Replaces existing photo and purges the old file from disk.
   - **Delete Photo:** Removes photo from the product with disk cleanup.
4. **Inquiries & Site Quotation Leads Pipeline:**
   - Real-time lead ingestion directly from the live website quotation form.
   - Displays customer name, phone number, chosen site location, requested materials, and scope notes.
   - **One-Click Communication:** Instant `tel:` direct call link and pre-filled WhatsApp chat link (`wa.me`) to engage leads immediately.
   - **Pipeline Status Tracking:** Track and update lead status (`Pending`, `Contacted`, `Quotation Sent`, `Delivered / Completed`, `Cancelled`).
   - Dynamic counter badges in sidebar and overview dashboard.
5. **Live Website Synchronization:**
   - Products added, edited, re-priced, or deleted in the Admin Panel immediately reflect on the live website.
   - Supply services updated in the Admin Panel dynamically sync to the frontend.
6. **Services & Supply Operations (Full CRUD):**
   - Manage supply logistics, drawing analysis, quality batch testing, and contractor agreements.
   - Add, edit, and delete services with custom bulleted features and icons/images.
7. **User Management:**
   - View all registered accounts, roles, and join dates.
8. **API & Pipelines Explorer:**
   - Built-in interactive test bench with one-click ping buttons for all REST endpoints.

---

## 📡 REST API Documentation

### 1. Authentication Endpoints (`/api/auth`)
- `POST /api/auth/register`
  - Body: `{ name, email, password, role }`
  - Returns: JWT token and safe user object.
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: JWT token and user info.
- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Returns: Current authenticated user profile.
- `POST /api/auth/logout`
  - Returns: Logout confirmation.
- `GET /api/auth/users` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Returns: Array of all registered user accounts.

### 2. Products Endpoints (`/api/products`)
- `GET /api/products`
  - Query params: `category`, `search`, `inStock`
  - Returns: All matching products.
- `GET /api/products/:id`
  - Returns: Single product details.
- `POST /api/products` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Supports `multipart/form-data` or `application/json`
  - Body: `name`, `category`, `price`, `unit`, `variety`, `badge`, `description`, `specs`, `images`
- `PUT /api/products/:id` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Body: Any updated product fields.
- `DELETE /api/products/:id` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Deletes product and deletes uploaded images from disk.

#### Product Photo Pipelines
- `POST /api/products/:id/photos` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Form-data: `images` (file)
  - Uploads and appends new photos to the product.
- `PUT /api/products/:id/photos` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Form-data: `image` (replacement file), `oldPhotoUrl` or `index`
  - Replaces photo and deletes old file.
- `DELETE /api/products/:id/photos` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Body / Query: `{ photoUrl, index }`
  - Removes photo and deletes it from storage.

### 3. Services Endpoints (`/api/services`)
- `GET /api/services`
  - Query params: `category`, `search`
- `GET /api/services/:id`
- `POST /api/services` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Body / Form-data: `title`, `category`, `shortDesc`, `description`, `features`, `image`
- `PUT /api/services/:id` *(Admin only)*
- `DELETE /api/services/:id` *(Admin only)*

### 4. Upload Endpoint (`/api/upload`)
- `POST /api/upload` *(Admin only)*
  - Headers: `Authorization: Bearer <token>`
  - Form-data: `image` (single file)
  - Returns: `{ success: true, file: { url: '/uploads/filename.jpg', ... } }`

### 5. Health Check (`/api/health`)
- `GET /api/health`
  - Returns server uptime, status, and database record counts.

---

## 📂 Project Architecture

```
Rahul Roy Choudhary/
├── backend/                        <-- New Dedicated Backend Folder
│   ├── config/
│   │   └── db.js                   <-- Persistent Database Engine (Atomic writes & auto-seeding)
│   ├── controllers/
│   │   ├── authController.js       <-- Sign up, login, profile, user listing
│   │   ├── productController.js    <-- Full CRUD & photo replacement/delete pipelines
│   │   └── serviceController.js    <-- Full CRUD for supply & consultation services
│   ├── middleware/
│   │   ├── auth.js                 <-- JWT authentication & requireAdmin middleware
│   │   └── upload.js               <-- Multer image upload pipeline & file deletion helpers
│   ├── routes/
│   │   ├── authRoutes.js           <-- /api/auth routes
│   │   ├── productRoutes.js        <-- /api/products routes
│   │   ├── serviceRoutes.js        <-- /api/services routes
│   │   └── uploadRoutes.js         <-- /api/upload routes
│   ├── public/
│   │   └── index.html              <-- Modern, responsive Admin Panel Web App
│   ├── uploads/                    <-- Uploaded product and service photos
│   ├── data/
│   │   └── db.json                 <-- Persistent JSON datastore
│   ├── test-backend.js             <-- Automated test suite for all pipelines
│   ├── server.js                   <-- Express server entry point
│   ├── package.json
│   └── .env
└── frontend/                       <-- Frontend Application
```

---

## 🧪 Running the Verification Test Suite
```bash
node test-backend.js
```
All 11 pipeline tests will execute and confirm:
1. Health check & database integrity
2. User signup & password hashing
3. Admin login & JWT verification
4. Profile retrieval (`/api/auth/me`)
5. Product listing & category filters
6. Product creation with specs & photos
7. Product updating
8. Photo pipeline deletion & disk clean-up
9. Service creation with features
10. Service updating
11. Clean deletion of products and services

