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
import Documentation from "./pages/docs/Documentation";
import Docs_SimulationBasics from "./pages/docs/Docs_SimulationBasics";
import Docs_ParamsAndUnits from "./pages/docs/Docs_ParamsAndUnits";
import Docs_WallDynamics from "./pages/docs/Docs_WallDynamics";
import Docs_SampleProblems from "./pages/docs/Docs_SampleProblems";
import Docs_Solution from "./pages/docs/Docs_Solution";
import Docs_Settings from "./pages/docs/Docs_Settings";

import { Login } from "./components/auth/Login";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import PageTransition from "./components/PageTransition";
import { WalkthroughProvider } from "./contexts/WalkthroughProvider";
import WalkthroughWrapper from "./components/WalkthroughWrapper";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route index element={<Navigate replace to="home" />} />

        <Route
          path="home"
          element={
            <WalkthroughWrapper>
              <PageTransition>
                <Home />
              </PageTransition>
            </WalkthroughWrapper>
          }
        />

        <Route element={<DocsLayout />}>
          <Route path="docs" element={<Documentation />} />
          <Route
            path="docs/simulation-basics"
            element={<Docs_SimulationBasics />}
          />
          <Route
            path="docs/parameters-and-units"
            element={<Docs_ParamsAndUnits />}
          />
          <Route
            path="docs/wall-collision-dynamics"
            element={<Docs_WallDynamics />}
          />
          <Route
            path="docs/sample-problems"
            element={<Docs_SampleProblems />}
          />
          <Route path="docs/solution" element={<Docs_Solution />} />
          <Route path="docs/settings" element={<Docs_Settings />} />
        </Route>

        <Route element={<AppLayout />}>
          <Route path="boyles" element={<Boyles />} />
          <Route path="charles" element={<Charles />} />
          <Route path="lussac" element={<Lussac />} />
          <Route path="avogadros" element={<Avogadros />} />
          <Route path="combined" element={<Combined />} />
          <Route path="ideal" element={<Ideal />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
