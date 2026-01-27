# Manual Test Cases for Bank Simulation System

## Test Environment Setup
- Backend Server: http://localhost:8080
- Frontend: Open index.html in browser
- Database: MySQL (banksimulation database)

## Test Suite 1: Account Management

### TC-001: Create New Account
**Objective:** Verify that a new account can be created successfully

**Steps:**
1. Navigate to "Create Account" tab
2. Enter Name: "John Doe"
3. Enter Age: 25
4. Enter Email: "john.doe@email.com"
5. Click "Create Account" button

**Expected Result:**
- Success message displayed
- 16-digit account number generated
- Initial balance: Rs. 0
- Account details shown in success message

**Status:** ✅ Pass / ❌ Fail

---

### TC-002: Create Account with Invalid Data
**Objective:** Verify validation for invalid account creation

**Steps:**
1. Navigate to "Create Account" tab
2. Enter Age: 15 (below minimum age)
3. Try to create account

**Expected Result:**
- Error message displayed
- Account not created

**Status:** ✅ Pass / ❌ Fail

---

### TC-003: View All Accounts
**Objective:** Verify that all accounts can be retrieved

**Steps:**
1. Create 2-3 accounts
2. Navigate to "All Accounts" tab
3. Click "Refresh Accounts" button

**Expected Result:**
- All created accounts displayed
- Account details visible (number, name, age, email, balance)

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 2: Deposit Operations

### TC-004: Successful Deposit
**Objective:** Verify money can be deposited into an account

**Prerequisites:** Account with number XXXXXXXXXXXX exists

**Steps:**
1. Navigate to "Transactions" tab
2. In "Deposit Money" section, enter account number
3. Enter amount: 1000
4. Click "Deposit" button

**Expected Result:**
- Success message displayed
- New balance shown: Rs. 1000
- Transaction logged in history

**Status:** ✅ Pass / ❌ Fail

---

### TC-005: Deposit with Invalid Amount
**Objective:** Verify validation for invalid deposit amounts

**Steps:**
1. Navigate to "Transactions" tab
2. Enter account number
3. Enter amount: -500 (negative amount)
4. Click "Deposit" button

**Expected Result:**
- Error message displayed
- Balance unchanged

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 3: Withdrawal Operations

### TC-006: Successful Withdrawal
**Objective:** Verify money can be withdrawn from an account

**Prerequisites:** Account with balance Rs. 1000

**Steps:**
1. Navigate to "Transactions" tab
2. In "Withdraw Money" section, enter account number
3. Enter amount: 200
4. Click "Withdraw" button

**Expected Result:**
- Success message displayed
- New balance shown: Rs. 800
- Transaction logged in history

**Status:** ✅ Pass / ❌ Fail

---

### TC-007: Withdrawal with Insufficient Balance
**Objective:** Verify validation for insufficient balance

**Prerequisites:** Account with balance Rs. 500

**Steps:**
1. Navigate to "Transactions" tab
2. Enter account number
3. Enter amount: 600
4. Click "Withdraw" button

**Expected Result:**
- Error message: "Insufficient Balance"
- Balance unchanged: Rs. 500
- Failed transaction logged

**Status:** ✅ Pass / ❌ Fail

---

### TC-008: Low Balance Alert
**Objective:** Verify low balance alert is triggered

**Prerequisites:** Account with balance Rs. 600

**Steps:**
1. Withdraw Rs. 200
2. Check console logs in browser developer tools
3. Check backend console

**Expected Result:**
- New balance: Rs. 400
- Low balance warning displayed on UI
- Email notification logged in backend console
- Alert threshold: Rs. 500

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 4: Transfer Operations

### TC-009: Successful Transfer
**Objective:** Verify money can be transferred between accounts

**Prerequisites:** 
- Account A with balance Rs. 1000
- Account B with balance Rs. 500

**Steps:**
1. Navigate to "Transactions" tab
2. In "Transfer Money" section:
   - From Account: Account A number
   - To Account: Account B number
   - Amount: 300
3. Click "Transfer" button

**Expected Result:**
- Success message displayed
- Account A balance: Rs. 700
- Account B balance: Rs. 800
- Transfer transaction logged for both accounts

**Status:** ✅ Pass / ❌ Fail

---

### TC-010: Transfer to Same Account
**Objective:** Verify validation for same account transfer

**Steps:**
1. Navigate to "Transactions" tab
2. Enter same account number in both fields
3. Enter amount: 100
4. Click "Transfer" button

**Expected Result:**
- Error message: "Cannot transfer to the same account"
- Balance unchanged

**Status:** ✅ Pass / ❌ Fail

---

### TC-011: Transfer with Insufficient Balance
**Objective:** Verify validation for insufficient balance in transfer

**Prerequisites:** Account A with balance Rs. 400

**Steps:**
1. Try to transfer Rs. 500 from Account A to Account B
2. Click "Transfer" button

**Expected Result:**
- Error message: "Insufficient Balance"
- Both account balances unchanged
- Failed transaction logged

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 5: Balance Check

### TC-012: Check Balance
**Objective:** Verify account balance can be checked

**Prerequisites:** Account with known balance

**Steps:**
1. Navigate to "Transactions" tab
2. In "Check Balance" section, enter account number
3. Click "Check Balance" button

**Expected Result:**
- Current balance displayed correctly
- No changes to account

**Status:** ✅ Pass / ❌ Fail

---

### TC-013: Check Balance for Non-Existent Account
**Objective:** Verify error handling for invalid account

**Steps:**
1. Enter non-existent account number: 9999999999999999
2. Click "Check Balance" button

