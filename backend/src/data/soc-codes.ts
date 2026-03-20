// O*NET SOC Code Mapping
// Maps normalized skill names to their approximate O*NET Standard Occupational Classification codes

export const SOC_CODE_MAP: Record<string, { code: string; title: string }> = {
    // Software Development
    "python": { code: "15-1252.00", title: "Software Developers" },
    "javascript": { code: "15-1252.00", title: "Software Developers" },
    "typescript": { code: "15-1252.00", title: "Software Developers" },
    "java": { code: "15-1252.00", title: "Software Developers" },
    "c++": { code: "15-1252.00", title: "Software Developers" },
    "c#": { code: "15-1252.00", title: "Software Developers" },
    "go": { code: "15-1252.00", title: "Software Developers" },
    "rust": { code: "15-1252.00", title: "Software Developers" },
    "ruby": { code: "15-1252.00", title: "Software Developers" },
    "php": { code: "15-1252.00", title: "Software Developers" },
    "swift": { code: "15-1252.00", title: "Software Developers" },
    "kotlin": { code: "15-1252.00", title: "Software Developers" },
    "programming fundamentals": { code: "15-1252.00", title: "Software Developers" },

    // Web Development
    "react": { code: "15-1254.00", title: "Web Developers" },
    "angular": { code: "15-1254.00", title: "Web Developers" },
    "vue": { code: "15-1254.00", title: "Web Developers" },
    "node.js": { code: "15-1254.00", title: "Web Developers" },
    "express": { code: "15-1254.00", title: "Web Developers" },
    "next.js": { code: "15-1254.00", title: "Web Developers" },
    "html": { code: "15-1254.00", title: "Web Developers" },
    "css": { code: "15-1254.00", title: "Web Developers" },
    "rest api": { code: "15-1254.00", title: "Web Developers" },
    "graphql": { code: "15-1254.00", title: "Web Developers" },
    "frontend development": { code: "15-1254.00", title: "Web Developers" },
    "component architecture": { code: "15-1254.00", title: "Web Developers" },
    "es6": { code: "15-1254.00", title: "Web Developers" },

    // Database
    "sql": { code: "15-1242.00", title: "Database Administrators" },
    "postgresql": { code: "15-1242.00", title: "Database Administrators" },
    "mongodb": { code: "15-1242.00", title: "Database Administrators" },
    "mysql": { code: "15-1242.00", title: "Database Administrators" },
    "redis": { code: "15-1242.00", title: "Database Administrators" },
    "database design": { code: "15-1242.00", title: "Database Administrators" },
    "database optimization": { code: "15-1242.00", title: "Database Administrators" },
    "orm": { code: "15-1242.00", title: "Database Administrators" },
    "prisma": { code: "15-1242.00", title: "Database Administrators" },

    // Data Science / ML
    "machine learning": { code: "15-2051.00", title: "Data Scientists" },
    "deep learning": { code: "15-2051.00", title: "Data Scientists" },
    "tensorflow": { code: "15-2051.00", title: "Data Scientists" },
    "pytorch": { code: "15-2051.00", title: "Data Scientists" },
    "scikit-learn": { code: "15-2051.00", title: "Data Scientists" },
    "numpy": { code: "15-2051.00", title: "Data Scientists" },
    "pandas": { code: "15-2051.00", title: "Data Scientists" },
    "neural networks": { code: "15-2051.00", title: "Data Scientists" },
    "data analysis": { code: "15-2051.00", title: "Data Scientists" },
    "nlp": { code: "15-2051.00", title: "Data Scientists" },

    // DevOps / Cloud
    "docker": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "kubernetes": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "aws": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "azure": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "gcp": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "ci/cd": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "devops": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "linux": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "cloud computing": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },
    "terraform": { code: "15-1244.00", title: "Network and Computer Systems Administrators" },

    // Security
    "cybersecurity": { code: "15-1212.00", title: "Information Security Analysts" },
    "authentication": { code: "15-1212.00", title: "Information Security Analysts" },
    "encryption": { code: "15-1212.00", title: "Information Security Analysts" },
    "penetration testing": { code: "15-1212.00", title: "Information Security Analysts" },

    // Software Engineering General
    "data structures": { code: "15-1252.00", title: "Software Developers" },
    "algorithms": { code: "15-1252.00", title: "Software Developers" },
    "system design": { code: "15-1253.00", title: "Software Quality Assurance Analysts and Testers" },
    "microservices": { code: "15-1252.00", title: "Software Developers" },
    "scalability": { code: "15-1252.00", title: "Software Developers" },
    "git": { code: "15-1252.00", title: "Software Developers" },
    "agile": { code: "15-1299.09", title: "Information Technology Project Managers" },
    "software testing": { code: "15-1253.00", title: "Software Quality Assurance Analysts and Testers" },
    "code review": { code: "15-1252.00", title: "Software Developers" },
    "type systems": { code: "15-1252.00", title: "Software Developers" },

    // Soft Skills
    "communication": { code: "13-1161.00", title: "Market Research Analysts" },
    "leadership": { code: "11-3021.00", title: "Computer and Information Systems Managers" },
    "teamwork": { code: "11-3021.00", title: "Computer and Information Systems Managers" },
    "problem solving": { code: "15-1252.00", title: "Software Developers" },
    "project management": { code: "15-1299.09", title: "Information Technology Project Managers" },
    "time management": { code: "15-1299.09", title: "Information Technology Project Managers" },
    "critical thinking": { code: "15-1252.00", title: "Software Developers" },
    "adaptability": { code: "15-1252.00", title: "Software Developers" },
};

export function mapSkillToSOC(skill: string): { code: string; title: string } | null {
    const normalized = skill.toLowerCase().trim();
    return SOC_CODE_MAP[normalized] || null;
}
