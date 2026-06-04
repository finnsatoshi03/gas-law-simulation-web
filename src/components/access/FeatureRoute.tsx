import { ReactNode } from "react";

import { FeatureLockedPage } from "@/components/access/LockedAccessPages";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useAccessMessages } from "@/contexts/AccessMessagesContext";
import { ACCESS_MESSAGE_KEY } from "@/lib/access-messages";
import { FeatureKey } from "@/lib/features";

interface FeatureRouteProps {
  children: ReactNode;
  featureKey: FeatureKey;
}

export const FeatureRoute = ({ children, featureKey }: FeatureRouteProps) => {
  const {
    canAccessFeature,
    getFeatureLockMessage,
    isFeatureLocked,
    isLoading,
  } = useAccessControl();
  const { getAccessMessage } = useAccessMessages();
  const fallbackMessage = getAccessMessage(ACCESS_MESSAGE_KEY.FEATURE_LOCKED);

  if (isLoading) {
    return <AuthLoading message="Checking access..." />;
  }

  if (isFeatureLocked(featureKey) && !canAccessFeature(featureKey)) {
    return (
      <FeatureLockedPage
        message={getFeatureLockMessage(featureKey) || fallbackMessage.description}
        title={fallbackMessage.title}
      />
    );
  }

  return <>{children}</>;
};
