import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { AuthPage } from "./AuthPage";
import {
  AuthAlert,
  AuthBackLink,
  AuthField,
  AuthSubmitButton,
  PasswordInput,
  PasswordStrength,
} from "./auth-ui";

interface ResetPasswordFormValues {
  confirmPassword: string;
  password: string;
}

export const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { confirmPassword: "", password: "" },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError("");

    try {
      await updatePassword(data.password);
      navigate("/login", {
        replace: true,
        state: {
          passwordResetSuccess:
            "Your password has been changed. Log in with your new password.",
        },
      });
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : "Could not update your password."
      );
    }
  };

  return (
    <AuthPage
      title="Set a new password"
      description="Choose a strong password you haven't used before for this account."
      footer={<AuthBackLink />}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[18px]"
        noValidate
      >
        <AuthField
          label="New password"
          htmlFor="password"
          error={errors.password?.message}
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Enter new password"
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

        <AuthField
          label="Confirm password"
          htmlFor="confirm"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Re-enter new password"
            disabled={isSubmitting}
            hasError={Boolean(errors.confirmPassword)}
            {...register("confirmPassword", {
              required: "Confirm your password.",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match.",
            })}
          />
        </AuthField>

        {error ? (
          <AuthAlert variant="error" title="Password update failed.">
            {error}
          </AuthAlert>
        ) : null}

        <AuthSubmitButton
          loading={isSubmitting}
          loadingLabel="Updating password..."
        >
          Update password
        </AuthSubmitButton>
      </form>
    </AuthPage>
  );
};
