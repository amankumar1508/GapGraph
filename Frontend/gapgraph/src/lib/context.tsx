"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

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
  analysisResult: any;
  setAnalysisResult: (result: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [selectedRole, setSelectedRole] = useState("Software Engineer");
  const [uploadedFiles, setUploadedFiles] = useState<{ resume: File | null; jd: File | null }>({ resume: null, jd: null });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedLogin = localStorage.getItem("gg_isLoggedIn");
      if (storedLogin) setIsLoggedIn(JSON.parse(storedLogin));

      const storedAnalysis = localStorage.getItem("gg_analysisResult");
      if (storedAnalysis) setAnalysisResult(JSON.parse(storedAnalysis));

      const storedModules = localStorage.getItem("gg_completedModules");
      if (storedModules) setCompletedModules(new Set(JSON.parse(storedModules)));
    } catch (e) {
      console.error("Error loading state from localStorage", e);
    }
    setIsInitialized(true);
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("gg_isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (analysisResult) {
      localStorage.setItem("gg_analysisResult", JSON.stringify(analysisResult));
    } else {
      localStorage.removeItem("gg_analysisResult");
    }
  }, [analysisResult, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("gg_completedModules", JSON.stringify(Array.from(completedModules)));
  }, [completedModules, isInitialized]);

  const totalModules = analysisResult?.learningPath?.nodes?.length || 7;
  const overallProgress = Math.round((completedModules.size / Math.max(1, totalModules)) * 100);

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
    setAnalysisResult(null);
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
        analysisResult,
        setAnalysisResult,
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
