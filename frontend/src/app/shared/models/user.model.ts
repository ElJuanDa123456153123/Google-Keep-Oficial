export interface User {
  id: number;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  avatar_url?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  avatar_url?: string;
}
