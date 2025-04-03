
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getAuthErrorMessage = (error: AuthError) => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("invalid_credentials")) {
          return "Invalid email or password. Please check your credentials and try again. If you haven't registered yet, please sign up first.";
        }
        if (error.message.includes("provider_token")) {
          return "There was an issue with the social login. Please try again or use a different login method.";
        }
        return "Invalid request. Please check your input and try again.";
      case 422:
        return "Invalid email format or weak password. Please check your input.";
      case 429:
        return "Too many login attempts. Please try again later.";
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
