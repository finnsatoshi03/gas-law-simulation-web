import { useState } from "react";
import { useForm } from "react-hook-form";
import { Info, MailCheck } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "./AuthPage";
import {
  AuthAlert,
  AuthBackLink,
  AuthField,
  AuthInput,
  AuthSubmitButton,
  ConfirmIcon,
} from "./auth-ui";

interface ForgotPasswordFormValues {
  email: string;
}

export const ForgotPassword = () => {
  const { sendPasswordResetEmail } = useAuth();
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError("");
    const email = data.email.trim();

    try {
      await sendPasswordResetEmail(email);
      setSentTo(email);
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Could not send the recovery email. Try again."
      );
    }
  };

  if (sentTo) {
    return (
      <AuthPage
        center
        icon={
          <ConfirmIcon>
            <MailCheck className="size-[34px]" />
          </ConfirmIcon>
        }
        title="Check your email"
        description={
          <>
            If an account exists for{" "}
            <b className="font-semibold text-[#c9c5e4]">{sentTo}</b>, we've sent
            a link to reset your password.
          </>
        }
        footer={<AuthBackLink />}
      >
        <div className="flex items-start gap-2.5 rounded-xl border border-white/[0.14] bg-white/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-[#948fb6]">
          <Info className="mt-0.5 size-[17px] shrink-0 text-[#c9c5e4]" />
          <span>
            Didn't get it? Check your spam folder, or make sure{" "}
            <b className="font-semibold text-[#c9c5e4]">{sentTo}</b> is correct.
          </span>
        </div>
      </AuthPage>
    );
  }

  return (
    <AuthPage
      title="Forgot password?"
      description="Enter the email tied to your account and we'll send you a link to reset your password."
      footer={<AuthBackLink />}
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

        {error ? (
          <AuthAlert variant="error" title="Recovery failed.">
            {error}
          </AuthAlert>
        ) : null}

        <AuthSubmitButton
          loading={isSubmitting}
          loadingLabel="Sending reset link..."
        >
          Send reset link
        </AuthSubmitButton>
      </form>
    </AuthPage>
  );
};
