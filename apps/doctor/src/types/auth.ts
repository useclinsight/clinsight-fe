export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
}

export interface BackendErrorResponse {
  detail: ValidationErrorDetail[] | string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordSuccessResponse {
  status: string;
  message: string;
  data: string | null;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_email_verified: boolean;
  is_active: boolean;
  google_id: string | null;
  created_at: string;
  last_login_at: string;
}

export interface VerifyOtpSuccessResponse {
  status: string;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: UserProfile;
  };
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpSuccessResponse {
  status: string;
  message: string;
  data: {
    email: string;
    expires_in_seconds: number;
  };
}
