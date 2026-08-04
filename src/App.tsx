import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Visite from "./pages/Visite/Visite";
import Clients from "./pages/Clients/Clients";
import AjoutClient from "./pages/Clients/pages/AjoutClient";
import ListeClient from "./pages/Clients/pages/ListeClient";
import MapsClient from "./pages/Clients/pages/MapsClient";
import AjoutVisite from "./pages/Visite/pages/AjoutVisite";
import ListeVisite from "./pages/Visite/pages/ListeVisite";
import VisitesPage from "./pages/Visite/pages/VisitesPage";
import ClientQrCode from "./pages/Clients/pages/QrCode";
import Dashboard from "./pages/Dashboard/Dashboard";
import { UserProvider } from "./context/UserContext";
import { useCurrentUser } from "./hooks/useCurrentUser";

function RequireAdmin({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useCurrentUser();

    if (loading) return null; // ou un loader

    if (!isAdmin) {
        return <Navigate to="/client/liste" replace />;
    }

    return <>{children}</>;
}

function ClientIndexRedirect() {
    const { isAdmin, loading } = useCurrentUser();

    if (loading) return null;

    return <Navigate to={isAdmin ? "ajout" : "liste"} replace />;
}

export default function App() {
  
  return (
    <UserProvider>
    <Router basename="/crm_admin">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="visite" replace />} />
          <Route path="client" element={<Clients />}>
            <Route index element={<ClientIndexRedirect />} />
            <Route
              path="ajout"
              element={
                <RequireAdmin>
                  <AjoutClient />
                </RequireAdmin>
              }
            />
            <Route path="liste">
              <Route index element={<ListeClient />} />
              <Route path=":id" element={<ListeClient />} />
            </Route>
            <Route path="qr-code" element={<ClientQrCode />} />
            <Route path="maps" element={<MapsClient />} />
            <Route path=":idclient/qr-code" element={<ClientQrCode />} />
          </Route>
          <Route path="visite" element={<Visite />} >
            <Route index element={<Navigate to="ajout" replace />} />
            <Route path="ajout" element={<VisitesPage  />} />
            <Route path="liste">
              <Route index element={<ListeVisite />} />
              <Route path=":id" element={<ListeVisite />} />
            </Route>
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
    </UserProvider>
  );
}