export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  COURIER = 'COURIER',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text
  role: UserRole;
  status: UserStatus;
  fullName: string;
  nationalCode: string;
  phone: string;
  address: string;
  isOnline?: boolean;
  wallet?: {
    balance: number;
    cardNumber?: string;
    shebaNumber?: string;
    pendingWithdrawal?: number;
  };
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  addresses: {
    title: string;
    detail: string;
    lat: number;
    lng: number;
  }[];
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  price: number;
  status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'DELIVERED';
  courierId?: string;
  timestamp: number;
  coordinates: {
    start: { lat: number; lng: number };
    end: { lat: number; lng: number };
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'admin' | 'system';
  text: string;
  timestamp: number;
}
