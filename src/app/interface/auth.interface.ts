// ============================
// LOGIN REQUEST
// ============================
export interface LoginRequest {
  email: string;
  password: string;
}

// ============================
// USER DETAILS (from backend)
// ============================
export interface UserDetails {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  provider: string;
  role: string;
  emailVerified: boolean;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================
// LOGIN RESPONSE
// ============================
export interface LoginResponse {
  token: string;
  tokenType: string;
  user: UserDetails;
}

// ============================
// REGISTER REQUEST
// ============================
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// ============================
// REGISTER RESPONSE
// ============================
export interface RegisterResponse {
  token: string;
  tokenType: string;
  user: UserDetails;
}

// ============================
// USER INFO (simplified for local storage)
// ============================
export interface UserInfo {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
}

// ============================
// VALIDATE TOKEN RESPONSE
// ============================
export interface ValidateTokenResponse {
  valid: boolean;
  userId?: number;
  email?: string;
}
