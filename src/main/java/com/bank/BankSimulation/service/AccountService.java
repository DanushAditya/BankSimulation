package com.bank.BankSimulation.service;

import com.bank.BankSimulation.dto.CreateAccountRequest;
import com.bank.BankSimulation.model.Account;
import com.bank.BankSimulation.repository.AccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private AlertService alertService;
    
    @Autowired
    private EmailService emailService;
    
    public Account createAccount(CreateAccountRequest request){
        Account account = new Account();
        account.setName(request.getName());
        account.setAge(request.getAge());
        account.setEmail(request.getEmail());
        account.setBalance(BigDecimal.ZERO);
        Account saved = accountRepository.save(account);
        String accountNumber = String.format("%016d", saved.getId());
        saved.setAccountNumber(accountNumber);
        return accountRepository.save(saved);
    }
    
    @Transactional
    public BigDecimal deposit(String accountNumber, BigDecimal amount){
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.deposit(amount);
        accountRepository.save(account);
        
        transactionService.logTransaction(
            accountNumber, 
            null, 
            amount, 
            "DEPOSIT", 
            "SUCCESS", 
            "Deposit to account"
        );
        
        return account.getBalance();
    }
    
    @Transactional
    public BigDecimal withdraw(String accountNumber, BigDecimal amount){
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        
        account.withdraw(amount);
        accountRepository.save(account);
        
        transactionService.logTransaction(
            accountNumber, 
            null, 
            amount, 
            "WITHDRAWAL", 
            "SUCCESS", 
            "Withdrawal from account"
        );
        
        if (alertService.shouldSendLowBalanceAlert(account)) {
            String alertMessage = alertService.generateAlertMessage(account);
            if (account.getEmail() != null && !account.getEmail().isEmpty()) {
                emailService.sendLowBalanceEmail(account.getEmail(), alertMessage);
            }
        }
        
        return account.getBalance();
    }
    
    public void delete(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        accountRepository.delete(account);
    }
    
    @Transactional
    public void transfer(String accountNumber1, String accountNumber2, BigDecimal amount){
        Account account1 = accountRepository.findByAccountNumber(accountNumber1)
            .orElseThrow(() -> new RuntimeException("Your Account not found"));
        Account account2 = accountRepository.findByAccountNumber(accountNumber2)
            .orElseThrow(() -> new RuntimeException("Receiver's Account not found"));
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Invalid transfer amount");
        }
        
        if (amount.compareTo(account1.getBalance()) > 0) {
            transactionService.logTransaction(
                accountNumber1, 
                accountNumber2, 
                amount, 
                "TRANSFER", 
                "FAILED", 
                "Insufficient balance"
            );
            throw new IllegalArgumentException("Insufficient Balance");
        }
        
        account1.withdraw(amount);
        account2.deposit(amount);
        accountRepository.save(account1);
        accountRepository.save(account2);
        
        transactionService.logTransaction(
            accountNumber1, 
            accountNumber2, 
            amount, 
            "TRANSFER", 
            "SUCCESS", 
            "Transfer successful"
        );
        
        if (alertService.shouldSendLowBalanceAlert(account1)) {
            String alertMessage = alertService.generateAlertMessage(account1);
            if (account1.getEmail() != null && !account1.getEmail().isEmpty()) {
                emailService.sendLowBalanceEmail(account1.getEmail(), alertMessage);
            }
        }
    }
    
    public BigDecimal checkBalance(String accountNumber){
        Account account = accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
        return account.getBalance();
    }
    
    public Account getAccount(String accountNumber){
        return accountRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new RuntimeException("Account not found"));
    }
    
    public List<Account> getAllAccounts(){
        return accountRepository.findAll();
    }
}
