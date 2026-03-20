export default function Footer() {
  return (
    <footer className="bg-slate-950 w-full py-8 border-t border-slate-800/30 flex flex-col items-center gap-4 px-8 mt-20 mb-24 md:mb-0">
      <div className="flex gap-8">
        <a className="text-slate-500 hover:text-cyan-300 transition-colors text-xs" href="#">YouTube</a>
        <a className="text-slate-500 hover:text-cyan-300 transition-colors text-xs" href="#">freeCodeCamp</a>
        <a className="text-slate-500 hover:text-cyan-300 transition-colors text-xs" href="#">MIT</a>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-cyan-400 font-semibold text-sm">GapGraph AI</span>
        <span className="text-xs text-slate-500">© 2025 Precision in Growth.</span>
      </div>
    </footer>
  );
}
