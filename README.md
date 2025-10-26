# 🏥 MedLink - Blockchain-Based Health Records Management System

> A secure, decentralized healthcare platform for managing and sharing medical records

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-brightgreen.svg)](https://www.mongodb.com/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Hardhat-purple.svg)](https://hardhat.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

MedLink is a revolutionary healthcare management system that leverages blockchain technology to provide:

- **Security**: Encrypted storage on IPFS with blockchain-based access control
- **Privacy**: Patients maintain complete control over their medical data
- **Transparency**: Immutable audit trail of all data access
- **Efficiency**: Seamless sharing of medical records with healthcare providers

---

## ✨ Features

### 👤 For Patients
- ✅ Secure user registration and authentication
- ✅ Upload medical reports with encryption
- ✅ View and manage all health records
- ✅ Share reports with doctors via email
- ✅ Revoke doctor access anytime
- ✅ View prescriptions from doctors
- ✅ Complete control over data sharing

### 👨‍⚕️ For Doctors
- ✅ Professional registration system
- ✅ Access to patient-shared reports
- ✅ Add detailed prescriptions
- ✅ Update existing prescriptions
- ✅ Secure patient data management
- ✅ Track prescription history

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Lucide React** - Modern icons
- **Custom CSS** - Responsive design

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

### Blockchain & Storage
- **Hardhat** - Smart contract development
- **Ethers.js** - Blockchain interaction
- **IPFS** - Decentralized file storage
- **Solidity** - Smart contracts

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend (new terminal)
   cd frontend
   npm install
   ```

2. **Configure Backend**

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/medlink
   JWT_SECRET=your_secret_key_here
   ```

3. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

4. **Access Application**

   Open browser to `http://localhost:3000`

📖 **For detailed setup instructions, see [QUICK_START.md](QUICK_START.md)**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Get started in 5 minutes |
| [PROJECT_SETUP.md](PROJECT_SETUP.md) | Complete setup guide |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Production deployment |
| [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) | Recent changes & features |

---

## 📁 Project Structure

```
medlink/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   └── config/       # API configuration
│   └── public/           # Static files
│
├── backend/              # Express server
│   ├── config/          # Database config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── utils/           # Helper functions
│
└── blockchain/           # Smart contracts
    ├── contracts/       # Solidity contracts
    └── scripts/         # Deployment scripts
```

---

## 🖼️ Screenshots

### Patient Dashboard
- Upload and manage medical reports
- Share with healthcare providers
- View prescriptions

### Doctor Dashboard
- Access patient-shared reports
- Add and update prescriptions
- Manage patient care

### Secure Authentication
- Role-based access control
- JWT-based sessions
- Encrypted data transmission

---

## 🔌 API Documentation

### Authentication Endpoints

#### Patient Authentication
```http
POST /api/auth/register    # Register patient
POST /api/auth/login       # Patient login
POST /api/auth/logout      # Patient logout
```

#### Doctor Authentication
```http
POST /api/doctor/auth/register  # Register doctor
POST /api/doctor/auth/login     # Doctor login
POST /api/doctor/auth/logout    # Doctor logout
```

### Report Management

#### Patient Reports
```http
POST /api/report/upload                    # Upload report
GET  /api/report/myreports                 # Get all reports
GET  /api/report/view/:reportHash          # View specific report
POST /api/report/share                     # Share with doctor
POST /api/report/revoke                    # Revoke access
GET  /api/report/prescription/:reportHash  # Get prescription
```

#### Doctor Reports
```http
GET /api/doctor/reports/shared                       # Get shared reports
PUT /api/doctor/reports/add-prescription/:reportHash # Add prescription
```

---

## 🔐 Security Features

- 🔒 **End-to-end encryption** for all medical data
- 🛡️ **JWT-based authentication** with HTTP-only cookies
- 🔑 **Password hashing** using bcrypt
- 🌐 **CORS protection** for API security
- 📝 **Blockchain audit trail** for data access
- 🎯 **Role-based access control**

---

## 🧪 Testing

### Quick Test Flow

1. **Register as Patient**
   - Email: patient@test.com
   - Password: Test123!
   - Role: Patient

2. **Upload Report**
   - Navigate to Report tab
   - Select and upload a file

3. **Register as Doctor**
   - Use incognito window
   - Email: doctor@test.com
   - Password: Test123!
   - Role: Doctor

4. **Share Report**
   - As patient, share with doctor@test.com

5. **Add Prescription**
   - As doctor, add prescription to shared report

6. **View Prescription**
   - As patient, view the prescription

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the robust database
- Hardhat for blockchain development tools
- IPFS for decentralized storage
- All contributors and testers

---

## 📧 Contact & Support

For questions, issues, or contributions:

- 📫 Open an issue in the repository
- 💬 Join our community discussions
- 📖 Read the documentation

---

## 🎯 Roadmap

### Current Features ✅
- Patient registration and authentication
- Doctor registration and authentication
- Medical report upload and storage
- Report sharing with doctors
- Prescription management
- Access control and revocation

### Upcoming Features 🚧
- [ ] Real-time notifications
- [ ] Report search and filtering
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Appointment scheduling
- [ ] Video consultations
- [ ] Report analytics
- [ ] Emergency access protocols

---

## ⚡ Performance

- **Fast Load Times**: Optimized React components
- **Efficient Storage**: IPFS for distributed file storage
- **Scalable Backend**: Express with MongoDB
- **Blockchain Efficiency**: Gas-optimized smart contracts

---

## 🌟 Star History

If you find this project useful, please consider giving it a star ⭐

---

**Built with ❤️ for better healthcare**

*Last Updated: October 2024*
