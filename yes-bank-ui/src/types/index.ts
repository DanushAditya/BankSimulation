// YES BANK — TypeScript interfaces matching Spring Boot entity shapes

export interface Account {
  id: number;
  accountNumber: string;   // 16-digit string e.g. "0000000000000001"
  name: string;
  age: number;
  balance: number;         // BigDecimal serialises as number in JSON
  email: string;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
export type TransactionStatus = 'SUCCESS' | 'FAILED';

export interface Transaction {
  id: number;
  fromAccountNumber: string;
  toAccountNumber: string | null;
  amount: number;
  transactionType: TransactionType;
  status: TransactionStatus;
  description: string;
  timestamp: string;       // ISO 8601 LocalDateTime e.g. "2025-06-21T10:30:00"
}

export interface CreateAccountPayload {
  name: string;
  age: number;
  email: string;
}

export interface TransferPayload {
  accountNumber: string;
  amount: number;
}
