import { Loader2, LogOut } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { useLogout } from "@/hooks/use-logout";

interface LogoutButtonProps {
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export const LogoutButton = ({
  className,
  size,
  variant = "ghost",
}: LogoutButtonProps) => {
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <Button
      aria-busy={isLoggingOut}
      className={className}
      disabled={isLoggingOut}
      onClick={handleLogout}
      size={size}
      type="button"
      variant={variant}
    >
      {isLoggingOut ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {isLoggingOut ? "Logging out..." : "Log out"}
    </Button>
  );
};
