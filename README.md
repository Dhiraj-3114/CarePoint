# 🏥 CarePoint

This is a **Doctor Appointment Booking System** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It includes three main portals:

- **User Side**: For patients to book appointments
- **Doctor Side**: For doctors to manage their profile and appointments
- **Admin Side**: For administrators to manage doctors and appointments

---

## 🌐 Live Demo

- **User Side**: [https://doctor-appointment-booking-system-nine.vercel.app/](https://doctor-appointment-booking-system-nine.vercel.app/)
- **Admin Side**: [https://doctor-appointment-booking-system-8-seven.vercel.app/](https://doctor-appointment-booking-system-8-seven.vercel.app/)

---

## 🧰 Technologies Used

**Frontend (User & Admin):**
- React.js
- JavaScript
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB
- JWT (for authentication)
- Cloudinary & Multer (for file upload)
- Razorpay (for payment)

---

## 👥 Features

### User Side
- User login and registration
- View list of doctors
- Book appointments
- View appointment history
- Online payment support

### 🩺 Doctor Side
- Login & Dashboard
- View appointments
- View and edit doctor profile
- Toggle availability status

### Admin Side
- Admin login
- Dashboard overview
- View all appointments
- Add new doctors (with image upload)
- View doctor list
- Change doctor availability

---

## ⚙️ How to Run Locally

### Clone this repository
```bash
git clone https://github.com/your-username/doctor-appointment-booking-system.git
cd CarePoint
```

## ⚙️ Setup Backend
```bash
cd backend
npm install
```

### Create a .env file in the backend folder:
```bash
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key 
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CURRENCY=INR
```

### Run backend server:
```bash
npm start
```
---

## ⚙️ Setup Frontend (User and Admin side separately)
### For User
```bash
cd frontend
npm install
npm run dev
```
#### Create .env file in frontend folder:
```bash
VITE_BACKEND_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### For Admin
```bash
cd admin
npm install
npm run dev 
```
#### Create .env file in admin folder:
```bash
VITE_BACKEND_URL=your_backend_url
```

---

## ✅ Future Improvements
- Email notifications
- Doctor profile with ratings
- Patient medical history records
- Admin analytics 

---

## 🙌 Author
#### Dhiraj Patel
🌐 GitHub Profile

---