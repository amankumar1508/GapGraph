export const user = {
  name: "Arjun Mehta",
  email: "arjun.mehta@techcorp.io",
  avatar: "AM",
  targetRole: "Software Engineer",
  company: "TechCorp India",
  experience: "3 Years",
  joinDate: "March 2025",
  readinessScore: 74,
};

export const existingSkills = [
  { name: "JavaScript", level: 90, category: "Frontend" },
  { name: "React", level: 85, category: "Frontend" },
  { name: "Node.js", level: 80, category: "Backend" },
  { name: "REST APIs", level: 75, category: "Backend" },
  { name: "Git / GitHub", level: 95, category: "DevOps" },
  { name: "SQL Basics", level: 65, category: "Data" },
  { name: "Agile / Scrum", level: 70, category: "Soft Skills" },
];

export const skillGaps = [
  { name: "Docker", currentLevel: 15, requiredLevel: 85, priority: "critical" as const, category: "DevOps", hours: 6 },
  { name: "Kubernetes", currentLevel: 5, requiredLevel: 80, priority: "critical" as const, category: "DevOps", hours: 8 },
  { name: "CI/CD Pipelines", currentLevel: 20, requiredLevel: 85, priority: "critical" as const, category: "DevOps", hours: 5 },
  { name: "System Design", currentLevel: 30, requiredLevel: 80, priority: "critical" as const, category: "Architecture", hours: 10 },
  { name: "Redis", currentLevel: 25, requiredLevel: 70, priority: "medium" as const, category: "Backend", hours: 4 },
  { name: "GraphQL", currentLevel: 35, requiredLevel: 65, priority: "medium" as const, category: "Backend", hours: 3 },
  { name: "TypeScript Advanced", currentLevel: 50, requiredLevel: 80, priority: "low" as const, category: "Frontend", hours: 2 },
];

export interface ModuleResource {
  type: "video" | "docs" | "course";
  title: string;
  source: string;
  duration: string;
  url: string;
}

export interface ModuleQuiz {
  question: string;
  options: string[];
  correct: number;
}

export interface Module {
  id: number;
  title: string;
  phase: number;
  category: string;
  hours: number;
  priority: "critical" | "medium" | "low";
  status: string;
  completedAt: string | null;
  description: string;
  resources: ModuleResource[];
  quiz: ModuleQuiz;
}

