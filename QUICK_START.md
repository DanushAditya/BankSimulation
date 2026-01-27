# Quick Start Guide - Bank Simulation System

## Prerequisites Checklist
- [ ] Java 21 installed
- [ ] Maven 3.6+ installed
- [ ] MySQL 8.0+ installed and running
- [ ] Web browser (Chrome/Firefox recommended)

## 5-Minute Setup

### Step 1: Database Setup (1 minute)
```sql
-- Open MySQL command line or workbench
CREATE DATABASE banksimulation;
```

### Step 2: Configure Database Connection (30 seconds)
Open `src/main/resources/application.properties`
```properties
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3: Start Backend (2 minutes)
```bash
# Open terminal in project root
cd BankSimulation
mvn spring-boot:run

# Wait for: "Started BankSimulationApplication in X seconds"
# Backend running on http://localhost:8080
```

### Step 4: Open Frontend (30 seconds)
```bash
# Option 1: Direct
cd frontend
# Double-click index.html OR right-click > Open with Browser

# Option 2: Local Server (recommended)
python -m http.server 8000
# Open browser: http://localhost:8000
```

### Step 5: Test the Application (1 minute)
1. Click "Create Account" tab
2. Fill form: Name="Test User", Age=25, Email="test@email.com"
3. Click "Create Account"
4. Copy the generated account number
5. Go to "Transactions" tab
6. Deposit Rs. 1000
7. Success! ✅

## Quick Test Workflow

### Create Two Accounts & Transfer Money
```
1. Create Account A (save account number)
2. Create Account B (save account number)
3. Deposit Rs. 2000 to Account A
4. Deposit Rs. 1000 to Account B
5. Transfer Rs. 500 from A to B
6. Check transaction history for both
7. View "All Accounts" to see updated balances
```

## Common Issues & Solutions

### Issue: "Can't connect to database"
**Solution:** 
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check username/password in application.properties

### Issue: "Port 8080 already in use"
**Solution:**
- Kill process on 8080: `lsof -ti:8080 | xargs kill -9` (Mac/Linux)
- Or change port in application.properties: `server.port=8081`

### Issue: "CORS error in frontend"
**Solution:**
- Backend has CORS enabled, but ensure backend is running
- Check console for exact error
- Verify API_BASE_URL in script.js points to correct backend

### Issue: "Low balance email not showing"
**Solution:**
- Emails are simulated (not real)
- Check backend console/terminal for email logs
- Look for "EMAIL NOTIFICATION" in console output

## API Testing with cURL

### Create Account
```bash
curl -X POST http://localhost:8080/accounts \
-H "Content-Type: application/json" \
-d '{"name":"John Doe","age":30,"email":"john@email.com"}'
```

### Deposit Money
```bash
curl -X POST "http://localhost:8080/accounts/0000000000000001/deposit?amount=1000"
```

### Check Balance
```bash
curl -X GET http://localhost:8080/accounts/0000000000000001/balance
```

### Get Transaction History
```bash
curl -X GET http://localhost:8080/accounts/0000000000000001/history
```

## Directory Structure Quick Reference
```
BankSimulation/
├── src/main/
│   ├── java/.../
│   │   ├── controller/    # REST APIs
│   │   ├── service/       # Business logic
│   │   ├── model/         # Database entities
│   │   ├── repository/    # Database access
│   │   └── dto/           # Request objects
│   └── resources/
│       └── application.properties  # Configuration
├── frontend/
│   ├── index.html         # Main UI
│   ├── css/styles.css     # Styling
│   └── js/script.js       # Frontend logic
├── README.md              # Full documentation
├── TEST_CASES.md          # Testing guide
└── COMPLETION_SUMMARY.md  # Feature list
```

## Feature Quick Access

### Frontend Tab Navigation
1. **Create Account** → Create new bank accounts
2. **Transactions** → Deposit, Withdraw, Transfer, Check Balance
3. **Transaction History** → View all transaction logs
4. **All Accounts** → See all accounts in system

### Backend Endpoints
- `POST /accounts` → Create account
- `GET /accounts` → Get all accounts
- `GET /accounts/{number}` → Get specific account
- `POST /accounts/{number}/deposit` → Deposit
- `POST /accounts/{number}/withdraw` → Withdraw
- `POST /accounts/{number}/transfer` → Transfer
- `GET /accounts/{number}/balance` → Check balance
- `GET /accounts/{number}/history` → Transaction history

## Configuration Tweaks

### Change Low Balance Threshold
Edit `application.properties`:
```properties
bank.alert.threshold=1000  # Change from default 500
```

### Change Server Port
```properties
server.port=9090
```
Then update frontend `script.js`:
```javascript
const API_BASE_URL = 'http://localhost:9090/accounts';
```

## Demo Account Numbers Format
- Format: 16 digits
- Example: 0000000000000001
- Generated automatically when account is created

## Performance Tips
- Keep transaction history manageable (archive old transactions)
- Create index on account_number in production
- Use connection pooling for multiple concurrent users
- Consider caching frequently accessed account data

## Development Tips
- Use browser DevTools (F12) to debug frontend
- Check Network tab for API request/response
- View Console for JavaScript errors
- Backend logs show in terminal running Spring Boot

## Getting Help
1. Check README.md for detailed documentation
2. Review TEST_CASES.md for usage examples
3. Check console logs for error messages
4. Verify all prerequisites are installed

## Next Steps After Setup
1. ✅ Create multiple test accounts
2. ✅ Test all transaction types
3. ✅ Trigger low balance alert (withdraw to below Rs. 500)
4. ✅ Check transaction history
5. ✅ Review COMPLETION_SUMMARY.md for all features
6. ✅ Run through TEST_CASES.md scenarios

---

**Remember:** This is a simulation system with console-based email. In production, integrate real SMTP service for actual email delivery.

**Need Help?** All documentation files are in the project root:
- README.md → Full documentation
- TEST_CASES.md → Testing guide
- COMPLETION_SUMMARY.md → Features & implementation

**Ready to explore?** Start with creating an account and performing some transactions! 🚀
