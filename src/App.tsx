
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import PortalLayout from "@/components/layout/PortalLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LoadingProvider } from "@/contexts/LoadingContext";

// Public pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ScanQR from "./pages/ScanQR";
import PublicPet from "./pages/PublicPet";
import NotFound from "./pages/NotFound";

// Portal pages
import Dashboard from "./pages/portal/Dashboard";
import PetList from "./pages/portal/PetList";
import PetDetail from "./pages/portal/PetDetail";
import PetQR from "./pages/portal/PetQR";
import EditPet from "./pages/portal/EditPet";
import AddPet from "./pages/portal/AddPet";
import AddMedicalEvent from "./pages/portal/AddMedicalEvent";
import Account from "./pages/portal/Account";
import SignIn from "./pages/SignIn";
import Profile from "./pages/portal/Profile";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner closeButton richColors />
          <BrowserRouter>
            <LoadingProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Landing />} />
                  <Route path="signin" element={<SignIn />} />
                  <Route path="register" element={<Register />} />
                  <Route path="login" element={<Login />} />
                  <Route path="scan" element={<ScanQR />} />
                  <Route path="pet/:id" element={<PublicPet />} />
                </Route>
                
                {/* Portal Routes - Protected */}
                <Route path="/portal" element={
                  <ProtectedRoute>
                    <PortalLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="pets" element={<PetList />} />
                  <Route path="pets/:id" element={<PetDetail />} />
                  <Route path="pets/:id/edit" element={<EditPet />} />
                  <Route path="pets/:id/qr" element={<PetQR />} />
                  <Route path="pets/:id/add-event" element={<AddMedicalEvent />} />
                  <Route path="add-pet" element={<AddPet />} />
                  <Route path="account" element={<Account />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LoadingProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
