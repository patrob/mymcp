
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import AddServer from "./pages/AddServer";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            } />
            <Route path="/settings" element={
              <SignedIn>
                <Settings />
              </SignedIn>
            } />
            <Route path="/add-server" element={
              <SignedIn>
                <AddServer />
              </SignedIn>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
