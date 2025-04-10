# React + Vite
# 💼 Job Portal Web Application

This is a full-stack Job Portal that connects job seekers and recruiters. It features role-based login, resume uploads, real-time notifications

---
## 🚀 Features

- **Role-Based Access**: Supports Job Seeker and Recruiter accounts.
- **Secure Authentication**: JWT-based login & registration with Bcrypt password hashing.
- **Resume Uploads**: Upload PDFs to Cloudinary.
- **Real-Time Notifications**: Stay updated with Socket.IO.

---

## 🧰 Tech Stack

| Tech               | Usage              |
|-----------------------|--------------------|
| **React.js**          | Frontend UI        |
| **Tailwind CSS**      | Styling            |
| **React Router**      | Client-Side Routing|
| **Node.js + Express** | Backend Server     |
| **MongoDB + Mongoose**| Database           |
| **Socket.IO**         | Real-time Features |
| **JWT + Bcrypt**      | Auth & Security    |
| **Cloudinary**        | Resume Uploads     |
| **Nodemailer**        | Sending Emails     |

---

## 📸 Screenshots

### 🔐 Login & Register
![Login Page](images/login-page.png)

### 🧑‍💼 Recruiter Dashboard
![Recruiter Dashboard](images/recruiter-dashboard.png)

### 📄 Job Application Page
![Job Application](images/job-application.png)

### 📁 Resume Upload Feature
![Resume Upload](images/resume-upload.png)

### 🔔 Real-time Notification Popup
![Notification](images/real-time-notification.png)

---

## 📁 Project Structure

```
job-portal/
├── frontend/            # Frontend (React) source code
│   ├── src/     # Controller logic
│   ├── routes/          # API endpoints
│   └── index.js         # App entry point
├── backend/              # Backend (Express) source code
│   ├── controllers/     # Controller logic
│   ├── routes/          # API endpoints
│   └── index.js         # App entry point
├── images/              # Screenshots and assets for README
├── .env.example         # Sample environment file
└── README.md            # This file
```

---

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/PriyaKumari2309/HireHub.git
cd job-portal
```
---
**2. Backend Setup**

2.1 Navigate to the backend folder:

```bash
cd server
```

2.2 Install backend dependencies:

```bash
npm install
```

2.3 Create a .env file (use .env.example as a guide) and add your configuration variables:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2.4 Start the backend server:

```bash
node index.js
```
The backend should now be running (usually on http://localhost:5000 or your specified port).

---
**3. Frontend Setup**

3.1 Navigate to the frontend folder:

```bash
cd client
```

3.2 Install frontend dependencies:

```bash
npm install
```

3.3 Start the development server:

```bash
npm run dev
```

**The frontend is now live (typically on http://localhost:5173).**
---
✅ **Future Features**

-Admin Panel

-Email Notifications

-Interview Scheduling Module

---
🙋‍♂️ **Author**  
    **Priya Kumari**


[Github](https://github.com/PriyaKumari2309)  
[LinkedIn](https://www.linkedin.com/in/priya-kumari9)

---

⭐ Support

**If you like this project, please ⭐ the repo and share it!**

---

### Next Steps:

1. **Customize the placeholders** (e.g., `your-username`, `your_mongodb_uri`, etc.) with your actual data.
2. **Place your screenshots** in the `images/` folder with the exact filenames referenced in the README.
3. Commit and push your updated README to GitHub.

This combined README clearly explains both frontend and backend setup in one file while also showcasing your project features, tech stack, and other important details. Let me know if you need further changes or additional sections!

















