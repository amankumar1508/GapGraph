"use client";

import { ReactNode } from "react";
import { AppProvider } from "@/lib/context";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <ToastProvider>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </ToastProvider>
    </AppProvider>
  );
}
