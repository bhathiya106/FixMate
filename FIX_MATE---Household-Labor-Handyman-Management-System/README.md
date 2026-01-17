# 🏠 Household Labor & Handyman Management System  

A **full-stack service management platform** that connects **customers, workers (handymen), and vendors** with **admin oversight**.  
It simplifies household service requests, worker scheduling, vendor product sales, prototype payments, and loyalty tracking — all in one place.  

---

## 🚀 Features  

### 🔧 Worker Management  
- Secure registration & JWT-based login (role = worker)  
- Profile management: skills, rates, service radius, profile photo  
- Multi-skill support (e.g., electrician + plumber)  
- Availability calendar with drag/drop scheduling  
- Job inbox: accept/reject job requests  
- Job history, ratings, and performance metrics  
- Upload certificates (pending admin verification)  
- Export reports: Excel (jobs), PDF (profile), PNG (worker card)  

### 👤 Customer Management  
- Secure signup/login (role = customer)  
- Browse & filter workers by skills, rating, price, location  
- Post/manage job requests with media (photo/video)  
- Track job status (pending → in-progress → completed)  
- Rate & review workers (with optional photo)  
- View job/payment history with export (Excel/PDF)  
- Submit complaints against workers/vendors  

### 🏪 Vendor / Third-Party Management  
- Vendor registration & login (role = vendor)  
- Manage product/service listings (CRUD)  
- Accept/reject service/product orders  
- Transaction history with export options  
- Vendor ratings & reviews  

### 🚚 Delivery Management
-User roles for delivery drivers
-Register and login with email/password
-Auth via JWT cookie delivery_token
-Accept/reject  delevery orders
-Driver profile management
-View and update profile: name, rate, operating area, phone, bio, location
-Toggle availability status
-Profile image URL support

### 🛠️ Admin Subsystem  
- Approve/ban users (workers, customers, vendors)  
- Monitor complaints, reports, and suspicious activity  
- System-wide reporting: jobs, revenue, users (PDF/Excel)  
- Send announcements/notifications to all users  
- Governance & verification workflows  

---

## 📊 System Highlights  
✔️ CRUD everywhere – profiles, jobs, products, reviews  
✔️ Reporting everywhere – PDF & Excel exports  
✔️ File uploads – images, certificates, receipts  
✔️ Role-based access control – worker, customer, vendor, admin  
✔️ Admin-first design – every subsystem includes oversight  

---

## 🏗️ Tech Stack (Suggested)  
- **Frontend:** React (Vite) + Tailwind CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT + bcrypt  
- **File Storage:** Multer / Cloudinary / AWS S3  
- **Reports:** jsPDF, ExcelJS  
- **Notifications:** Nodemailer (email), Twilio (SMS prototype)  

---

## 📂 Project Structure (Example)  
```bash
/backend
  /config        → DB & JWT configs
  /models        → Mongoose schemas
  /routes        → API endpoints
  /controllers   → Business logic
  /uploads       → Uploaded images/docs
  server.js

/fron
