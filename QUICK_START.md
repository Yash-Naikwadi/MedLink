# 🚀 Quick Start Guide - MedLink

## Get Up and Running in 5 Minutes!

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (in a new terminal)
cd frontend
npm install
```

### Step 2: Configure Backend

Create `backend/.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/medlink
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

> **Note**: Make sure MongoDB is running on your system!

### Step 3: Start Backend

```bash
cd backend
npm start
```

You should see: `🚀 Server running on port 5000`

### Step 4: Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm start
```

Browser will open automatically at `http://localhost:3000`

### Step 5: Test the Application

#### Create a Patient Account
1. Go to Register tab
2. Enter email: `patient@test.com`
3. Enter password: `Test123!`
4. Select Role: **Patient**
5. Click "Create Account"

#### Login as Patient
1. Switch to Login tab
2. Enter email: `patient@test.com`
3. Enter password: `Test123!`
4. Select Role: **Patient**
5. Click "Login"

#### Upload a Report
1. Go to "Report" tab
2. Click "Choose File" and select any document
3. Click "Upload Document"
4. Your report appears in the table below

#### Create a Doctor Account
1. Open an **incognito/private window**
2. Go to `http://localhost:3000/register`
3. Enter email: `doctor@test.com`
4. Enter password: `Test123!`
5. Select Role: **Doctor**
6. Click "Create Account"

#### Share Report with Doctor (as Patient)
1. In patient dashboard, find your uploaded report
2. Click "Share" button
3. Enter doctor's email: `doctor@test.com`
4. Click "Share"
5. Report is now shared!

#### Add Prescription (as Doctor)
1. In doctor's window, login with `doctor@test.com`
2. You'll see the shared report in the table
3. Click "Add Prescription"
4. Enter prescription details
5. Click "Add Prescription"

#### View Prescription (as Patient)
1. Back in patient dashboard, refresh if needed
2. You'll see "View" button in Prescription column
3. Click "View" to see the doctor's prescription

---

## 🎉 Success!

You've successfully:
- ✅ Set up the backend and frontend
- ✅ Created patient and doctor accounts
- ✅ Uploaded a medical report
- ✅ Shared the report with a doctor
- ✅ Added a prescription as a doctor
- ✅ Viewed the prescription as a patient

---

## 📚 Next Steps

1. Read **PROJECT_SETUP.md** for detailed configuration
2. Check **DEPLOYMENT_CHECKLIST.md** before going to production
3. Review **CHANGES_SUMMARY.md** to see all features

---

## ⚠️ Troubleshooting

**Backend won't start?**
- Check if MongoDB is running: `mongod --version`
- Make sure port 5000 is free: `lsof -i :5000`

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check browser console for errors
- Clear browser cache and cookies

**File upload fails?**
- Check backend logs for errors
- Verify file size is reasonable (<10MB)
- Check IPFS configuration in backend

---

## 🆘 Need Help?

- Check the detailed **PROJECT_SETUP.md**
- Review API endpoints in documentation
- Check backend console for error messages
- Check browser console for frontend errors

---

**Happy coding! 🎊**
