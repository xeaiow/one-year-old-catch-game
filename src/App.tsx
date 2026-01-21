import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CharacterSelect from "./pages/CharacterSelect";
import Classroom from "./pages/Classroom";
import OneYearOldCatch from "./pages/OneYearOldCatch";
import Bingo from "./pages/Bingo";
import Guess from "./pages/Guess";
import GuessSuccess from "./pages/GuessSuccess";
import Reveal from "./pages/Reveal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/character" element={<CharacterSelect />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/one-year-old-catch" element={<OneYearOldCatch />} />
          <Route path="/bingo" element={<Bingo />} />
          <Route path="/guess" element={<Guess />} />
          <Route path="/guess-success" element={<GuessSuccess />} />
          <Route path="/reveal" element={<Reveal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
