import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/app/client-layout";

export const metadata: Metadata = {
  title: "GapGraph — AI-Powered Adaptive Learning",
  description: "Discover skill gaps, build your personalized learning roadmap, and become job-ready with GapGraph AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body text-on-surface min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
