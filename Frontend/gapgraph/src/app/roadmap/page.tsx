"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { modules as staticModules } from "@/lib/data";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/Toast";

const priorityColors: Record<string, { bg: string; text: string; label: string; border: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", label: "Critical", border: "border-red-400" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Medium", border: "border-amber-400" },
  low: { bg: "bg-emerald-400/10", text: "text-emerald-400", label: "Optional", border: "border-emerald-400" },
};

const diffColors: Record<string, typeof priorityColors["critical"]> = {
  beginner: priorityColors.low,
  intermediate: priorityColors.medium,
  advanced: priorityColors.critical,
};

const phaseBorders = ["border-[#FBBF24]", "border-primary-container", "border-secondary"];

export default function RoadmapPage() {
  const router = useRouter();
  const { completedModules, overallProgress, toggleModule, analysisResult } = useApp();
  const { showToast } = useToast();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Prefer dynamic modules from backend if analysis has run, else fallback to static demo
  const isDynamic = !!analysisResult;
  let rawModules = analysisResult?.learningPath?.nodes || staticModules;
  
  // Assign fake IDs and phases if using dynamic data
  const modules = isDynamic ? rawModules.map((m: any, i: number) => ({
    ...m,
    id: i + 1,
    phase: i < 2 ? 1 : i < 4 ? 2 : 3,
    hours: m.durationHours || 10,
    priority: m.difficulty === "beginner" ? "low" : m.difficulty === "intermediate" ? "medium" : "critical",
    category: m.skillsCovered[0] || "Foundations",
    resources: m.resources || []
  })) : rawModules;

  const phases = [
    { num: 1, title: "Phase 1: Critical Foundations", subtitle: isDynamic ? "Fundamentals" : "Week 1-2" },
    { num: 2, title: "Phase 2: Core Engineering", subtitle: isDynamic ? "Intermediate Methods" : "Week 3-4" },
    { num: 3, title: "Phase 3: Advanced Topics", subtitle: isDynamic ? "Specialization" : "Month 2" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 pt-12 pb-32"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-primary-container tracking-tight mb-2">
            {isDynamic ? "Your AI-Generated Roadmap" : "Demo Learning Roadmap"}
          </h1>
          <p className="text-on-surface-variant text-sm max-w-md">
            {isDynamic 
              ? `Personalized pathway based on ${analysisResult.skillGaps.length} identified skill gaps from your profile.`
              : "Precision engineering path calibrated for Infrastructure Scalability and Cloud Native compliance."}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-primary font-semibold hover:bg-primary/10 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Back
          </button>
          <button
            onClick={() => showToast("Regenerating your pathway...")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant font-semibold hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-sm">refresh</span> Regenerate
          </button>
          <button
            onClick={() => showToast("Roadmap exported as PDF!")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-container text-on-primary-container font-bold shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Export PDF
          </button>
        </div>
      </div>

      {/* High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
        {/* Overall Progress */}
        <div className="md:col-span-4 bg-surface-container rounded-xl p-6 faint-grid relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-on-surface-variant uppercase text-[10px] font-bold tracking-[0.2em]">Overall Progress</h3>
            <span className="text-2xl font-black text-secondary font-mono">{overallProgress}%</span>
          </div>
          <div className="w-full h-3 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/10">
            <motion.div
              className="h-full pulse-gradient shadow-[0_0_12px_rgba(124,58,237,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="mt-4 text-xs text-on-surface-variant/70 italic">
            {completedModules.size} of {modules.length} milestones achieved
          </p>
        </div>

        {/* Readiness Gauge */}
        <div className="md:col-span-3 bg-surface-container-low rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 flex items-center justify-center mb-2">
            <svg className="absolute inset-0 w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r="50" fill="transparent" stroke="#25293A" strokeWidth="8" />
              <circle
                cx="56" cy="56" r="50" fill="transparent" stroke="#7c3aed" strokeWidth="8"
                strokeDasharray="314"
                strokeDashoffset={314 - (314 * (74 + overallProgress * 0.26)) / 100}
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-primary font-mono">{Math.round(74 + overallProgress * 0.26)}%</span>
              <span className="text-[8px] uppercase tracking-tighter text-on-surface-variant">Readiness</span>
            </div>
          </div>
          <p className="text-[10px] text-on-surface-variant font-medium">Enterprise Benchmarked</p>
        </div>

        {/* Training Hours Chart */}
        <div className="md:col-span-5 bg-surface-container rounded-xl p-6 faint-grid">
          <h3 className="text-on-surface-variant uppercase text-[10px] font-bold tracking-[0.2em] mb-6">Training Hours per Module</h3>
          <div className="flex items-end justify-between h-24 gap-3 px-2">
            {[
              { label: "Foundations", height: "60%", color: "#F472B6" },
              { label: "Practices", height: "85%", color: "#FBBF24" },
              { label: "Specialization", height: "45%", color: "#A78BFA" },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center flex-1 gap-2">
                <div
                  className="w-full rounded-t-lg"
                  style={{ height: bar.height, background: bar.color, boxShadow: `0 0 15px ${bar.color}40` }}
                />
                <span className="text-[8px] text-on-surface-variant truncate w-full text-center">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded YouTube Player */}
      <AnimatePresence mode="wait">
        {activeVideoId && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12"
          >
            <div className="bg-[#000] rounded-2xl overflow-hidden shadow-2xl relative pt-[56.25%] border border-surface-container-highest">
              <div className="absolute top-0 right-0 z-10 p-4">
                <button 
                  onClick={() => setActiveVideoId(null)}
                  className="w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors border border-white/10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <iframe 
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0`} 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Roadmap Phases */}
      <div className="space-y-16">
        {phases.map((phase, pi) => {
          const phaseModules = modules.filter((m: any) => m.phase === phase.num);
          if (phaseModules.length === 0) return null;
          
          return (
            <section key={phase.num}>
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-primary/20" />
                <h2 className="text-xl font-bold text-primary flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm border border-primary/20">
                    {String(phase.num).padStart(2, "0")}
                  </span>
                  {phase.title}
                  <span className="text-on-surface-variant text-xs font-normal ml-2">({phase.subtitle})</span>
                </h2>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-primary/20" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {phaseModules.map((mod: any, mi: number) => {
                  const isDone = completedModules.has(mod.id);
                  const p = priorityColors[mod.priority] || diffColors[mod.difficulty] || priorityColors.medium;
                  
                  return (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mi * 0.1 }}
                      className={`bg-surface-container rounded-xl p-5 border-l-4 ${phaseBorders[pi] || "border-primary"} flex flex-col justify-between group hover:bg-surface-container-high transition-all`}
                    >
                      <div>
                        {/* Status Bar */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-10 h-10 bg-primary-container/30 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary-fixed-dim text-sm">
                              {mod.category === "DevOps" ? "cloud" : mod.category === "Architecture" ? "architecture" : mod.category === "Backend" ? "dns" : "code"}
                            </span>
                          </div>
                          {/* Checkbox */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleModule(mod.id); }}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isDone
                                ? "border-success bg-emerald-500/20"
                                : "border-outline-variant hover:border-primary-container"
                            }`}
                          >
                            {isDone && (
                              <span className="material-symbols-outlined text-[14px] text-emerald-400 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check
                              </span>
                            )}
                          </button>
                        </div>
                        
                        <h4
                          className={`font-bold text-on-surface mb-1 cursor-pointer hover:text-primary-fixed-dim transition-colors ${isDone ? "line-through opacity-60" : ""}`}
                          onClick={() => router.push(`/module/${mod.id}`)}
                        >
                          {mod.title}
                        </h4>
                        
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-[10px] text-on-surface-variant font-mono">{mod.hours} Hours</span>
                          <span className={`${p.bg} ${p.text} text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider`}>
                            {p.label}
                          </span>
                        </div>
                      </div>
                      
                      {/* Curated YouTube Resources */}
                      <div className="space-y-2">
                        {mod.resources && mod.resources.slice(0, 2).map((r: any) => {
                          const vId = r.videoId || (r.url && r.url.includes("youtube.com") ? new URL(r.url).searchParams.get("v") : null);
                          return (
                            <button
                              key={r.title}
                              onClick={() => {
                                if (vId && vId !== "dQw4w9WgXcQ") {
                                  setActiveVideoId(vId);
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                } else {
                                  router.push(`/module/${mod.id}`);
                                }
                              }}
                              className={`w-full py-2 bg-surface-container-lowest hover:bg-surface-container-highest rounded-lg text-[10px] font-medium transition-colors text-left px-3 flex items-center justify-between group/res ${activeVideoId === vId ? 'ring-1 ring-red-500' : ''}`}
                            >
                              <span className="truncate pr-2">{r.title}</span>
                              <span className="material-symbols-outlined text-[12px] text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>smart_display</span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-20 flex items-center justify-between border-t border-outline-variant/10 pt-8">
        <button onClick={() => router.push("/dashboard")} className="flex flex-col items-start group">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Previous Screen</span>
          <div className="flex items-center gap-2 text-primary font-bold">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">chevron_left</span>
            Gap Analysis
          </div>
        </button>
        <button onClick={() => router.push("/module/1")} className="flex flex-col items-end group">
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 text-right">Next Screen</span>
          <div className="flex items-center gap-2 text-primary font-bold">
            Module Detail
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}
