export const getSafeAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (message.includes("email not confirmed")) {
    return "Confirm your email address before logging in.";
  }

  if (message.includes("user already registered")) {
    return "An account with this email address already exists.";
  }

  if (message.includes("password should be")) {
    return "Choose a stronger password with at least 6 characters.";
  }

  if (message.includes("invalid email")) {
    return "Enter a valid email address.";
  }

  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  if (
    message.includes("expired") ||
    message.includes("invalid token") ||
    message.includes("otp")
  ) {
    return "This recovery link is invalid or expired. Request a new one.";
  }

  if (message.includes("access_denied") || message.includes("cancelled")) {
    return "Sign-in was cancelled. Try again to continue.";
  }

  if (
    message.includes("provider is not enabled") ||
    message.includes("unsupported provider")
  ) {
    return "This sign-in option is currently unavailable. Try another method.";
  }

  if (
    message.includes("popup") ||
    message.includes("network") ||
    message.includes("failed to fetch")
  ) {
    return "We could not reach the sign-in service. Check your connection and try again.";
  }

  return fallbackMessage;
};

