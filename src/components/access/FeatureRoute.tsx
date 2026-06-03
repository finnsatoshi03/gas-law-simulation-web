import { ReactNode } from "react";

import { FeatureLockedPage } from "@/components/access/LockedAccessPages";
import { AuthLoading } from "@/components/auth/AuthLoading";
import { useAccessControl } from "@/contexts/AccessControlContext";
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

  if (isLoading) {
    return <AuthLoading message="Checking access..." />;
  }

  if (isFeatureLocked(featureKey) && !canAccessFeature(featureKey)) {
    return <FeatureLockedPage message={getFeatureLockMessage(featureKey)} />;
  }

  return <>{children}</>;
};
