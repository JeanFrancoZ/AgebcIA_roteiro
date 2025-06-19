import { Switch, Route } from "wouter";
import React, { FC } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route as ReactRouterRoute } from "react-router-dom";

import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import { FinalScriptPage } from "@/pages/final-script-page";


const AppRoutes: FC = () => {
  return (
    <Routes>
      <ReactRouterRoute path="/" element={<Home />} />
      <ReactRouterRoute path="/final-script" element={<FinalScriptPage />} />
      <ReactRouterRoute path="*" element={<NotFound />} />
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
