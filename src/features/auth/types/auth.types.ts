export interface LoginDto {
    username?: string;
    email?: string;
    password: string;
  }

  export interface ChangePasswordDto {
    userId?: string; 
    newPassword: string;
  }
  
  export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: User;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    clientId?: string;
    isActive: boolean;
    mustChangePassword?: boolean;
    profileIncomplete?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export enum Role {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    WORKER = 'WORKER'
  }