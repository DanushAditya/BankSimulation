package com.bank.BankSimulation.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    public void sendLowBalanceEmail(String toEmail, String message) {
        // In a real application, this would integrate with an email service
        // For simulation purposes, we'll just log the email
        System.out.println("========================================");
        System.out.println("EMAIL NOTIFICATION");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: Low Balance Alert");
        System.out.println("Message: " + message);
        System.out.println("========================================");
        
        // In production, you would use something like:
        // SimpleMailMessage message = new SimpleMailMessage();
        // message.setTo(toEmail);
        // message.setSubject("Low Balance Alert");
        // message.setText(messageText);
        // mailSender.send(message);
    }
    
    public void sendTransactionEmail(String toEmail, String subject, String message) {
        System.out.println("========================================");
        System.out.println("EMAIL NOTIFICATION");
        System.out.println("To: " + toEmail);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
        System.out.println("========================================");
    }
}
