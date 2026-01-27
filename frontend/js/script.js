const API_BASE_URL = 'http://localhost:8080/accounts';

// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Handle Create Account Form
    document.getElementById('createAccountForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        await createAccount();
    });
});

// Create Account Function
async function createAccount() {
    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);
    const email = document.getElementById('email').value;
    
    const resultDiv = document.getElementById('createAccountResult');
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, email })
        });
        
        if (response.ok) {
            const account = await response.json();
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <h3>Account Created Successfully!</h3>
                <p><strong>Account Number:</strong> ${account.accountNumber}</p>
                <p><strong>Name:</strong> ${account.name}</p>
                <p><strong>Age:</strong> ${account.age}</p>
                <p><strong>Email:</strong> ${account.email}</p>
                <p><strong>Initial Balance:</strong> Rs. ${account.balance}</p>
            `;
            document.getElementById('createAccountForm').reset();
        } else {
            throw new Error('Failed to create account');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Check Balance Function
async function checkBalance() {
    const accountNumber = document.getElementById('balanceAccountNumber').value;
    const resultDiv = document.getElementById('balanceResult');
    
    if (!accountNumber) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Please enter an account number';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/balance`);
        
        if (response.ok) {
            const balance = await response.json();
            resultDiv.className = 'result-message info';
            resultDiv.innerHTML = `<strong>Current Balance:</strong> Rs. ${balance}`;
        } else {
            throw new Error('Account not found');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Deposit Function
async function deposit() {
    const accountNumber = document.getElementById('depositAccountNumber').value;
    const amount = parseFloat(document.getElementById('depositAmount').value);
    const resultDiv = document.getElementById('depositResult');
    
    if (!accountNumber || !amount || amount <= 0) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Please enter valid account number and amount';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/deposit?amount=${amount}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const newBalance = await response.json();
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <p>Deposit Successful!</p>
                <p><strong>Amount Deposited:</strong> Rs. ${amount}</p>
                <p><strong>New Balance:</strong> Rs. ${newBalance}</p>
            `;
            document.getElementById('depositAccountNumber').value = '';
            document.getElementById('depositAmount').value = '';
        } else {
            throw new Error('Deposit failed');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Withdraw Function
async function withdraw() {
    const accountNumber = document.getElementById('withdrawAccountNumber').value;
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const resultDiv = document.getElementById('withdrawResult');
    
    if (!accountNumber || !amount || amount <= 0) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Please enter valid account number and amount';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/withdraw?amount=${amount}`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const newBalance = await response.json();
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <p>Withdrawal Successful!</p>
                <p><strong>Amount Withdrawn:</strong> Rs. ${amount}</p>
                <p><strong>New Balance:</strong> Rs. ${newBalance}</p>
            `;
            if (newBalance < 500) {
                resultDiv.innerHTML += '<p style="color: #856404; background: #fff3cd; padding: 10px; margin-top: 10px; border-radius: 5px;"><strong>Warning:</strong> Your balance is below Rs. 500. A low balance alert email has been sent.</p>';
            }
            document.getElementById('withdrawAccountNumber').value = '';
            document.getElementById('withdrawAmount').value = '';
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Withdrawal failed');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Transfer Function
async function transfer() {
    const fromAccount = document.getElementById('transferFromAccount').value;
    const toAccount = document.getElementById('transferToAccount').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const resultDiv = document.getElementById('transferResult');
    
    if (!fromAccount || !toAccount || !amount || amount <= 0) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Please enter valid account numbers and amount';
        return;
    }
    
    if (fromAccount === toAccount) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Cannot transfer to the same account';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${fromAccount}/transfer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountNumber: toAccount,
                amount: amount
            })
        });
        
        if (response.ok) {
            const message = await response.text();
            resultDiv.className = 'result-message success';
            resultDiv.innerHTML = `
                <p>${message}</p>
                <p><strong>From Account:</strong> ${fromAccount}</p>
                <p><strong>To Account:</strong> ${toAccount}</p>
                <p><strong>Amount Transferred:</strong> Rs. ${amount}</p>
            `;
            document.getElementById('transferFromAccount').value = '';
            document.getElementById('transferToAccount').value = '';
            document.getElementById('transferAmount').value = '';
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Transfer failed');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Get Transaction History Function
async function getTransactionHistory() {
    const accountNumber = document.getElementById('historyAccountNumber').value;
    const resultDiv = document.getElementById('historyResult');
    
    if (!accountNumber) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Please enter an account number';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${accountNumber}/history`);
        
        if (response.ok) {
            const transactions = await response.json();
            
            if (transactions.length === 0) {
                resultDiv.innerHTML = '<p class="result-message info">No transactions found for this account.</p>';
                return;
            }
            
            let tableHTML = `
                <table class="transaction-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Type</th>
                            <th>From Account</th>
                            <th>To Account</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            transactions.forEach(tx => {
                const date = new Date(tx.timestamp).toLocaleString();
                const statusClass = tx.status === 'SUCCESS' ? 'status-success' : 'status-failed';
                tableHTML += `
                    <tr>
                        <td>${date}</td>
                        <td>${tx.transactionType}</td>
                        <td>${tx.fromAccountNumber || '-'}</td>
                        <td>${tx.toAccountNumber || '-'}</td>
                        <td>Rs. ${tx.amount}</td>
                        <td class="${statusClass}">${tx.status}</td>
                        <td>${tx.description}</td>
                    </tr>
                `;
            });
            
            tableHTML += '</tbody></table>';
            resultDiv.innerHTML = tableHTML;
        } else {
            throw new Error('Failed to fetch transaction history');
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Get All Accounts Function
async function getAllAccounts() {
    const resultDiv = document.getElementById('accountsList');
    
    try {
        const response = await fetch(API_BASE_URL);
        
        if (response.ok) {
            const accounts = await response.json();
            
            if (accounts.length === 0) {
                resultDiv.innerHTML = '<p class="result-message info">No accounts found.</p>';
                return;
            }
            
            let html = '';
            accounts.forEach(account => {
                html += `
                    <div class="account-card">
                        <h3>${account.name}</h3>
                        <div class="account-info">
                            <p><strong>Account Number:</strong> ${account.accountNumber}</p>
                            <p><strong>Age:</strong> ${account.age}</p>
                            <p><strong>Email:</strong> ${account.email || 'Not provided'}</p>
                            <p><strong>Balance:</strong> Rs. ${account.balance}</p>
                        </div>
                    </div>
                `;
            });
            
            resultDiv.innerHTML = html;
        } else {
            throw new Error('Failed to fetch accounts');
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="result-message error">Error: ${error.message}</p>`;
    }
}
