import "./global.css";
import { createContext, useContext, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import ItemDetail from "./pages/ItemDetail";
import MyItems from "./pages/MyItems";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import RequireAuth from "./pages/RequireAuth";
// Simple Auth Context for demo
export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

const queryClient = new QueryClient();

function AuthProvider({ children }) {
  // For demo: use local state. Replace with real auth logic as needed.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<Search />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route
              path="/my-items"
              element={
                <RequireAuth>
                  <MyItems />
                </RequireAuth>
              }
            />
            <Route
              path="/report-lost"
              element={
                <RequireAuth>
                  <ReportLost />
                </RequireAuth>
              }
            />
            <Route
              path="/report-found"
              element={
                <RequireAuth>
                  <ReportFound />
                </RequireAuth>
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
