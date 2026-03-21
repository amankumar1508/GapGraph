"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useApp } from "@/lib/context";
import { roleOptions } from "@/lib/data";

const loaderSteps = [
  "Parsing resume...",
  "Reading job description...",
  "Extracting skills...",
  "Calculating gaps...",
  "Building your pathway...",
];

export default function UploadPage() {
  const router = useRouter();
  const { selectedRole, setSelectedRole, uploadedFiles, setUploadedFiles, isLoggedIn } = useApp();
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [jdName, setJdName] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const jdRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];

  const validateFile = (file: File, type: "resume" | "jd"): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(`Only Resume or Job Description files are allowed (PDF, DOCX, TXT). "${file.name}" is not a valid file.`);
      setTimeout(() => setFileError(null), 5000);
      return false;
    }
    return true;
  };

  const handleFileDrop = useCallback(
    (type: "resume" | "jd") => (e: React.DragEvent) => {
      e.preventDefault();
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      const file = e.dataTransfer.files[0];
      if (file) {
        if (!validateFile(file, type)) return;
        if (type === "resume") {
          setResumeName(file.name);
          setUploadedFiles({ ...uploadedFiles, resume: file });
        } else {
          setJdName(file.name);
          setUploadedFiles({ ...uploadedFiles, jd: file });
        }
      }
    },
    [uploadedFiles, setUploadedFiles]
  );

  const handleFileSelect = useCallback(
    (type: "resume" | "jd") => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      const file = e.target.files?.[0];
      if (file) {
        if (!validateFile(file, type)) return;
        if (type === "resume") {
          setResumeName(file.name);
          setUploadedFiles({ ...uploadedFiles, resume: file });
        } else {
          setJdName(file.name);
          setUploadedFiles({ ...uploadedFiles, jd: file });
        }
      }
    },
    [uploadedFiles, setUploadedFiles]
  );

  const { analysisResult, setAnalysisResult } = useApp();

  const handleAnalyze = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Validate: need at least a resume OR JD text
    if (!uploadedFiles.resume && !jdText.trim()) {
      setFileError("Please upload a resume (PDF/DOCX) or paste a job description / skills you want to learn before analyzing.");
      setTimeout(() => setFileError(null), 5000);
      return;
    }

    setIsLoading(true);
    setLoaderStep(0);

    const interval = setInterval(() => {
      setLoaderStep((prev) => (prev < loaderSteps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      const formData = new FormData();
      if (uploadedFiles.resume) formData.append("resume", uploadedFiles.resume);
      if (jdText) formData.append("jdText", jdText);

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Analysis failed" }));
        throw new Error(errData.error || errData.message || "Analysis failed");
      }
      
      const result = await res.json();
      console.log("Analysis Result:", result);
      setAnalysisResult(result);

      clearInterval(interval);
      setLoaderStep(loaderSteps.length);

      // Brief delay to show final animation step, then redirect to Gap Analysis
      setTimeout(() => {
        setIsLoading(false);
        router.push("/dashboard");
      }, 1200);
    } catch (error: any) {
      console.error(error);
      clearInterval(interval);
      setIsLoading(false);
      setFileError(error.message || "Failed to analyze profile. Please try again.");
      setTimeout(() => setFileError(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* File Error Banner */}
      {fileError && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-lg animate-in fade-in">
          <span className="material-symbols-outlined">error</span>
          <span className="text-sm font-medium">{fileError}</span>
          <button onClick={() => setFileError(null)} className="ml-auto">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Loader Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[200] bg-surface/95 backdrop-blur-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-end gap-[3px] mb-4">
              <div className="w-2 h-4 bg-primary-container rounded-t-sm animate-pulse" />
              <div className="w-2 h-6 bg-secondary rounded-t-sm animate-pulse delay-75" />
              <div className="w-2 h-5 bg-emerald-400 rounded-t-sm animate-pulse delay-150" />
              <div className="w-2 h-7 bg-primary-container rounded-t-sm animate-pulse delay-200" />
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Analyzing Your Profile</h2>
            <div className="space-y-3 w-80">
              {loaderSteps.map((step, i) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    i <= loaderStep ? "opacity-100" : "opacity-20"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-lg ${
                      i < loaderStep
                        ? "text-success"
                        : i === loaderStep
                        ? "text-secondary animate-pulse"
                        : "text-on-surface-variant"
                    }`}
                    style={i < loaderStep ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {i < loaderStep ? "check_circle" : i === loaderStep ? "pending" : "radio_button_unchecked"}
                  </span>
                  <span className="text-sm text-on-surface font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-[1440px] mx-auto px-6 py-12 md:py-20 grid grid-cols-1 ${analysisResult ? 'lg:grid-cols-12' : 'lg:grid-cols-8 justify-center'} gap-8 transition-all duration-700`}>
        {/* Main Content */}
        <div className={`${analysisResult ? 'lg:col-span-8' : 'lg:col-span-8 w-full max-w-4xl mx-auto'} space-y-12 transition-all duration-700`}>
          {/* Hero */}
          <header className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-container tracking-tight leading-none">
              Discover Skill Gaps.
              <br />
              <span className="text-on-surface">Build Your Roadmap.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-2xl font-light">
              Upload your profile and target role to generate a high-precision career trajectory powered by GapGraph AI.
            </p>
          </header>

          {/* Input Section */}
          <section className="space-y-8">
            {/* Drop Zones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resume Upload */}
              <div
                className="group relative flex flex-col items-center justify-center h-64 bg-[#111827] border-2 border-dashed border-primary-container/40 rounded-xl hover:border-secondary transition-all cursor-pointer overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop("resume")}
                onClick={() => resumeRef.current?.click()}
              >
                <div className="absolute inset-0 faint-grid opacity-10" />
                <input
                  ref={resumeRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={handleFileSelect("resume")}
                />
                {resumeName ? (
                  <>
                    <span className="material-symbols-outlined text-success mb-3 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <p className="text-success font-semibold text-sm">{resumeName}</p>
                    <p className="text-on-surface-variant text-xs mt-1">File uploaded</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary mb-3 text-4xl">cloud_upload</span>
                    <p className="text-on-surface font-semibold">Resume / CV</p>
                    <p className="text-on-surface-variant text-xs mt-1">Drag and drop PDF or DOCX</p>
                  </>
                )}
              </div>

              {/* JD Upload */}
              <div
                className="group relative flex flex-col items-center justify-center h-64 bg-[#111827] border-2 border-dashed border-primary-container/40 rounded-xl hover:border-secondary transition-all cursor-pointer overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop("jd")}
                onClick={() => jdRef.current?.click()}
              >
                <div className="absolute inset-0 faint-grid opacity-10" />
                <input
                  ref={jdRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileSelect("jd")}
                />
                {jdName ? (
                  <>
                    <span className="material-symbols-outlined text-success mb-3 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <p className="text-success font-semibold text-sm">{jdName}</p>
                    <p className="text-on-surface-variant text-xs mt-1">File uploaded</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary mb-3 text-4xl">description</span>
                    <p className="text-on-surface font-semibold">Job Description</p>
                    <p className="text-on-surface-variant text-xs mt-1">Paste text or upload file</p>
                  </>
                )}
              </div>
            </div>

            {/* JD Paste textarea */}
            <div className="space-y-2">
              <label className="text-on-surface-variant text-sm font-medium">Or paste job description below:</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description text here or type the skills you want to learn (e.g., frontend development, React, Python)..."
                className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant/30 focus:ring-0 focus:border-primary-container text-on-surface py-4 px-4 rounded-t-xl transition-all h-32 resize-none placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Role Selector Chips */}
            <div className="space-y-3">
              <label className="text-primary-container font-bold text-sm uppercase tracking-widest ml-1">
                Target Role
              </label>
              <div className="flex flex-wrap gap-3">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedRole === role
                        ? "bg-primary-container text-on-primary-container shadow-lg shadow-primary-container/30"
                        : "bg-surface-container text-on-surface-variant border border-outline-variant/30 hover:border-primary-container/50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Self-Assessment Sliders */}
            <div className="bg-surface-container-low p-8 rounded-xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-9xl">analytics</span>
              </div>
              <h3 className="text-violet-400 font-bold text-xl mb-6">Self-Assessment Baseline</h3>
              <div className="space-y-8">
                {["Systems Design", "Algorithmic Efficiency", "Cloud Architecture", "Concurrency Control", "Data Modeling"].map(
                  (skill) => (
                    <SliderItem key={skill} label={skill} />
                  )
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-semibold text-sm"
              >
                View demo results →
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="pulse-gradient px-12 py-5 rounded-xl text-on-primary-container font-extrabold text-xl shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Profile
                <span className="material-symbols-outlined">analytics</span>
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar - Extracted Data */}
        {analysisResult && (
          <motion.aside 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-surface-container p-6 rounded-xl relative overflow-hidden shadow-xl border border-primary-container/20">
              <div className="absolute inset-0 faint-grid opacity-5" />
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-secondary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">document_scanner</span>
                  Extraction Complete
                </h4>
                <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-success text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>

              {/* Experience */}
              {analysisResult.extractedSkills.resume.experience?.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Experience Found</h5>
                  <div className="space-y-3">
                    {analysisResult.extractedSkills.resume.experience.map((exp: any, i: number) => (
                      <div key={i} className="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary-container">
                        <p className="text-sm font-bold text-on-surface">{exp.role}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-on-surface-variant">{exp.company}</p>
                          <p className="text-xs text-secondary font-medium">{exp.years} years</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {analysisResult.extractedSkills.resume.projects?.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Key Projects</h5>
                  <div className="space-y-3">
                    {analysisResult.extractedSkills.resume.projects.map((proj: any, i: number) => (
                      <div key={i} className="bg-surface-container-low p-3 rounded-lg border-l-2 border-tertiary">
                        <p className="text-sm font-bold text-on-surface">{proj.name}</p>
                        <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Skills */}
              {analysisResult.extractedSkills.resume.technical?.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Top Skills Detected</h5>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.extractedSkills.resume.technical.slice(0, 8).map((skill: any, i: number) => (
                      <span key={i} className="px-2 py-1 bg-primary-container/10 text-primary-fixed-dim rounded text-xs font-medium border border-primary-container/20">
                        {skill.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => router.push("/dashboard")}
                className="w-full mt-6 pulse-gradient py-3.5 rounded-lg text-on-primary-container text-sm font-extrabold shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2"
              >
                Proceed to Dashboard
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </motion.aside>
        )}
      </div>
    </motion.div>
  );
}

function SliderItem({ label }: { label: string }) {
  const [value, setValue] = useState(50);
  const levels = ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
  const levelIndex = Math.min(Math.floor(value / 20), 4);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-on-surface font-medium">{label}</span>
        <span className="text-secondary font-bold text-sm">{levels[levelIndex]}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(+e.target.value)}
        className="w-full h-1.5 bg-surface-variant rounded-lg appearance-none cursor-pointer custom-slider"
        style={{ background: `linear-gradient(to right, #7c3aed ${value}%, #2f3445 ${value}%)` }}
      />
    </div>
  );
}
