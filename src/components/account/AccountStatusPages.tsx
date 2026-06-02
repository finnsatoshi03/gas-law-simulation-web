import {
  Ban,
  CircleX,
  Clock3,
  Loader2,
  LogOut,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { AuthPage } from "@/components/auth/AuthPage";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useLogout } from "@/hooks/use-logout";
import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";
import {
  authGhostButtonClass,
  authPrimaryButtonClass,
} from "@/components/auth/auth-styles";

interface AccountStatusCopy {
  description: string;
  help: string;
  icon: typeof Clock3;
  title: string;
}

const ACCOUNT_STATUS_COPY: Record<
  Exclude<AccountStatus, "active">,
  AccountStatusCopy
> = {
  [ACCOUNT_STATUS.PENDING]: {
    description:
      "Your account has been created successfully and is currently awaiting administrator approval.",
    help: "You will gain access to the simulations once your account has been approved.",
    icon: Clock3,
    title: "Approval pending",
  },
  [ACCOUNT_STATUS.SUSPENDED]: {
    description: "Your account is currently suspended.",
    help: "Please contact the administrator for assistance.",
    icon: Ban,
    title: "Account suspended",
  },
  [ACCOUNT_STATUS.REJECTED]: {
    description: "Your account was not approved for access.",
    help: "Please contact the administrator if you believe this is an error.",
    icon: CircleX,
    title: "Access request rejected",
  },
};

const StatusIcon = ({ icon: Icon }: { icon: typeof Clock3 }) => (
  <div className="mx-auto mb-5 grid size-[72px] place-items-center rounded-[20px] border border-[#c9c5e4]/35 bg-white/[0.06] text-[#c9c5e4] shadow-[0_0_40px_-8px_rgba(126,120,190,0.4)]">
    <Icon className="size-[34px]" />
  </div>
);

const AccountStatusPage = ({
  status,
}: {
  status: Exclude<AccountStatus, "active">;
}) => {
  const { user } = useAuth();
  const { isLoading, refreshProfile } = useProfile();
  const { handleLogout, isLoggingOut } = useLogout();
  const copy = ACCOUNT_STATUS_COPY[status];

  return (
    <AuthPage
      center
      description={copy.description}
      icon={<StatusIcon icon={copy.icon} />}
      title={copy.title}
      footer={
        user?.email ? (
          <span className="text-[#6f6a92]">Signed in as {user.email}</span>
        ) : undefined
      }
    >
      <p className="mb-5 text-center text-[14px] leading-relaxed text-[#c9c5e4]">
        {copy.help}
      </p>
      <div className="flex flex-col gap-3">
        <button
          aria-busy={isLoading}
          className={authPrimaryButtonClass}
          disabled={isLoading}
          onClick={() => void refreshProfile()}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <RefreshCw className="size-[18px]" />
          )}
          {isLoading ? "Checking status..." : "Check status"}
        </button>
        <button
          aria-busy={isLoggingOut}
          className={authGhostButtonClass}
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <LogOut className="size-[18px]" />
          )}
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </AuthPage>
  );
};

export const PendingApprovalPage = () => (
  <AccountStatusPage status={ACCOUNT_STATUS.PENDING} />
);

export const SuspendedAccountPage = () => (
  <AccountStatusPage status={ACCOUNT_STATUS.SUSPENDED} />
);

export const RejectedAccountPage = () => (
  <AccountStatusPage status={ACCOUNT_STATUS.REJECTED} />
);

export const ProfileErrorPage = () => {
  const { user } = useAuth();
  const { error, isLoading, refreshProfile } = useProfile();
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <AuthPage
      center
      description={
        error ??
        "Your account profile could not be loaded. Try again or contact the administrator."
      }
      icon={<StatusIcon icon={TriangleAlert} />}
      title="Account profile unavailable"
      footer={
        user?.email ? (
          <span className="text-[#6f6a92]">Signed in as {user.email}</span>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <button
          aria-busy={isLoading}
          className={authPrimaryButtonClass}
          disabled={isLoading}
          onClick={() => void refreshProfile()}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <RefreshCw className="size-[18px]" />
          )}
          {isLoading ? "Checking profile..." : "Try again"}
        </button>
        <button
          aria-busy={isLoggingOut}
          className={authGhostButtonClass}
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? (
            <Loader2 className="size-[18px] animate-spin" />
          ) : (
            <LogOut className="size-[18px]" />
          )}
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </AuthPage>
  );
};
