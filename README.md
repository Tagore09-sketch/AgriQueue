# AgriQueue - Smart Agricultural Procurement Queue Management System

**Tagline:** Book. Queue. Procure. Get Paid.  
**Hero Heading:** Avoid Long Waiting at Procurement Centres

---

## 🌾 Problem Statement

Farmers often face long waiting times, lack of real-time information regarding procurement schedules, and uncertainty about procurement and payment status at agricultural procurement centres (APMC). 

---

## 💡 Proposed Solution

**AgriQueue** is a streamlined full-stack web application designed to eliminate unnecessary queue delays and uncertainty. Farmers can register, book procurement slots, receive digital queue tokens, track queue positions live, track procurement status, and verify payment disbursals. Procurement officers can manage farmer check-ins, call next in queue, perform produce inspection/weighment, and update payment statuses seamlessly.

---

## ✨ Features

### For Farmers:
1. **Easy Registration**: Minimal 8-field registration. Stores only the last 4 digits of Aadhaar for privacy (`XXXX-XXXX-9012`).
2. **Mobile OTP Login**: Fast login using Mobile Number and Demo OTP (`123456`).
3. **Slot Booking**: Select procurement centre, crop (Paddy, Maize, Cotton, Wheat), quantity, date, and time slot. Generates unique Booking ID and Token Number.
4. **Live Queue Tracking**: Real-time position tracking and estimated waiting time (`Farmers Ahead × 10 mins`).
5. **Procurement Tracking**: Live updates from `BOOKED` → `CHECKED_IN` → `WAITING` → `CALLED` → `IN_PROGRESS` → `COMPLETED`.
6. **Payment Disbursal Tracking**: Monitor payment status (`PENDING`, `PROCESSING`, `COMPLETED`) and view transaction references (e.g., `PAY-2026-10001`).

### For Officers:
1. **Officer Console Login**: Secure login with officer mobile (`9000000000`) and Demo OTP (`123456`).
2. **Prominent "CALL NEXT FARMER" Control**: One-click calling of the first waiting farmer in queue.
3. **Queue Check-In**: Move farmers from `BOOKED` → `CHECKED_IN` → `WAITING`.
4. **Produce Inspection Form**: Input quantity brought, accepted quantity, quality grade (Grade A/B/C), rate per Kg, and calculate total payout.
5. **Payment Disbursal**: Update payment status from `PENDING` → `PROCESSING` → `COMPLETED`.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, React.js, Tailwind CSS, React Router, Lucide Icons
- **Backend**: Node.js, Express.js, Official MongoDB Node.js driver (`mongodb`), JWT (`jsonwebtoken`), `bcryptjs`
- **HTTP Client**: Custom XMLHttpRequest (XHR API) wrapper in `src/services/api.js` *(Strict restriction: No Axios, No fetch)*
- **Database**: MongoDB Atlas / MongoDB Native Driver (`MongoClient`) with resilient memory fallback

---

## 📂 Project Structure

```text
AgriQueue/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── FarmerRegister.jsx
│   │   │   ├── FarmerLogin.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── BookSlot.jsx
│   │   │   ├── Queue.jsx
│   │   │   ├── Procurement.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── OfficerLogin.jsx
│   │   │   └── OfficerDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js              # Custom XHR HTTP Client (No Axios, No fetch)
│   │   ├── App.jsx                 # React Router & JWT Auth Guard
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind directives
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js                   # MongoDB Atlas MongoClient setup
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   ├── queueController.js
│   │   ├── procurementController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT Authorization header verification
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── queueRoutes.js
│   │   ├── procurementRoutes.js
│   │   └── paymentRoutes.js
│   ├── server.js
│   └── package.json
│
├── .env
├── .env.example
└── README.md
```

---

## 🔑 Environment Variables

File `.env` in project root:
```env
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/
JWT_SECRET=agriqueue_super_secret_jwt_key_2026
PORT=5000
```

---

## 🚀 Installation & Running Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🧪 Complete Testing Workflow

1. **Farmer Registration**:
   - Go to `http://localhost:5173/farmer/register`
   - Fill details: Name: `Ravi Kumar`, Mobile: `9876543210`, Aadhaar: `123456789012`, Village: `Vadlamudi`, District: `Guntur`, Crop: `Paddy`, Land: `3.5`, Quantity: `2500`.
   - Submit registration.

2. **Farmer Login**:
   - Go to `http://localhost:5173/farmer/login`
   - Enter Mobile: `9876543210` → Click **Send OTP**.
   - Enter Demo OTP: `123456` → Click **Verify OTP & Login**.

3. **Book Slot**:
   - Click **Book New Slot** on Farmer Dashboard.
   - Select Centre: `Main Procurement Centre`, Crop: `Paddy`, Date & Slot (`09:00–10:00`).
   - Receive Booking ID (e.g. `AQ-BK-1001`) and Token (e.g. `AQ-1025`).

4. **Live Queue Tracking**:
   - Click **Track Queue Live** to view queue position, farmers ahead, and estimated wait time (`Farmers Ahead × 10 mins`).

5. **Officer Operation**:
   - Go to `http://localhost:5173/officer/login`
   - Enter Officer Mobile: `9000000000` → Demo OTP: `123456`.
   - Click **Check In** on farmer booking.
   - Click **CALL NEXT FARMER** → Status updates to `CALLED`.
   - Click **Start Procurement** → Input quantity accepted (e.g. `2500`), price (e.g. `25`), calculate total (`₹ 62,500`).
   - Click **Complete Procurement** → Procurement status becomes `COMPLETED` & Payment status becomes `PENDING`.
   - Click **Update Payment** → Change status from `PENDING` → `PROCESSING` → `COMPLETED`.

6. **Farmer Verification**:
   - Return to Farmer Dashboard → View updated Procurement & Payment status (`COMPLETED`, Ref `PAY-2026-10001`).
