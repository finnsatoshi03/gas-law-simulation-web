import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { AuthDivider } from "./AuthDivider";
import { AuthPage } from "./AuthPage";
import { OAuthButtons } from "./OAuthButtons";
import { authFootLinkClass, authPrimaryButtonClass } from "./auth-styles";
import {
  AuthAlert,
  AuthBackLink,
  AuthField,
  AuthInput,
  AuthSubmitButton,
  ConfirmIcon,
  PasswordInput,
  PasswordStrength,
} from "./auth-ui";

interface SignUpFormValues {
  email: string;
  name: string;
  password: string;
}

interface SignUpSuccess {
  email: string;
  requiresEmailConfirmation: boolean;
}

export const SignUp = () => {
  const { signUp } = useAuth();
  const [error, setError] = useState("");
  const [oauthError, setOAuthError] = useState("");
  const [success, setSuccess] = useState<SignUpSuccess | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: { email: "", name: "", password: "" },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    setError("");

    try {
      const email = data.email.trim();
      const result = await signUp(data.name, email, data.password);
      setSuccess({
        email,
        requiresEmailConfirmation: result.requiresEmailConfirmation,
      });
    } catch (signUpError) {
      setError(
        signUpError instanceof Error
          ? signUpError.message
          : "Could not create your account."
      );
    }
  };

  if (success) {
    return (
      <AuthPage
        center
        icon={
          <ConfirmIcon>
            <MailCheck className="size-[34px]" />
          </ConfirmIcon>
        }
        title={
          success.requiresEmailConfirmation
            ? "Confirm your email"
            : "Account created"
        }
        description={
          success.requiresEmailConfirmation ? (
            <>
              We sent a confirmation link to{" "}
              <b className="font-semibold text-[#c9c5e4]">{success.email}</b>.
              Click the link in that email to verify your account before logging
              in.
            </>
          ) : (
            "Your account is ready. You can log in now."
          )
        }
        footer={<AuthBackLink>Back to log in</AuthBackLink>}
      >
        <Link className={authPrimaryButtonClass} to="/login">
          Go to log in
        </Link>
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Create your account"
      description="Join to explore the gas laws in action."
      footer={
        <>
          Already have an account?{" "}
          <Link className={authFootLinkClass} to="/login">
            Log in
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[18px]"
        noValidate
      >
        <AuthField label="Full name" htmlFor="name" error={errors.name?.message}>
          <AuthInput
            id="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            disabled={isSubmitting}
            hasError={Boolean(errors.name)}
            {...register("name", { required: "Name is required." })}
          />
        </AuthField>

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
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            disabled={isSubmitting}
            hasError={Boolean(errors.password)}
            {...register("password", {
              minLength: {
                message: "Password must contain at least 6 characters.",
                value: 6,
              },
              required: "Password is required.",
            })}
          />
          <PasswordStrength value={passwordValue} />
        </AuthField>

        {error ? (
          <AuthAlert variant="error" title="Sign-up failed.">
            {error}
          </AuthAlert>
        ) : null}

        {oauthError ? (
          <AuthAlert variant="error" title="Sign-in failed.">
            {oauthError}
          </AuthAlert>
        ) : null}

        <AuthSubmitButton
          loading={isSubmitting}
          loadingLabel="Creating account..."
        >
          Create account
        </AuthSubmitButton>
      </form>

      <AuthDivider />

      <OAuthButtons disabled={isSubmitting} onError={setOAuthError} />
    </AuthPage>
  );
};