**Expected Result:**
- Error message: "Account not found"

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 6: Transaction History

### TC-014: View Transaction History
**Objective:** Verify complete transaction history can be viewed

**Prerequisites:** Account with multiple transactions (deposits, withdrawals, transfers)

**Steps:**
1. Navigate to "Transaction History" tab
2. Enter account number
3. Click "Get History" button

**Expected Result:**
- All transactions displayed in table format
- Columns: Date/Time, Type, From Account, To Account, Amount, Status, Description
- Transactions sorted by most recent first
- Correct transaction details shown

**Status:** ✅ Pass / ❌ Fail

---

### TC-015: Empty Transaction History
**Objective:** Verify handling of accounts with no transactions

**Prerequisites:** Newly created account with no transactions

**Steps:**
1. Navigate to "Transaction History" tab
2. Enter new account number
3. Click "Get History" button

**Expected Result:**
- Message: "No transactions found for this account"

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 7: UI/UX Testing

### TC-016: Tab Navigation
**Objective:** Verify tab navigation works correctly

**Steps:**
1. Click on each tab (Create Account, Transactions, Transaction History, All Accounts)
2. Verify content switches correctly
3. Check active tab highlighting

**Expected Result:**
- Tabs switch smoothly
- Active tab highlighted
- Content displays correctly for each tab

**Status:** ✅ Pass / ❌ Fail

---

### TC-017: Form Reset After Successful Operation
**Objective:** Verify forms are reset after successful operations

**Steps:**
1. Create an account
2. Check if form fields are cleared after success

**Expected Result:**
- All form fields cleared
- Ready for next operation

**Status:** ✅ Pass / ❌ Fail

---

### TC-018: Responsive Design
**Objective:** Verify UI works on different screen sizes

**Steps:**
1. Open application on desktop browser
2. Resize window to tablet size
3. Resize to mobile size
4. Test all features

**Expected Result:**
- Layout adapts to screen size
- All features remain functional
- Text remains readable

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 8: Integration Testing

### TC-019: End-to-End Account Lifecycle
**Objective:** Test complete account lifecycle

**Steps:**
1. Create new account
2. Deposit Rs. 2000
3. Withdraw Rs. 500
4. Transfer Rs. 300 to another account
5. Check balance
6. View transaction history
7. Verify all operations in "All Accounts" view

**Expected Result:**
- All operations complete successfully
- Final balance correct: Rs. 1200
- All 3 transactions visible in history
- Account details accurate in All Accounts view

**Status:** ✅ Pass / ❌ Fail

---

### TC-020: Multiple Concurrent Operations
**Objective:** Test system with multiple operations

**Steps:**
1. Create 5 accounts
2. Perform various deposits, withdrawals, and transfers
3. Check transaction histories
4. Verify all account balances

**Expected Result:**
- All operations complete successfully
- No data inconsistencies
- All transaction logs accurate
- Account balances correctly calculated

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 9: Error Handling

### TC-021: Backend Server Down
**Objective:** Verify error handling when backend is unavailable

**Steps:**
1. Stop the Spring Boot backend server
2. Try to create an account from frontend
3. Try other operations

**Expected Result:**
- Appropriate error messages displayed
- Application doesn't crash
- User informed about connection issue

**Status:** ✅ Pass / ❌ Fail

---

### TC-022: Database Connection Error
**Objective:** Verify handling of database issues

**Steps:**
1. Stop MySQL database
2. Try to perform operations
3. Check backend logs

**Expected Result:**
- Backend handles error gracefully
- Appropriate error returned to frontend
- Error logged in backend console

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 10: Alert System

### TC-023: Low Balance Email Notification
**Objective:** Verify email notification is sent for low balance

**Prerequisites:** Account with email and balance Rs. 600

**Steps:**
1. Withdraw Rs. 200 (balance becomes Rs. 400)
2. Check backend console logs
3. Verify email notification details

**Expected Result:**
- Email notification logged in console
- Contains: To email, Subject, Message with account details
- Alert shows balance below threshold (Rs. 500)

**Status:** ✅ Pass / ❌ Fail

---

### TC-024: Low Balance Alert in Transfer
**Objective:** Verify alert triggered during transfer

**Prerequisites:** Account A with balance Rs. 600

**Steps:**
1. Transfer Rs. 200 from Account A
2. Check for low balance alert

**Expected Result:**
- Transfer successful
- Low balance alert triggered
- Email notification sent

**Status:** ✅ Pass / ❌ Fail

---

## Test Execution Summary

| Test Suite | Total Tests | Passed | Failed | Pass % |
|------------|-------------|--------|--------|--------|
| Account Management | 3 | | | |
| Deposit Operations | 2 | | | |
| Withdrawal Operations | 3 | | | |
| Transfer Operations | 3 | | | |
| Balance Check | 2 | | | |
| Transaction History | 2 | | | |
| UI/UX Testing | 3 | | | |
| Integration Testing | 2 | | | |
| Error Handling | 2 | | | |
| Alert System | 2 | | | |
| **TOTAL** | **24** | | | |

## Test Environment Details
- **Date:** _______________
- **Tester:** _______________
- **Backend Version:** 0.0.1-SNAPSHOT
- **Database:** MySQL 8.0
- **Browser:** _______________
- **OS:** _______________

## Notes and Observations
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

## Defects Found
| Defect ID | Description | Severity | Status |
|-----------|-------------|----------|--------|
| | | | |
| | | | |

## Sign-off
- **Tested By:** _______________ Date: _______________
- **Reviewed By:** _______________ Date: _______________
- **Approved By:** _______________ Date: _______________
