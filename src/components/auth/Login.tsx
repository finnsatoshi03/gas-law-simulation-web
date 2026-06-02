import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { clearOAuthParamsFromUrl, readOAuthErrorFromUrl } from "@/lib/oauth";
import { AuthDivider } from "./AuthDivider";
import { AuthPage } from "./AuthPage";
import { OAuthButtons } from "./OAuthButtons";
import { authFootLinkClass, authQuietLinkClass } from "./auth-styles";
import {
  AuthAlert,
  AuthField,
  AuthInput,
  AuthSubmitButton,
  PasswordInput,
} from "./auth-ui";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginLocationState {
  from?: {
    pathname?: string;
  };
  logoutError?: string;
  passwordResetSuccess?: string;
}

export const Login = () => {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [oauthError, setOAuthError] = useState("");
  const state = location.state as LoginLocationState | null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  // Surface any error a provider appended to the redirect URL after OAuth.
  useEffect(() => {
    const message = readOAuthErrorFromUrl();
    if (message) {
      setOAuthError(message);
    }
    clearOAuthParamsFromUrl();
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setError("");

    try {
      await login(data.email.trim(), data.password);
      const redirectPath = state?.from?.pathname;
      navigate(redirectPath?.startsWith("/") ? redirectPath : "/home", {
        replace: true,
      });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Could not log in. Try again."
      );
    }
  };

  return (
    <AuthPage
      title="Log in"
      description="Use your account to access the gas law simulations."
      footer={
        <>
          Need an account?{" "}
          <Link className={authFootLinkClass} to="/signup">
            Sign up
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[18px]"
        noValidate
      >
        <AuthField label="Email" htmlFor="email" error={errors.email?.message}>
          <AuthInput
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            hasError={Boolean(errors.email)}
            {...register("email", {
              pattern: {
                message: "Enter a valid email address.",
                value: /^\S+@\S+\.\S+$/,
              },
              required: "Email is required.",
            })}
          />
        </AuthField>

        <AuthField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          action={
            <Link className={authQuietLinkClass} to="/forgot-password">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            hasError={Boolean(errors.password)}
            {...register("password", { required: "Password is required." })}
          />
        </AuthField>

        {state?.passwordResetSuccess ? (
          <AuthAlert variant="success" title="Password updated.">
            {state.passwordResetSuccess}
          </AuthAlert>
        ) : null}

        {state?.logoutError ? (
          <AuthAlert variant="error" title="Logout notice.">
            {state.logoutError}
          </AuthAlert>
        ) : null}

        {error ? (
          <AuthAlert variant="error" title="Login failed.">
            {error}
          </AuthAlert>
        ) : null}

        {oauthError ? (
          <AuthAlert variant="error" title="Sign-in failed.">
            {oauthError}
          </AuthAlert>
        ) : null}

        <AuthSubmitButton loading={isSubmitting} loadingLabel="Logging in...">
          Log in
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <OAuthButtons disabled={isSubmitting} onError={setOAuthError} />
    </AuthPage>
  );
};
