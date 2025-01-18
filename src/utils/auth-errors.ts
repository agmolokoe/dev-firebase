import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getAuthErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("invalid_credentials")) {
          return "Invalid email or password. Please check your credentials and try again.";
        }
        return "Invalid request. Please check your input and try again.";
      case 422:
        return "Invalid email format or weak password. Please check your input.";
      case 500:
        if (error.message.includes("Database error saving new user")) {
          return "An error occurred while creating your account. Please try again.";
        }
        return "An unexpected server error occurred. Please try again later.";
      default:
        return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
};