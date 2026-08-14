import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FarmProvider } from './context/FarmContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cows from './pages/Cows';
import Milk from './pages/Milk';
import Feed from './pages/Feed';
import Health from './pages/Health';
import Finance from './pages/Finance';
import Reports from './pages/Reports';

import Breeding from './pages/Breeding';
import Temperature from './pages/Temperature';
import Inventory from './pages/Inventory';
import Analytics from './pages/Analytics';
import Alerts from './pages/Alerts';

// Mock empty page for routing until Settings is implemented
const Settings = () => <div className="p-4">Farm Settings (Coming Soon)</div>;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="cows/*" element={<Cows />} />
        <Route path="milk" element={<Milk />} />
        <Route path="feed" element={<Feed />} />
        <Route path="health" element={<Health />} />
        <Route path="breeding" element={<Breeding />} />
        <Route path="temperature" element={<Temperature />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="finance" element={<Finance />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <FarmProvider>
        <Router>
          <AppRoutes />
        </Router>
      </FarmProvider>
    </AuthProvider>
  );
}

export default App;
