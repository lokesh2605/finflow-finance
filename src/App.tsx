import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

// React Query client (handles API caching, fetching, etc.)
const queryClient = new QueryClient();

const App = () => {
  // Theme state (restricted to only 3 valid values)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  // Load saved theme from localStorage (runs once on mount)
  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | "system"
      | null;

    if (saved) setTheme(saved);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (selected: "light" | "dark" | "system") => {
      if (selected === "dark") {
        // Force dark mode
        root.classList.add("dark");
      } else if (selected === "light") {
        // Force light mode
        root.classList.remove("dark");
      } else {
        // System mode → follow OS preference
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", isDark);
      }
    };

    applyTheme(theme);

    // Save user preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    // Provides React Query to entire app
    <QueryClientProvider client={queryClient}>
      {/* Enables tooltip functionality across app */}
      <TooltipProvider>
        {/* Toast notifications */}
        <Toaster />
        <Sonner />

        {/* Routing setup */}
        <BrowserRouter>
          <Routes>
            {/* Pass theme setter to main page */}
            <Route path="/" element={<Index setTheme={setTheme} />} />

            {/* Catch-all route (404 page) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;