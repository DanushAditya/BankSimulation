package com.bank.BankSimulation.service;

import com.bank.BankSimulation.model.Account;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AlertService {
    
    @Value("${bank.alert.threshold:500}")
    private BigDecimal lowBalanceThreshold;
    
    public boolean shouldSendLowBalanceAlert(Account account) {
        if (account.getBalance().compareTo(lowBalanceThreshold) < 0) {
            return true;
        }
        return false;
    }
    
    public String generateAlertMessage(Account account) {
        return String.format("Low Balance Alert: Your account %s has a balance of Rs. %.2f which is below the threshold of Rs. %.2f",
            account.getAccountNumber(), 
            account.getBalance(),
            lowBalanceThreshold);
    }
}
