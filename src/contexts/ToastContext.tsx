import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ToastVariant = "error" | "info" | "success";

interface ToastInput {
  description?: string;
  title: string;
  variant?: ToastVariant;
}

interface ToastItem extends Required<ToastInput> {
  id: string;
}

interface ToastContextType {
  dismissToast: (id: string) => void;
  showToast: (toast: ToastInput) => void;
}

const TOAST_DURATION_MS = 4500;

const ToastContext = createContext<ToastContextType | null>(null);

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-zinc-200 bg-white text-zinc-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const ICON_CLASSES: Record<ToastVariant, string> = {
  error: "text-red-600",
  info: "text-zinc-600",
  success: "text-emerald-700",
};

const ToastIcon = ({ variant }: { variant: ToastVariant }) => {
  const Icon =
    variant === "success"
      ? CheckCircle2
      : variant === "error"
        ? TriangleAlert
        : Info;

  return <Icon className={cn("mt-0.5 size-4 shrink-0", ICON_CLASSES[variant])} />;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    ({ description = "", title, variant = "info" }: ToastInput) => {
      const id = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          description,
          id,
          title,
          variant,
        },
      ]);

      window.setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({
      dismissToast,
      showToast,
    }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3"
      >
        {toasts.map((toast) => (
          <div
            className={cn(
              "flex gap-3 rounded-xl border p-4 text-sm shadow-lg",
              VARIANT_CLASSES[toast.variant]
            )}
            key={toast.id}
            role={toast.variant === "error" ? "alert" : "status"}
          >
            <ToastIcon variant={toast.variant} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 leading-5 opacity-80">{toast.description}</p>
              ) : null}
            </div>
            <Button
              className="-mr-2 -mt-2 size-8 shrink-0"
              onClick={() => dismissToast(toast.id)}
              size="icon"
              type="button"
              variant="ghost"
            >
              <X className="size-4" />
              <span className="sr-only">Dismiss notification</span>
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
