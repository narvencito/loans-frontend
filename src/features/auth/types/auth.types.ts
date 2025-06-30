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
    access_token: string;
    refresh_token: string;
    user: User;
  }

  export interface RefreshTokenResponse {
    access_token: string;
    refresh_token?: string;
  }

  export interface RefreshTokenRequest {
    refresh_token: string;
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

export interface Role {
  name: string;
}
  
  export enum RoleEnum {
    ADMIN = 'ADMIN',
    CLIENT = 'CLIENT',
    WORKER = 'WORKER'
  }