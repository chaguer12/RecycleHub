export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  address: string;
  city: string;
  phone: string;
  birthDate: Date;
  profileImage?: string;
  userType: 'collector' | 'particular';
  points: number;
} 