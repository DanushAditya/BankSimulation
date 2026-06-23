package com.bank.BankSimulation.service;

import com.bank.BankSimulation.model.Transaction;
import com.bank.BankSimulation.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public Transaction logTransaction(String fromAccount, String toAccount, 
                                     BigDecimal amount, String type, String status, String description) {
        Transaction transaction = new Transaction();
        transaction.setFromAccountNumber(fromAccount);
        transaction.setToAccountNumber(toAccount);
        transaction.setAmount(amount);
        transaction.setTransactionType(type);
        transaction.setStatus(status);
        transaction.setDescription(description);
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getAccountHistory(String accountNumber) {
        List<Transaction> sentTransactions = transactionRepository
            .findByFromAccountNumberOrderByTimestampDesc(accountNumber);
        List<Transaction> receivedTransactions = transactionRepository
            .findByToAccountNumberOrderByTimestampDesc(accountNumber);
        
        return Stream.concat(sentTransactions.stream(), receivedTransactions.stream())
            .sorted((t1, t2) -> t2.getTimestamp().compareTo(t1.getTimestamp()))
            .collect(Collectors.toList());
    }
}