export const modules: Module[] = [
  {
    id: 1, title: "Docker & Containerization", phase: 1,
    category: "DevOps", hours: 6, priority: "critical",
    status: "in_progress", completedAt: null,
    description: "Master containerization from scratch. Write Dockerfiles, build images, and run multi-container apps with Docker Compose.",
    resources: [
      { type: "video", title: "Docker in 100 Seconds", source: "YouTube · Fireship", duration: "2 min", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", videoId: "Gjnup-PuquQ" } as any,
      { type: "video", title: "Docker Tutorial for Beginners", source: "YouTube · TechWorld with Nana", duration: "2 hr", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", videoId: "3c-iBn73dDE" } as any,
      { type: "video", title: "Docker Crash Course for Absolute Beginners", source: "YouTube · TechWorld with Nana", duration: "1 hr", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", videoId: "pg19Z8LL06w" } as any,
    ],
    quiz: {
      question: "What is the primary purpose of a Docker container?",
      options: ["Package app + dependencies into an isolated environment", "Replace virtual machines entirely", "Automate code deployment only", "Monitor server performance"],
      correct: 0
    }
  },
  {
    id: 2, title: "Kubernetes Fundamentals", phase: 1,
    category: "DevOps", hours: 8, priority: "critical",
    status: "locked",
    completedAt: null,
    description: "Learn pods, deployments, services, ingress, and ConfigMaps. Deploy a real app to a local K8s cluster.",
    resources: [
      { type: "video", title: "Kubernetes in 100 Seconds", source: "YouTube · Fireship", duration: "2 min", url: "https://www.youtube.com/watch?v=PziYflu8cB8", videoId: "PziYflu8cB8" } as any,
      { type: "course", title: "Kubernetes Tutorial for Beginners", source: "YouTube · TechWorld with Nana", duration: "3.5 hr", url: "https://www.youtube.com/watch?v=X48VuDVv0do", videoId: "X48VuDVv0do" } as any,
    ],
    quiz: {
      question: "What is a Kubernetes Pod?",
      options: ["A single container", "One or more containers sharing network and storage", "A cluster of nodes", "A load balancer"],
      correct: 1
    }
  },
  {
    id: 3, title: "CI/CD with GitHub Actions", phase: 2,
    category: "DevOps", hours: 5, priority: "critical",
    status: "locked",
    completedAt: null,
    description: "Build automated pipelines for test, build, and deploy. Push to main = live in production.",
    resources: [
      { type: "video", title: "GitHub Actions Tutorial", source: "YouTube · Fireship", duration: "12 min", url: "https://www.youtube.com/watch?v=eB0nUzAI7M8", videoId: "eB0nUzAI7M8" } as any,
      { type: "course", title: "GitHub Actions Full Course", source: "YouTube · freeCodeCamp", duration: "2 hr", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", videoId: "R8_veQiYBjI" } as any,
    ],
    quiz: {
      question: "What triggers a GitHub Actions workflow?",
      options: ["Only manual clicks", "Events like push, PR open, or schedule", "Only on the main branch", "Only code review approvals"],
      correct: 1
    }
  },
  {
    id: 4, title: "System Design Principles", phase: 2,
    category: "Architecture", hours: 10, priority: "critical",
    status: "locked",
    completedAt: null,
    description: "Scalability, load balancing, caching strategies, database sharding, and CAP theorem for real interview questions.",
    resources: [
      { type: "video", title: "System Design for Beginners", source: "YouTube · Gaurav Sen", duration: "15 min", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", videoId: "xpDnVSmNFX0" } as any,
      { type: "course", title: "System Design Full Course", source: "YouTube · freeCodeCamp", duration: "1.5 hr", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4", videoId: "F2FmTdLtb_4" } as any,
    ],
    quiz: {
      question: "What does horizontal scaling mean?",
      options: ["Making one server more powerful", "Adding more servers to distribute load", "Upgrading RAM on existing machines", "Buying faster CPUs"],
      correct: 1
    }
  },
  {
    id: 5, title: "Redis & Caching Strategies", phase: 3,
    category: "Backend", hours: 4, priority: "medium",
    status: "locked",
    completedAt: null,
    description: "Cache-aside, write-through, TTL strategies. Speed up APIs by 10x using Redis in production.",
    resources: [
      { type: "video", title: "Redis in 100 Seconds", source: "YouTube · Fireship", duration: "2 min", url: "https://www.youtube.com/watch?v=G1rOthIU-uo", videoId: "G1rOthIU-uo" } as any,
      { type: "video", title: "Redis Crash Course", source: "YouTube · Traversy Media", duration: "40 min", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", videoId: "jgpVdJB2sKQ" } as any,
    ],
    quiz: {
      question: "When should you use a cache?",
      options: ["Always, for every request", "For frequently read, rarely changed data", "For write-heavy operations", "For real-time streaming data only"],
      correct: 1
    }
  },
  {
    id: 6, title: "GraphQL API Design", phase: 3,
    category: "Backend", hours: 3, priority: "medium",
    status: "locked",
    completedAt: null,
    description: "Queries, mutations, subscriptions, and schema design. Replace over-fetching REST endpoints with precise GraphQL.",
    resources: [
      { type: "video", title: "GraphQL in 100 Seconds", source: "YouTube · Fireship", duration: "2 min", url: "https://www.youtube.com/watch?v=eIQh02xuVw4", videoId: "eIQh02xuVw4" } as any,
      { type: "course", title: "GraphQL Full Course", source: "YouTube · freeCodeCamp", duration: "4 hr", url: "https://www.youtube.com/watch?v=ed8SzALpx1Q", videoId: "ed8SzALpx1Q" } as any,
    ],
    quiz: {
      question: "What problem does GraphQL primarily solve?",
      options: ["Database performance issues", "Over and under-fetching in REST APIs", "Server-side authentication", "Frontend state management"],
      correct: 1
    }
  },
  {
    id: 7, title: "Advanced TypeScript", phase: 3,
    category: "Frontend", hours: 2, priority: "low",
    status: "locked",
    completedAt: null,
    description: "Generics, utility types, strict mode, discriminated unions. Be immediately productive in any TypeScript codebase.",
    resources: [
      { type: "video", title: "TypeScript in 100 Seconds", source: "YouTube · Fireship", duration: "2 min", url: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA", videoId: "zQnBQ4tB3ZA" } as any,
      { type: "course", title: "TypeScript Full Course for Beginners", source: "YouTube · Dave Gray", duration: "8 hr", url: "https://www.youtube.com/watch?v=gieEQFIfgYc", videoId: "gieEQFIfgYc" } as any,
    ],
    quiz: {
      question: "What does a TypeScript generic enable?",
      options: ["Runtime type checking", "Reusable components with flexible type parameters", "Automatic null safety", "Faster TypeScript compilation"],
      correct: 1
    }
  },
];

export const analyticsData = {
  radarChart: {
    categories: ["Frontend", "Backend", "DevOps", "Architecture", "Data", "Soft Skills"],
    userLevels: [88, 78, 18, 32, 55, 72],
    requiredLevels: [80, 85, 80, 75, 60, 70],
  },
  skillCoverage: { matched: 14, critical: 4, partial: 4, optional: 3 },
  trainingHours: { DevOps: 19, Architecture: 10, Backend: 7, Frontend: 2 },
  weeklyProgress: [
    { week: "Week 1", hoursCompleted: 0, targetHours: 6 },
    { week: "Week 2", hoursCompleted: 0, targetHours: 8 },
    { week: "Week 3", hoursCompleted: 0, targetHours: 7 },
    { week: "Week 4", hoursCompleted: 0, targetHours: 5 },
  ],
};

export const roleOptions = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "ML Engineer",
  "UX Designer",
];
