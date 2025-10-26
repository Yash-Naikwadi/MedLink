# Deployment Checklist

## Before Running the Application

### ✅ Backend Configuration

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create `.env` file** with these variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key_here
   BLOCKCHAIN_RPC_URL=your_ethereum_rpc_url
   PRIVATE_KEY=your_ethereum_private_key
   CONTRACT_ADDRESS=your_deployed_contract_address
   IPFS_API_URL=https://ipfs.infura.io:5001
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start backend server**
   ```bash
   npm start
   ```
   Server should be running on `http://localhost:5000`

### ✅ Frontend Configuration

1. **Navigate to frontend folder** (in a new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start React app**
   ```bash
   npm start
   ```
   App should open at `http://localhost:3000`

## Quick Test Flow

### Test as Patient

1. Register with:
   - Email: patient@test.com
   - Password: Test123!
   - Role: Patient

2. Login and upload a medical report
3. Share the report with a doctor's email
4. Wait for doctor to add prescription
5. View prescription

### Test as Doctor

1. Register with:
   - Email: doctor@test.com
   - Password: Test123!
   - Role: Doctor

2. Login and view shared reports
3. Add prescription to a report
4. Update prescription if needed

## Common Issues & Solutions

### Issue: Backend won't start
**Solution**:
- Check if MongoDB is running
- Verify PORT 5000 is not in use: `lsof -i :5000`
- Check `.env` file exists and has all required variables

### Issue: Frontend can't connect to backend
**Solution**:
- Verify backend is running on port 5000
- Check console for CORS errors
- Ensure `REACT_APP_API_URL` is not set (defaults to localhost:5000)

### Issue: File upload fails
**Solution**:
- Check IPFS connection
- Verify file size is reasonable
- Check backend logs for detailed error

### Issue: Authentication fails
**Solution**:
- Clear browser cookies
- Check JWT_SECRET is set in backend
- Verify MongoDB connection

## Production Deployment Notes

### Backend
- Set NODE_ENV=production
- Use proper MongoDB Atlas connection
- Set secure JWT_SECRET
- Enable rate limiting
- Set up proper logging
- Use HTTPS

### Frontend
- Build production bundle: `npm run build`
- Deploy build folder to hosting service
- Set REACT_APP_API_URL to production backend URL
- Enable HTTPS

### Blockchain
- Deploy contracts to mainnet
- Update CONTRACT_ADDRESS in backend .env
- Secure private keys

## Security Checklist

- [ ] JWT_SECRET is random and secure
- [ ] MongoDB connection uses authentication
- [ ] CORS is configured for production domains only
- [ ] File upload size limits are set
- [ ] HTTPS is enabled in production
- [ ] Environment variables are not committed to git
- [ ] API rate limiting is enabled
- [ ] Input validation is working
- [ ] SQL/NoSQL injection protection is active
- [ ] XSS protection is enabled

## Performance Optimization

- [ ] Enable gzip compression
- [ ] Implement caching strategy
- [ ] Optimize database queries
- [ ] Use CDN for static assets
- [ ] Enable lazy loading for large components
- [ ] Optimize images before upload
- [ ] Set up monitoring and logging

## Backup Strategy

- [ ] Regular MongoDB backups
- [ ] IPFS content pinning
- [ ] Environment variables backup
- [ ] Smart contract verification on Etherscan
- [ ] Source code version control

---

**Last Updated**: October 2024
