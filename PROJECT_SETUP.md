# MedLink - Blockchain-Based Health Records Management System

A secure, decentralized healthcare management platform that allows patients to upload, manage, and share their medical reports with doctors using blockchain technology.

## Features

### Patient Features
- User registration and authentication
- Upload medical reports securely
- View all uploaded reports
- Share reports with doctors via email
- Revoke doctor access to reports
- View prescriptions added by doctors

### Doctor Features
- Doctor registration and authentication
- View patient reports shared with them
- Add/Update prescriptions for patient reports
- Secure access to patient medical data

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Blockchain**: Ethereum (via Hardhat)
- **Storage**: IPFS for decentralized file storage
- **Authentication**: JWT tokens with HTTP-only cookies

## Project Structure

```
project/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── blockchain/        # Hardhat smart contracts
```

## Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository (if applicable)

```bash
git clone <your-repo-url>
cd project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
BLOCKCHAIN_RPC_URL=your_ethereum_rpc_url
PRIVATE_KEY=your_ethereum_private_key
CONTRACT_ADDRESS=your_deployed_contract_address
IPFS_API_URL=https://ipfs.infura.io:5001
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Start the React development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Blockchain Setup (Optional)

If you want to deploy the smart contracts:

```bash
cd blockchain
npm install
```

Create a `.env` file in the `blockchain` folder:

```env
PRIVATE_KEY=your_ethereum_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

Compile and deploy contracts:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

## Usage

### For Patients

1. **Register**: Go to `http://localhost:3000/register` and create an account with role "Patient"
2. **Login**: Login with your credentials
3. **Upload Reports**: Navigate to the "Report" tab and upload your medical reports
4. **Share with Doctor**: Click the "Share" button next to any report and enter the doctor's email
5. **View Prescriptions**: If a doctor has added a prescription, click the "View" button in the Prescription column
6. **Revoke Access**: Click "Revoke" to remove a doctor's access to your report

### For Doctors

1. **Register**: Go to `http://localhost:3000/register` and create an account with role "Doctor"
2. **Login**: Login with your credentials
3. **View Shared Reports**: You'll see all reports shared with you in the Patients tab
4. **Add Prescription**: Click "Add Prescription" button next to any report
5. **Update Prescription**: You can update prescriptions by clicking the "Update" button

## API Endpoints

### Patient Authentication
- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - Patient login
- `POST /api/auth/logout` - Patient logout

### Doctor Authentication
- `POST /api/doctor/auth/register` - Register new doctor
- `POST /api/doctor/auth/login` - Doctor login
- `POST /api/doctor/auth/logout` - Doctor logout

### Patient Reports
- `POST /api/report/upload` - Upload medical report
- `GET /api/report/myreports` - Get all user reports
- `GET /api/report/view/:reportHash` - View specific report
- `POST /api/report/share` - Share report with doctor
- `POST /api/report/revoke` - Revoke doctor access
- `GET /api/report/prescription/:reportHash` - Get prescription for report

### Doctor Reports
- `GET /api/doctor/reports/shared` - Get all reports shared with doctor
- `PUT /api/doctor/reports/add-prescription/:reportHash` - Add/Update prescription

## Security Features

- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- File encryption before IPFS upload
- Blockchain-based access control
- CORS protection
- Secure report sharing via email verification

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check if port 5000 is available
- Verify all environment variables are set correctly

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Verify API_BASE_URL in `frontend/src/config/api.js`

### File upload fails
- Check file size (should be under upload limit)
- Verify IPFS connection
- Check file permissions

## Future Enhancements

- Multi-factor authentication
- Real-time notifications
- Advanced report analytics
- Integration with healthcare providers
- Mobile application
- Report categorization and search
- Appointment scheduling
- Emergency access controls

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.
