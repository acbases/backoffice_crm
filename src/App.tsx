import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Visite from "./pages/Visite/Visite";
import Clients from "./pages/Clients/Clients";
import AjoutClient from "./pages/Clients/pages/AjoutClient";
import ListeClient from "./pages/Clients/pages/ListeClient";
import MapsClient from "./pages/Clients/pages/MapsClient";
import AjoutVisite from "./pages/Visite/pages/AjoutVisite";
import ListeVisite from "./pages/Visite/pages/ListeVisite";
import ClientQrCode from "./pages/Clients/pages/QrCode";
import Dashboard from "./pages/Dashboard/Dashboard";

export default function App() {
  return (
    <Router basename="/crm_admin">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="client" replace />} />
          <Route path="client" element={<Clients />}>
            <Route index element={<Navigate to="ajout" replace />} />
            <Route path="ajout" element={<AjoutClient />} />
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
            <Route path="ajout" element={<AjoutVisite />} />
            <Route path="liste" element={<ListeVisite />} />
          </Route>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
