"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { modules } from "@/lib/data";
import { useApp } from "@/lib/context";
import { useToast } from "@/components/Toast";

const typeIcons: Record<string, string> = {
  video: "play_circle",
  docs: "description",
  course: "school",
};

const typeColors: Record<string, string> = {
  video: "text-red-400",
  docs: "text-primary-fixed-dim",
  course: "text-secondary",
};

const typeLabels: Record<string, string> = {
  video: "Video Deep Dive",
  docs: "Documentation",
  course: "Full Course",
};

const priorityStyles: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-red-500/10", text: "text-red-400", label: "Critical" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Medium" },
  low: { bg: "bg-emerald-400/10", text: "text-emerald-400", label: "Optional" },
};

export default function ModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = Number(params.id);
  const mod = modules.find((m) => m.id === moduleId);
  const { completedModules, toggleModule } = useApp();
  const { showToast } = useToast();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!mod) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-32 text-center">
        <h1 className="text-3xl font-bold text-on-surface">Module not found</h1>
        <button onClick={() => router.push("/roadmap")} className="mt-6 text-primary hover:underline">
          ← Back to Roadmap
        </button>
      </div>
    );
  }

  const isDone = completedModules.has(mod.id);
  const p = priorityStyles[mod.priority];

  const handleQuizAnswer = (index: number) => {
    if (quizSubmitted) return;
    setSelectedAnswer(index);
    setQuizSubmitted(true);
  };

  const handleMarkComplete = () => {
    if (!isDone) {
      toggleModule(mod.id);
      showToast(`"${mod.title}" marked as complete!`);
    }
    setTimeout(() => router.push("/roadmap"), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 faint-grid">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-end gap-1">
                <div className="w-1.5 h-4 bg-primary-container rounded-full" />
                <div className="w-1.5 h-6 bg-secondary rounded-full" />
                <div className="w-1.5 h-3 bg-success rounded-full" />
                <div className="w-1.5 h-5 bg-tertiary rounded-full" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-secondary uppercase">{mod.category}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary-container tracking-tight leading-tight mb-6">
              {mod.title.split(" ").slice(0, 2).join(" ")}
              <br />
              <span className="text-on-background">{mod.title.split(" ").slice(2).join(" ") || "Deep Dive"}</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed">{mod.description}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border-l-4 border-primary-container">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary-fixed-dim p-2 bg-surface-container rounded-lg">schedule</span>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">EST. HOURS</p>
                <p className="text-xl font-bold text-on-surface font-mono">{mod.hours} hrs</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border-l-4 border-secondary">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-secondary p-2 bg-surface-container rounded-lg">speed</span>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">PRIORITY</p>
                <p className={`text-xl font-bold ${p.text}`}>{p.label}</p>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl shadow-sm border-l-4 border-tertiary">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-tertiary p-2 bg-surface-container rounded-lg">folder_open</span>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">RESOURCES</p>
                <p className="text-xl font-bold text-on-surface font-mono">{mod.resources.length} Items</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Curated Materials */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-primary-container mb-8 flex items-center gap-3">
          <span className="w-8 h-[2px] bg-primary-container" />
          Curated Learning Materials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mod.resources.map((resource, i) => (
            <motion.a
              key={resource.title}
              href={resource.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface-container rounded-xl p-6 flex flex-col justify-between hover:translate-y-[-4px] transition-all duration-300 group cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`material-symbols-outlined text-3xl ${typeColors[resource.type]}`}
                    style={resource.type === "video" ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {typeIcons[resource.type]}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">{resource.duration}</span>
                </div>
                <p className={`text-[10px] font-bold ${typeColors[resource.type]} tracking-widest uppercase mb-2`}>
                  {typeLabels[resource.type]}
                </p>
                <h3 className="text-lg font-bold text-on-surface mb-2">{resource.title}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{resource.source}</p>
              </div>
              <button className="text-primary-fixed-dim text-sm font-bold flex items-center gap-2 group/btn">
                {resource.type === "video" ? "Watch" : "Open"} Resource
                <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Knowledge Check Quiz */}
      <section className="max-w-4xl mx-auto px-6 py-12 mb-12">
        <div className="bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-on-surface">Knowledge Check</h2>
            <div className="text-right">
              <p className="text-xs text-on-surface-variant font-bold tracking-widest uppercase mb-1">
                Quiz: {quizSubmitted ? (selectedAnswer === mod.quiz.correct ? "Correct!" : "Incorrect") : "Pending"}
              </p>
              <div className="w-48 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className={`h-full ${quizSubmitted ? "bg-secondary" : "bg-primary-container/30"} shadow-[0_0_8px_#5de6ff] transition-all`}
                  style={{ width: quizSubmitted ? "100%" : "0%" }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 flex items-center justify-center bg-primary-container text-on-primary-container text-xs font-bold rounded">
                Q
              </span>
              <p className="text-on-surface font-medium">{mod.quiz.question}</p>
            </div>
            <div className="ml-9 space-y-3">
              {mod.quiz.options.map((option, oi) => {
                let style = "bg-surface-container hover:bg-surface-container-high cursor-pointer";
                let icon = "";
                if (quizSubmitted) {
                  if (oi === mod.quiz.correct) {
                    style = "bg-secondary/10 border border-secondary/30";
                    icon = "check_circle";
                  } else if (oi === selectedAnswer && oi !== mod.quiz.correct) {
                    style = "bg-red-500/10 border border-red-500/30";
                    icon = "cancel";
                  } else {
                    style = "bg-surface-container opacity-50";
                  }
                }
                return (
                  <button
                    key={oi}
                    onClick={() => handleQuizAnswer(oi)}
                    className={`w-full p-3 rounded-lg flex items-center justify-between text-left transition-all ${style}`}
                    disabled={quizSubmitted}
                  >
                    <span className={`text-sm font-medium ${
                      quizSubmitted && oi === mod.quiz.correct ? "text-secondary" :
                      quizSubmitted && oi === selectedAnswer ? "text-red-400" : "text-on-surface"
                    }`}>
                      {option}
                    </span>
                    {quizSubmitted && icon && (
                      <span
                        className={`material-symbols-outlined ${oi === mod.quiz.correct ? "text-secondary" : "text-red-400"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {icon}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {quizSubmitted && selectedAnswer !== mod.quiz.correct && (
              <p className="ml-9 text-xs text-on-error-container bg-error-container/20 p-3 rounded-lg italic mt-2">
                The correct answer is: &quot;{mod.quiz.options[mod.quiz.correct]}&quot;
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-6 text-on-surface-variant">
        {mod.id > 1 ? (
          <button onClick={() => router.push(`/module/${mod.id - 1}`)} className="flex items-center gap-2 hover:text-primary transition-colors group">
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-sm font-bold uppercase tracking-wider">Previous: {modules.find(m => m.id === mod.id - 1)?.title || "Module"}</span>
          </button>
        ) : <div />}
        {mod.id < modules.length ? (
          <button onClick={() => router.push(`/module/${mod.id + 1}`)} className="flex items-center gap-2 hover:text-primary transition-colors group">
            <span className="text-sm font-bold uppercase tracking-wider">Next: {modules.find(m => m.id === mod.id + 1)?.title || "Module"}</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        ) : <div />}
      </div>

      {/* Floating Footer Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-2xl">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 flex gap-4 items-center shadow-[0_-4px_24px_rgba(0,0,0,0.4)] border border-slate-800/50">
          <button
            onClick={() => router.push("/roadmap")}
            className="flex-1 px-6 py-3 bg-slate-800 text-slate-200 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">undo</span>
            Back to Roadmap
          </button>
          <button
            onClick={handleMarkComplete}
            className={`flex-[1.5] px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isDone
                ? "bg-success/20 text-success border border-success/30"
                : "pulse-gradient text-white hover:brightness-110 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            }`}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isDone ? "check_circle" : "task_alt"}
            </span>
            {isDone ? "Completed ✓" : "Mark as Complete"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
