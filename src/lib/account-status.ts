export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  PENDING: "pending",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
} as const;

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export const isAccountStatus = (value: unknown): value is AccountStatus =>
  Object.values(ACCOUNT_STATUS).some((status) => status === value);

export const getAccountStatusPath = (status: AccountStatus) => {
  switch (status) {
    case ACCOUNT_STATUS.PENDING:
      return "/account/pending";
    case ACCOUNT_STATUS.SUSPENDED:
      return "/account/suspended";
    case ACCOUNT_STATUS.REJECTED:
      return "/account/rejected";
    case ACCOUNT_STATUS.ACTIVE:
      return "/home";
  }
};

