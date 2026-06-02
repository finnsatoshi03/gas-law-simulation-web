import { forwardRef, InputHTMLAttributes, ReactNode, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import {
  authInputClass,
  authPrimaryButtonClass,
} from "./auth-styles";

/* ------------------------------------------------------------------ */
/* Inputs                                                              */
/* ------------------------------------------------------------------ */

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, hasError, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        authInputClass,
        hasError && "border-red-400/60 focus:border-red-400/70",
        className
      )}
      {...props}
    />
  )
);
AuthInput.displayName = "AuthInput";

export const PasswordInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, hasError, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative flex">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            authInputClass,
            "pr-[46px]",
            hasError && "border-red-400/60 focus:border-red-400/70",
            className
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((value) => !value)}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-[#948fb6] transition hover:bg-white/[0.06] hover:text-[#f3f1fb]"
        >
          {visible ? (
            <EyeOff className="size-[18px]" />
          ) : (
            <Eye className="size-[18px]" />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

/* ------------------------------------------------------------------ */
/* Field wrapper                                                       */
/* ------------------------------------------------------------------ */

interface AuthFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  action?: ReactNode;
  children: ReactNode;
}

export const AuthField = ({
  label,
  htmlFor,
  error,
  action,
  children,
}: AuthFieldProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-3">
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-medium text-[#c9c5e4]"
      >
        {label}
      </label>
      {action}
    </div>
    {children}
    {error ? (
      <span className="text-[12px] font-medium text-red-300">{error}</span>
    ) : null}
  </div>
);

/* ------------------------------------------------------------------ */
/* Password strength meter                                             */
/* ------------------------------------------------------------------ */

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#ef4444", "#f59e0b", "#84cc16", "#2fb574"];

const scorePassword = (password: string) => {
  if (!password) {
    return 0;
  }
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return Math.min(4, Math.max(1, score));
};

export const PasswordStrength = ({ value }: { value: string }) => {
  const score = useMemo(() => scorePassword(value), [value]);

  return (
    <div className="mt-0.5 flex flex-col gap-1.5">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((index) => (
          <span
            key={index}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background:
                index < score ? STRENGTH_COLORS[score] : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
      <span className="min-h-[15px] text-[12px] text-[#948fb6]">
        {value ? STRENGTH_LABELS[score] : ""}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Submit button                                                       */
/* ------------------------------------------------------------------ */

interface AuthSubmitButtonProps {
  loading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
  className?: string;
}

export const AuthSubmitButton = ({
  loading,
  loadingLabel,
  children,
  className,
}: AuthSubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    aria-busy={loading}
    className={cn(authPrimaryButtonClass, "mt-1.5", className)}
  >
    {loading ? <Loader2 className="size-[18px] animate-spin" /> : null}
    {loading && loadingLabel ? loadingLabel : children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Feedback alert                                                      */
/* ------------------------------------------------------------------ */

interface AuthAlertProps {
  variant: "success" | "error";
  title?: string;
  children: ReactNode;
}

export const AuthAlert = ({ variant, title, children }: AuthAlertProps) => {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={cn(
        "flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] leading-relaxed",
        isError
          ? "border-red-400/40 bg-red-500/10 text-red-200"
          : "border-[#2fb574]/40 bg-[#2fb574]/10 text-[#a7e8c8]"
      )}
    >
      {isError ? (
        <CircleAlert className="mt-0.5 size-[17px] shrink-0 text-red-300" />
      ) : (
        <Check className="mt-0.5 size-[17px] shrink-0 text-[#7fe3b1]" />
      )}
      <span>
        {title ? <b className="font-semibold">{title} </b> : null}
        {children}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Confirmation icon (success screens)                                 */
/* ------------------------------------------------------------------ */

export const ConfirmIcon = ({ children }: { children: ReactNode }) => (
  <div
    className="mx-auto mb-5 grid size-[72px] place-items-center rounded-[20px] border border-[#2fb574]/40 text-[#7fe3b1] shadow-[0_0_40px_-8px_rgba(47,181,116,0.45)]"
    style={{
      background:
        "radial-gradient(120% 120% at 30% 20%, rgba(47,181,116,0.28), rgba(47,181,116,0.08))",
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Back link                                                           */
/* ------------------------------------------------------------------ */

export const AuthBackLink = ({
  to = "/login",
  children = "Back to log in",
}: {
  to?: string;
  children?: ReactNode;
}) => (
  <Link
    to={to}
    className="inline-flex items-center gap-1.5 text-[14px] text-[#948fb6] transition hover:text-[#f3f1fb]"
  >
    <ArrowLeft className="size-4" />
    {children}
  </Link>
);
