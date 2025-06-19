import { Switch, Route } from "wouter";
import React, { FC } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { FinalScriptPage } from "@/pages/final-script-page";


const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/final-script" element={<FinalScriptPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
