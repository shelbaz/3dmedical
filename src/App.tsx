import { Routes, Route, Navigate } from "react-router-dom";
import { authClient } from "./lib/auth-client";
import { Scene } from "./components/canvas/Scene";
import { LayerPanel } from "./components/ui/LayerPanel";
import { DetailPanel } from "./components/ui/DetailPanel";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { useAppStore } from "./store/useAppStore";

function Viewer() {
  const detailPanelOpen = useAppStore((s) => s.detailPanelOpen);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <LayerPanel />
      <div className="flex-1 relative">
        <Scene />
        <div className="absolute top-4 left-4 text-xs text-[var(--text-secondary)]">
          Click + drag to rotate | Scroll to zoom | Right-click to pan
        </div>
      </div>
      {detailPanelOpen && <DetailPanel />}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Viewer />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
