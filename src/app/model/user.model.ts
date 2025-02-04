export interface User {
    email: string;
    password: string;
    fullName: string;
    address: string;
    phone: string;
    birthDate: string;
    profilePicture?: string;
    role: 'particulier' | 'collecteur';
  }
  