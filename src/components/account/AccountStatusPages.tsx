import {
  Ban,
  CircleX,
  Clock3,
  Loader2,
  LogOut,
  RefreshCw,
  Trash2,
  TriangleAlert,
} from "lucide-react";

import { AuthPage } from "@/components/auth/AuthPage";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessMessages } from "@/contexts/AccessMessagesContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useLogout } from "@/hooks/use-logout";
import { ACCOUNT_STATUS, AccountStatus } from "@/lib/account-status";
import { ACCESS_MESSAGE_KEY, AccessMessageKey } from "@/lib/access-messages";
import {
  authGhostButtonClass,
  authPrimaryButtonClass,
} from "@/components/auth/auth-styles";

interface AccountStatusCopy {
  icon: typeof Clock3;
  messageKey: AccessMessageKey;
}

const ACCOUNT_STATUS_COPY: Record<
  Exclude<AccountStatus, "active">,
  AccountStatusCopy
> = {
  [ACCOUNT_STATUS.PENDING]: {
    icon: Clock3,
    messageKey: ACCESS_MESSAGE_KEY.ACCOUNT_PENDING,
  },
  [ACCOUNT_STATUS.SUSPENDED]: {
    icon: Ban,
    messageKey: ACCESS_MESSAGE_KEY.ACCOUNT_SUSPENDED,
  },
  [ACCOUNT_STATUS.REJECTED]: {
    icon: CircleX,
    messageKey: ACCESS_MESSAGE_KEY.ACCOUNT_REJECTED,
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
  const { getAccessMessage } = useAccessMessages();
  const { isLoading, refreshProfile } = useProfile();
  const { handleLogout, isLoggingOut } = useLogout();
  const copy = ACCOUNT_STATUS_COPY[status];
  const message = getAccessMessage(copy.messageKey);

  return (
    <AuthPage
      center
      description={message.description}
      icon={<StatusIcon icon={copy.icon} />}
      title={message.title}
      footer={
        user?.email ? (
          <span className="text-[#6f6a92]">Signed in as {user.email}</span>
        ) : undefined
      }
    >
      {message.helpText ? (
        <p className="mb-5 text-center text-[14px] leading-relaxed text-[#c9c5e4]">
          {message.helpText}
        </p>
      ) : null}
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

export const DeletedAccountPage = () => {
  const { user } = useAuth();
  const { handleLogout, isLoggingOut } = useLogout();

  return (
    <AuthPage
      center
      description="This account has been removed from application access. Contact an administrator if you believe this was a mistake."
      icon={<StatusIcon icon={Trash2} />}
      title="Account deleted"
      footer={
        user?.email ? (
          <span className="text-[#6f6a92]">Signed in as {user.email}</span>
        ) : undefined
      }
    >
      <button
        aria-busy={isLoggingOut}
        className={authPrimaryButtonClass}
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
    </AuthPage>
  );
};

export const ProfileErrorPage = () => {
  const { user } = useAuth();
  const { getAccessMessage } = useAccessMessages();
  const { error, isLoading, refreshProfile } = useProfile();
  const { handleLogout, isLoggingOut } = useLogout();
  const message = getAccessMessage(ACCESS_MESSAGE_KEY.PROFILE_ERROR);

  return (
    <AuthPage
      center
      description={error ?? message.description}
      icon={<StatusIcon icon={TriangleAlert} />}
      title={message.title}
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
