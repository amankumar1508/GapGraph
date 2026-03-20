"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface AppContextType {
  completedModules: Set<number>;
  toggleModule: (id: number) => void;
  overallProgress: number;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  uploadedFiles: { resume: File | null; jd: File | null };
  setUploadedFiles: (files: { resume: File | null; jd: File | null }) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [uploadedFiles, setUploadedFiles] = useState<{ resume: File | null; jd: File | null }>({ resume: null, jd: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const totalModules = 7;
  const overallProgress = Math.round((completedModules.size / totalModules) * 100);

  const toggleModule = useCallback((id: number) => {
    setCompletedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    setIsLoggedIn(false);
    setCompletedModules(new Set());
  };

  return (
    <AppContext.Provider
      value={{
        completedModules,
        toggleModule,
        overallProgress,
        selectedRole,
        setSelectedRole,
        uploadedFiles,
        setUploadedFiles,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
