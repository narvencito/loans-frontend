export interface LoginDto {
    username?: string;
    email?: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    refreshToken?: string;
    user: {
      id: string;
      name: string;
      role: Role;
      email: string;
      isActive: boolean;
    };
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
  }
  
  export interface Role {
    name: string;
  }