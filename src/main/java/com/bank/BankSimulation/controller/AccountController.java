package com.bank.BankSimulation.controller;

import com.bank.BankSimulation.dto.CreateAccountRequest;
import com.bank.BankSimulation.dto.TransferRequest;
import com.bank.BankSimulation.model.Account;
import com.bank.BankSimulation.model.Transaction;
import com.bank.BankSimulation.service.AccountService;
import com.bank.BankSimulation.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/accounts")
@CrossOrigin(origins = "*")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @Autowired
    private TransactionService transactionService;
    
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody CreateAccountRequest request){
        return new ResponseEntity<>(accountService.createAccount(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts(){
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getAccount(@PathVariable String accountNumber){
        return ResponseEntity.ok(accountService.getAccount(accountNumber));
    }

    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<BigDecimal> deposit(@PathVariable String accountNumber, @RequestParam BigDecimal amount){
        BigDecimal updatedBalance = accountService.deposit(accountNumber, amount);
        return new ResponseEntity<>(updatedBalance, HttpStatus.OK);
    }

    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<BigDecimal> withdraw(@PathVariable String accountNumber, @RequestParam BigDecimal amount){
        BigDecimal updatedBalance = accountService.withdraw(accountNumber, amount);
        return new ResponseEntity<>(updatedBalance, HttpStatus.OK);
    }

    @DeleteMapping("/{accountNumber}/delete")
    public ResponseEntity<String> delete(@PathVariable String accountNumber){
        accountService.delete(accountNumber);
        return ResponseEntity.ok("Account deleted successfully");
    }

    @PostMapping("/{accountNumber}/transfer")
    public ResponseEntity<String> transfer(@PathVariable String accountNumber, @RequestBody TransferRequest request){
        accountService.transfer(accountNumber, request.getAccountNumber(), request.getAmount());
        return ResponseEntity.ok("Transaction successful");
    }

    @GetMapping("/{accountNumber}/balance")
    public ResponseEntity<BigDecimal> checkBalance(@PathVariable String accountNumber){
        return ResponseEntity.ok(accountService.checkBalance(accountNumber));
    }
    
    @GetMapping("/{accountNumber}/history")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable String accountNumber){
        return ResponseEntity.ok(transactionService.getAccountHistory(accountNumber));
    }
}
