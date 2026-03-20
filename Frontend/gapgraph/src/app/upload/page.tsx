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
  const { selectedRole, setSelectedRole, uploadedFiles, setUploadedFiles } = useApp();
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [jdName, setJdName] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const resumeRef = useRef<HTMLInputElement>(null);
  const jdRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = useCallback(
    (type: "resume" | "jd") => (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
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
      const file = e.target.files?.[0];
      if (file) {
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

  const handleAnalyze = () => {
    setIsLoading(true);
    setLoaderStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= loaderSteps.length) {
        clearInterval(interval);
        setTimeout(() => router.push("/dashboard"), 500);
      } else {
        setLoaderStep(step);
      }
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
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

      <div className="max-w-[1440px] mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
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
                placeholder="Paste the job description text here..."
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
                className="pulse-gradient px-12 py-5 rounded-xl text-on-primary-container font-extrabold text-xl shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:scale-[1.02] transition-all flex items-center gap-3"
              >
                Analyze Profile
                <span className="material-symbols-outlined">analytics</span>
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Recent Comparisons */}
          <div className="bg-surface-container p-6 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 faint-grid opacity-5" />
            <h4 className="text-violet-400 font-bold text-sm uppercase tracking-widest mb-6">
              Recent Comparisons
            </h4>
            <div className="space-y-4">
              {[
                { name: "Google L5", match: "72%", time: "2 days ago", color: "text-secondary" },
                { name: "Meta Senior E4", match: "64%", time: "5 days ago", color: "text-secondary" },
                { name: "Amazon SDE III", match: "58%", time: "1 week ago", color: "text-on-surface" },
              ].map((item, i) => (
                <div
                  key={item.name}
                  className={`bg-surface-container-low p-4 rounded-lg flex items-center justify-between hover:bg-surface-container-high transition-all group ${
                    i === 2 ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-fixed-dim text-sm">apartment</span>
                    </div>
                    <div>
                      <p className="text-on-surface font-bold text-sm">{item.name}</p>
                      <p className="text-on-surface-variant text-xs">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`${item.color} font-bold`}>{item.match}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">Match</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-lg border border-outline-variant/30 text-on-surface-variant text-sm font-semibold hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
              View Full History
              <span className="material-symbols-outlined text-sm">history</span>
            </button>
          </div>

          {/* Pro Tip */}
          <div className="bg-gradient-to-br from-primary-container/20 to-secondary/10 p-6 rounded-xl border border-primary-container/20">
            <span className="material-symbols-outlined text-secondary mb-2">lightbulb</span>
            <h5 className="text-on-surface font-bold mb-2">Pro Tip: Granular Precision</h5>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Our AI parses technical keywords 3x better when you upload original PDF formats instead of scanned images.
            </p>
          </div>
        </aside>
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
