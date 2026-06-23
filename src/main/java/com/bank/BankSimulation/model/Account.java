package com.bank.BankSimulation.model;

import jakarta.persistence.*;
import org.hibernate.annotations.AnyDiscriminatorImplicitValues;

import java.math.BigDecimal;

@Entity
@Table(name = "Accounts")
public class Account {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    @Column(unique = true)
    private String accountNumber;
    @Column(nullable = false)
    private String name;
    private int age;
    private BigDecimal balance;
    private String email;

    //adding balance after deposit
    public void deposit(BigDecimal amount){
        if(amount==null || amount.compareTo(BigDecimal.ZERO)<=0){
            throw new IllegalArgumentException("Invalid deposit amount");
        }
        this.balance=balance.add(amount);
    }

    public void withdraw(BigDecimal amount){
        if(amount==null || amount.compareTo(BigDecimal.ZERO)<=0 || amount.compareTo(balance)>0){
            throw new IllegalArgumentException(("Invalid withdraw amount"));
        }
        this.balance=balance.subtract(amount);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
