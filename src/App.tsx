import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { GasLawProvider } from "./contexts/GasLawProvider";
import { WallCollisionProvider } from "./contexts/WallCollissionProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { AccessControlProvider } from "./contexts/AccessControlContext";
import { SimulationSettingsProvider } from "./contexts/SettingsProvider";
import { AccessibilityProvider } from "./contexts/AccessibilityProvider";

import { DocsLayout } from "./layout/DocsLayout";
import AppLayout from "./layout/AppLayout";

import Home from "./pages/Home";
import Boyles from "./pages/Boyles";
import Charles from "./pages/Charles";
import Lussac from "./pages/Lussac";
import Avogadros from "./pages/Avogadros";
import Combined from "./pages/Combined";
import Ideal from "./pages/Ideal";
import Settings from "./pages/Settings";
import AccessDenied from "./pages/AccessDenied";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FeatureAccessManagement from "./pages/admin/FeatureAccessManagement";
import Documentation from "./pages/docs/Documentation";
import Docs_SimulationBasics from "./pages/docs/Docs_SimulationBasics";
import Docs_ParamsAndUnits from "./pages/docs/Docs_ParamsAndUnits";
import Docs_WallDynamics from "./pages/docs/Docs_WallDynamics";
import Docs_SampleProblems from "./pages/docs/Docs_SampleProblems";
import Docs_Solution from "./pages/docs/Docs_Solution";
import Docs_Settings from "./pages/docs/Docs_Settings";
import Docs_Accessibility from "./pages/docs/Docs_Accessibility";

import { Login } from "./components/auth/Login";
import { SignUp } from "./components/auth/SignUp";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoute";
import { PasswordRecoveryRoute } from "./components/auth/PasswordRecoveryRoute";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MoleculeBackground } from "./components/MoleculeBackground";
import { AccountStatusRoute } from "./components/account/AccountStatusRoute";
import {
  PendingApprovalPage,
  ProfileErrorPage,
  RejectedAccountPage,
  SuspendedAccountPage,
} from "./components/account/AccountStatusPages";
import { ACCOUNT_STATUS } from "./lib/account-status";
import { FEATURE } from "./lib/features";
import { AdminRoute } from "./components/admin/AdminRoute";
import { FeatureRoute } from "./components/access/FeatureRoute";
import PageTransition from "./components/PageTransition";
import { WalkthroughProvider } from "./contexts/WalkthroughProvider";
import WalkthroughWrapper from "./components/WalkthroughWrapper";

const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];
const ACCOUNT_STATUS_ROUTES = [
  "/account/pending",
  "/account/suspended",
  "/account/rejected",
  "/account/profile-error",
];

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAuthRoute = [...AUTH_ROUTES, ...ACCOUNT_STATUS_ROUTES].includes(
    location.pathname
  );

  return (
    <>
      {/* Persistent across auth-page switches: rendered outside the keyed
          <Routes> so navigating login → signup → … does not remount it and the
          molecule animation stays continuous. */}
      {isAuthRoute ? (
        <MoleculeBackground className="fixed inset-0 z-0" />
      ) : null}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route index element={<Navigate replace to="home" />} />

        <Route
          path="home"
          element={
            <ProtectedRoute>
              <FeatureRoute featureKey={FEATURE.HOME}>
                <WalkthroughWrapper>
                  <PageTransition>
                    <Home />
                  </PageTransition>
                </WalkthroughWrapper>
              </FeatureRoute>
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DocsLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="docs"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Documentation />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/simulation-basics"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_SimulationBasics />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/parameters-and-units"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_ParamsAndUnits />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/wall-collision-dynamics"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_WallDynamics />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/sample-problems"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_SampleProblems />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/solution"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_Solution />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/settings"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_Settings />
              </FeatureRoute>
            }
          />
          <Route
            path="docs/accessibility"
            element={
              <FeatureRoute featureKey={FEATURE.DOCUMENTATION}>
                <Docs_Accessibility />
              </FeatureRoute>
            }
          />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="boyles"
            element={
              <FeatureRoute featureKey={FEATURE.BOYLES_LAW_SIMULATION}>
                <Boyles />
              </FeatureRoute>
            }
          />
          <Route
            path="charles"
            element={
              <FeatureRoute featureKey={FEATURE.CHARLES_LAW_SIMULATION}>
                <Charles />
              </FeatureRoute>
            }
          />
          <Route
            path="lussac"
            element={
              <FeatureRoute featureKey={FEATURE.GAY_LUSSACS_LAW_SIMULATION}>
                <Lussac />
              </FeatureRoute>
            }
          />
          <Route
            path="avogadros"
            element={
              <FeatureRoute featureKey={FEATURE.AVOGADROS_LAW_SIMULATION}>
                <Avogadros />
              </FeatureRoute>
            }
          />
          <Route
            path="combined"
            element={
              <FeatureRoute featureKey={FEATURE.COMBINED_GAS_LAW_SIMULATION}>
                <Combined />
              </FeatureRoute>
            }
          />
          <Route
            path="ideal"
            element={
              <FeatureRoute featureKey={FEATURE.IDEAL_GAS_LAW_SIMULATION}>
                <Ideal />
              </FeatureRoute>
            }
          />
          <Route
            path="settings"
            element={
              <FeatureRoute featureKey={FEATURE.SIMULATION_SETTINGS}>
                <Settings />
              </FeatureRoute>
            }
          />
          <Route path="access-denied" element={<AccessDenied />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="admin/features"
            element={
              <AdminRoute>
                <FeatureAccessManagement />
              </AdminRoute>
            }
          />
        </Route>
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicOnlyRoute>
              <SignUp />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <PasswordRecoveryRoute>
              <ResetPassword />
            </PasswordRecoveryRoute>
          }
        />
        <Route
          path="account/pending"
          element={
            <AccountStatusRoute expectedStatus={ACCOUNT_STATUS.PENDING}>
              <PendingApprovalPage />
            </AccountStatusRoute>
          }
        />
        <Route
          path="account/suspended"
          element={
            <AccountStatusRoute expectedStatus={ACCOUNT_STATUS.SUSPENDED}>
              <SuspendedAccountPage />
            </AccountStatusRoute>
          }
        />
        <Route
          path="account/rejected"
          element={
            <AccountStatusRoute expectedStatus={ACCOUNT_STATUS.REJECTED}>
              <RejectedAccountPage />
            </AccountStatusRoute>
          }
        />
        <Route
          path="account/profile-error"
          element={
            <AccountStatusRoute profileIssue>
              <ProfileErrorPage />
            </AccountStatusRoute>
          }
        />
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AccessControlProvider>
          <AccessibilityProvider>
            <WalkthroughProvider>
              <GasLawProvider>
                <WallCollisionProvider>
                  <SimulationSettingsProvider>
                    <HashRouter>
                      <AnimatedRoutes />
                    </HashRouter>
                  </SimulationSettingsProvider>
                </WallCollisionProvider>
              </GasLawProvider>
            </WalkthroughProvider>
          </AccessibilityProvider>
        </AccessControlProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
