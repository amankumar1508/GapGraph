export interface YouTubeResource {
    title: string;
    channel?: string;
    videoId: string;
    url: string;
    duration: string;
    type: "video" | "playlist" | "docs" | "course";
}

// A comprehensive catalog of curated high-quality YouTube resources for popular tech topics.
const CURATED_YOUTUBE_RESOURCES: Record<string, YouTubeResource[]> = {
    // DevOps & Infrastructure
    "docker": [
        { title: "Docker in 100 Seconds", channel: "Fireship", videoId: "Gjnup-PuquQ", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", duration: "2 min", type: "video" },
        { title: "Docker Tutorial for Beginners", channel: "TechWorld with Nana", videoId: "3c-iBn73dDE", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", duration: "2 hr", type: "course" },
        { title: "Docker Crash Course", channel: "TechWorld with Nana", videoId: "pg19Z8LL06w", url: "https://www.youtube.com/watch?v=pg19Z8LL06w", duration: "1 hr", type: "video" }
    ],
    "kubernetes": [
        { title: "Kubernetes in 100 Seconds", channel: "Fireship", videoId: "PziYflu8cB8", url: "https://www.youtube.com/watch?v=PziYflu8cB8", duration: "2 min", type: "video" },
        { title: "Kubernetes Tutorial for Beginners", channel: "TechWorld with Nana", videoId: "X48VuDVv0do", url: "https://www.youtube.com/watch?v=X48VuDVv0do", duration: "3.5 hr", type: "course" }
    ],
    "ci/cd": [
        { title: "GitHub Actions Tutorial", channel: "Fireship", videoId: "eB0nUzAI7M8", url: "https://www.youtube.com/watch?v=eB0nUzAI7M8", duration: "12 min", type: "video" },
        { title: "GitHub Actions Full Course", channel: "freeCodeCamp", videoId: "R8_veQiYBjI", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "2 hr", type: "course" }
    ],
    "github actions": [
        { title: "GitHub Actions Tutorial", channel: "Fireship", videoId: "eB0nUzAI7M8", url: "https://www.youtube.com/watch?v=eB0nUzAI7M8", duration: "12 min", type: "video" },
        { title: "GitHub Actions Full Course", channel: "freeCodeCamp", videoId: "R8_veQiYBjI", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", duration: "2 hr", type: "course" }
    ],

    // Frontend
    "react": [
        { title: "React in 100 Seconds", channel: "Fireship", videoId: "Tn6-PIqc4UM", url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM", duration: "2 min", type: "video" },
        { title: "React Full Course for Beginners", channel: "freeCodeCamp", videoId: "bMknfKXIFA8", url: "https://www.youtube.com/watch?v=bMknfKXIFA8", duration: "12 hr", type: "course" },
        { title: "React Tutorial for Beginners", channel: "Programming with Mosh", videoId: "SqcY0GlETPk", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", duration: "1 hr", type: "video" }
    ],
    "next.js": [
        { title: "Next.js in 100 Seconds", channel: "Fireship", videoId: "Sklc_fQBmcs", url: "https://www.youtube.com/watch?v=Sklc_fQBmcs", duration: "2 min", type: "video" },
        { title: "Next.js Full Course", channel: "JavaScript Mastery", videoId: "wm5gMKuwSYk", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", duration: "5 hr", type: "course" }
    ],
    "javascript": [
        { title: "JavaScript in 100 Seconds", channel: "Fireship", videoId: "DHjqpvDnNGE", url: "https://www.youtube.com/watch?v=DHjqpvDnNGE", duration: "2 min", type: "video" },
        { title: "JavaScript Full Course", channel: "freeCodeCamp", videoId: "PkZNo7MFNFg", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", duration: "3.5 hr", type: "course" }
    ],
    "typescript": [
        { title: "TypeScript in 100 Seconds", channel: "Fireship", videoId: "zQnBQ4tB3ZA", url: "https://www.youtube.com/watch?v=zQnBQ4tB3ZA", duration: "2 min", type: "video" },
        { title: "TypeScript Full Course", channel: "Dave Gray", videoId: "gieEQFIfgYc", url: "https://www.youtube.com/watch?v=gieEQFIfgYc", duration: "8 hr", type: "course" }
    ],
    "html": [
        { title: "HTML in 100 Seconds", channel: "Fireship", videoId: "ok-plXXHlWw", url: "https://www.youtube.com/watch?v=ok-plXXHlWw", duration: "2 min", type: "video" },
        { title: "HTML Full Course", channel: "freeCodeCamp", videoId: "kUMe1FH4CHE", url: "https://www.youtube.com/watch?v=kUMe1FH4CHE", duration: "2 hr", type: "course" }
    ],
    "css": [
        { title: "CSS in 100 Seconds", channel: "Fireship", videoId: "OEV8gMkCHXQ", url: "https://www.youtube.com/watch?v=OEV8gMkCHXQ", duration: "2 min", type: "video" },
        { title: "CSS Full Course for Beginners", channel: "freeCodeCamp", videoId: "1Rs2ND1ryYc", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", duration: "11 hr", type: "course" }
    ],
    "tailwindcss": [
        { title: "Tailwind in 100 Seconds", channel: "Fireship", videoId: "mr15Xzb1Ook", url: "https://www.youtube.com/watch?v=mr15Xzb1Ook", duration: "2 min", type: "video" },
        { title: "Tailwind CSS Full Course", channel: "freeCodeCamp", videoId: "ft30zcMlFao", url: "https://www.youtube.com/watch?v=ft30zcMlFao", duration: "4 hr", type: "course" }
    ],
    "angular": [
        { title: "Angular in 100 Seconds", channel: "Fireship", videoId: "Ata9cSC2WpM", url: "https://www.youtube.com/watch?v=Ata9cSC2WpM", duration: "2 min", type: "video" },
        { title: "Angular Full Course", channel: "freeCodeCamp", videoId: "3qBXWUpoPHo", url: "https://www.youtube.com/watch?v=3qBXWUpoPHo", duration: "2 hr", type: "course" }
    ],
    "vue": [
        { title: "Vue.js in 100 Seconds", channel: "Fireship", videoId: "nhBVL41-_Cw", url: "https://www.youtube.com/watch?v=nhBVL41-_Cw", duration: "2 min", type: "video" },
        { title: "Vue.js Full Course", channel: "freeCodeCamp", videoId: "FXpIoQ_rT_c", url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c", duration: "3 hr", type: "course" }
    ],

    // Backend
    "node.js": [
        { title: "Node.js in 100 Seconds", channel: "Fireship", videoId: "ENrzD9HAZK4", url: "https://www.youtube.com/watch?v=ENrzD9HAZK4", duration: "2 min", type: "video" },
        { title: "Node.js Full Course", channel: "freeCodeCamp", videoId: "Oe421EPjeBE", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", duration: "8 hr", type: "course" }
    ],
    "express": [
        { title: "Express.js Full Course", channel: "freeCodeCamp", videoId: "CnH3kAXSrmU", url: "https://www.youtube.com/watch?v=CnH3kAXSrmU", duration: "2 hr", type: "course" },
        { title: "Express.js Crash Course", channel: "Traversy Media", videoId: "SccSCuHhOw0", url: "https://www.youtube.com/watch?v=SccSCuHhOw0", duration: "1 hr", type: "video" }
    ],
    "graphql": [
        { title: "GraphQL in 100 Seconds", channel: "Fireship", videoId: "eIQh02xuVw4", url: "https://www.youtube.com/watch?v=eIQh02xuVw4", duration: "2 min", type: "video" },
        { title: "GraphQL Full Course", channel: "freeCodeCamp", videoId: "ed8SzALpx1Q", url: "https://www.youtube.com/watch?v=ed8SzALpx1Q", duration: "4 hr", type: "course" }
    ],
    "redis": [
        { title: "Redis in 100 Seconds", channel: "Fireship", videoId: "G1rOthIU-uo", url: "https://www.youtube.com/watch?v=G1rOthIU-uo", duration: "2 min", type: "video" },
        { title: "Redis Crash Course", channel: "Traversy Media", videoId: "jgpVdJB2sKQ", url: "https://www.youtube.com/watch?v=jgpVdJB2sKQ", duration: "40 min", type: "video" }
    ],
    "mongodb": [
        { title: "MongoDB in 100 Seconds", channel: "Fireship", videoId: "-bt_y4Loofg", url: "https://www.youtube.com/watch?v=-bt_y4Loofg", duration: "2 min", type: "video" },
        { title: "MongoDB Crash Course", channel: "Traversy Media", videoId: "ofme2o29ngU", url: "https://www.youtube.com/watch?v=ofme2o29ngU", duration: "35 min", type: "video" }
    ],
    "postgresql": [
        { title: "PostgreSQL Full Course", channel: "freeCodeCamp", videoId: "qw--VYLpxG4", url: "https://www.youtube.com/watch?v=qw--VYLpxG4", duration: "4 hr", type: "course" }
    ],
    "sql": [
        { title: "SQL in 100 Seconds", channel: "Fireship", videoId: "zsjvFFKOm3c", url: "https://www.youtube.com/watch?v=zsjvFFKOm3c", duration: "2 min", type: "video" },
        { title: "SQL Full Course", channel: "freeCodeCamp", videoId: "HXV3zeQKqGY", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", duration: "4 hr", type: "course" }
    ],

    // Programming Languages
    "python": [
        { title: "Python in 100 Seconds", channel: "Fireship", videoId: "x7X9w_GIm1s", url: "https://www.youtube.com/watch?v=x7X9w_GIm1s", duration: "2 min", type: "video" },
        { title: "Python Full Course for Beginners", channel: "freeCodeCamp", videoId: "rfscVS0vtbw", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", duration: "4.5 hr", type: "course" }
    ],
    "java": [
        { title: "Java in 100 Seconds", channel: "Fireship", videoId: "l9AzO1FMgM8", url: "https://www.youtube.com/watch?v=l9AzO1FMgM8", duration: "2 min", type: "video" },
        { title: "Java Full Course", channel: "freeCodeCamp", videoId: "GdzRzWymT4Q", url: "https://www.youtube.com/watch?v=GdzRzWymT4Q", duration: "12 hr", type: "course" }
    ],
    "c++": [
        { title: "C++ in 100 Seconds", channel: "Fireship", videoId: "MNeX4EGtR5Y", url: "https://www.youtube.com/watch?v=MNeX4EGtR5Y", duration: "2 min", type: "video" },
        { title: "C++ Full Course", channel: "freeCodeCamp", videoId: "vLnPwxZdW4Y", url: "https://www.youtube.com/watch?v=vLnPwxZdW4Y", duration: "4 hr", type: "course" }
    ],
    "go": [
        { title: "Go in 100 Seconds", channel: "Fireship", videoId: "446E-r0rXHI", url: "https://www.youtube.com/watch?v=446E-r0rXHI", duration: "2 min", type: "video" },
        { title: "Go Full Course", channel: "freeCodeCamp", videoId: "un6ZyFkqFKo", url: "https://www.youtube.com/watch?v=un6ZyFkqFKo", duration: "6 hr", type: "course" }
    ],
    "rust": [
        { title: "Rust in 100 Seconds", channel: "Fireship", videoId: "5C_HPTJg5ek", url: "https://www.youtube.com/watch?v=5C_HPTJg5ek", duration: "2 min", type: "video" },
        { title: "Rust Full Course", channel: "freeCodeCamp", videoId: "BpPEoZW5IiY", url: "https://www.youtube.com/watch?v=BpPEoZW5IiY", duration: "14 hr", type: "course" }
    ],

    // AI / ML / Data Science
    "machine learning": [
        { title: "Machine Learning for Everybody", channel: "freeCodeCamp", videoId: "i_LwzRmA_08", url: "https://www.youtube.com/watch?v=i_LwzRmA_08", duration: "3.5 hr", type: "course" },
        { title: "Machine Learning in 100 Seconds", channel: "Fireship", videoId: "PeMlggyqz0Y", url: "https://www.youtube.com/watch?v=PeMlggyqz0Y", duration: "2 min", type: "video" }
    ],
    "deep learning": [
        { title: "Deep Learning Crash Course", channel: "freeCodeCamp", videoId: "VyWAvY2CF9c", url: "https://www.youtube.com/watch?v=VyWAvY2CF9c", duration: "6 hr", type: "course" }
    ],
    "tensorflow": [
        { title: "TensorFlow 2.0 Full Course", channel: "freeCodeCamp", videoId: "tPYj3fFJGjk", url: "https://www.youtube.com/watch?v=tPYj3fFJGjk", duration: "7 hr", type: "course" }
    ],
    "pytorch": [
        { title: "PyTorch Full Course", channel: "freeCodeCamp", videoId: "V_xro1bcAuA", url: "https://www.youtube.com/watch?v=V_xro1bcAuA", duration: "10 hr", type: "course" }
    ],
    "data science": [
        { title: "Data Science Full Course", channel: "freeCodeCamp", videoId: "ua-CiDNNj30", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", duration: "5 hr", type: "course" }
    ],

    // Architecture & Design
    "system design": [
        { title: "System Design for Beginners", channel: "Gaurav Sen", videoId: "xpDnVSmNFX0", url: "https://www.youtube.com/watch?v=xpDnVSmNFX0", duration: "15 min", type: "video" },
        { title: "System Design Full Course", channel: "freeCodeCamp", videoId: "F2FmTdLtb_4", url: "https://www.youtube.com/watch?v=F2FmTdLtb_4", duration: "1.5 hr", type: "course" }
    ],
    "microservices": [
        { title: "Microservices Explained", channel: "TechWorld with Nana", videoId: "rv4LlmLmVWk", url: "https://www.youtube.com/watch?v=rv4LlmLmVWk", duration: "18 min", type: "video" }
    ],
    "rest api": [
        { title: "REST API Crash Course", channel: "Caleb Curry", videoId: "-MTSQjw5DrM", url: "https://www.youtube.com/watch?v=-MTSQjw5DrM", duration: "1 hr", type: "video" }
    ],

    // Cloud
    "aws": [
        { title: "AWS in 10 Minutes", channel: "Fireship", videoId: "JIbIYCM48to", url: "https://www.youtube.com/watch?v=JIbIYCM48to", duration: "11 min", type: "video" },
        { title: "AWS Full Course", channel: "freeCodeCamp", videoId: "3hLmDS179YE", url: "https://www.youtube.com/watch?v=3hLmDS179YE", duration: "5 hr", type: "course" }
    ],
    "azure": [
        { title: "Azure Full Course", channel: "freeCodeCamp", videoId: "NKEFWyqJ5XA", url: "https://www.youtube.com/watch?v=NKEFWyqJ5XA", duration: "3 hr", type: "course" }
    ],
    "gcp": [
        { title: "Google Cloud Full Course", channel: "freeCodeCamp", videoId: "UGRDM86MBXU", url: "https://www.youtube.com/watch?v=UGRDM86MBXU", duration: "5 hr", type: "course" }
    ],

    // Web Development (general)
    "web development": [
        { title: "Web Development Full Course", channel: "freeCodeCamp", videoId: "pQN-pnXPaVg", url: "https://www.youtube.com/watch?v=pQN-pnXPaVg", duration: "6 hr", type: "course" },
        { title: "Frontend Web Development Bootcamp", channel: "freeCodeCamp", videoId: "zJSY8tbf_ys", url: "https://www.youtube.com/watch?v=zJSY8tbf_ys", duration: "21 hr", type: "course" }
    ],
    "frontend": [
        { title: "Frontend Web Development Bootcamp", channel: "freeCodeCamp", videoId: "zJSY8tbf_ys", url: "https://www.youtube.com/watch?v=zJSY8tbf_ys", duration: "21 hr", type: "course" },
        { title: "HTML, CSS & JS Crash Course", channel: "Traversy Media", videoId: "UB1O30fR-EE", url: "https://www.youtube.com/watch?v=UB1O30fR-EE", duration: "1 hr", type: "video" }
    ],
    "backend": [
        { title: "Backend Web Development Full Course", channel: "freeCodeCamp", videoId: "XBu54nfzxAQ", url: "https://www.youtube.com/watch?v=XBu54nfzxAQ", duration: "10 hr", type: "course" }
    ],

    // Git
    "git": [
        { title: "Git in 100 Seconds", channel: "Fireship", videoId: "hwP7WQkmECE", url: "https://www.youtube.com/watch?v=hwP7WQkmECE", duration: "2 min", type: "video" },
        { title: "Git & GitHub Crash Course", channel: "freeCodeCamp", videoId: "RGOj5yH7evk", url: "https://www.youtube.com/watch?v=RGOj5yH7evk", duration: "1 hr", type: "course" }
    ],

    // Testing
    "testing": [
        { title: "Software Testing Full Course", channel: "freeCodeCamp", videoId: "u6QfIXgjwGQ", url: "https://www.youtube.com/watch?v=u6QfIXgjwGQ", duration: "9 hr", type: "course" }
    ],
    "jest": [
        { title: "Jest Crash Course", channel: "Traversy Media", videoId: "7r4xVDI2vho", url: "https://www.youtube.com/watch?v=7r4xVDI2vho", duration: "1 hr", type: "video" }
    ],

    // Agile
    "agile": [
        { title: "Agile Project Management", channel: "freeCodeCamp", videoId: "vsnzhDJhFSk", url: "https://www.youtube.com/watch?v=vsnzhDJhFSk", duration: "2 hr", type: "course" }
    ],

    // DevOps general
    "devops": [
        { title: "DevOps Engineering Course", channel: "freeCodeCamp", videoId: "j5Zsa_eOXeY", url: "https://www.youtube.com/watch?v=j5Zsa_eOXeY", duration: "2.5 hr", type: "course" }
    ],

    // LangChain / AI tools
    "langchain": [
        { title: "LangChain Crash Course", channel: "freeCodeCamp", videoId: "lG7Uxts9SXs", url: "https://www.youtube.com/watch?v=lG7Uxts9SXs", duration: "2 hr", type: "course" }
    ],
    "langgraph": [
        { title: "LangGraph Full Course", channel: "freeCodeCamp", videoId: "nmKXIzGmTTw", url: "https://www.youtube.com/watch?v=nmKXIzGmTTw", duration: "3 hr", type: "course" }
    ],
    "chromadb": [
        { title: "ChromaDB Vector Database", channel: "AllAboutAI", videoId: "PSFnIBYkxas", url: "https://www.youtube.com/watch?v=PSFnIBYkxas", duration: "15 min", type: "video" }
    ],

    // Flutter / Mobile
    "flutter": [
        { title: "Flutter in 100 Seconds", channel: "Fireship", videoId: "lHho5b0gBkg", url: "https://www.youtube.com/watch?v=lHho5b0gBkg", duration: "2 min", type: "video" },
        { title: "Flutter Full Course", channel: "freeCodeCamp", videoId: "VPvVD8t02U8", url: "https://www.youtube.com/watch?v=VPvVD8t02U8", duration: "37 hr", type: "course" }
    ],
    "react native": [
        { title: "React Native Full Course", channel: "JavaScript Mastery", videoId: "ZBCUegTZF7M", url: "https://www.youtube.com/watch?v=ZBCUegTZF7M", duration: "5 hr", type: "course" }
    ]
};

// Generic fallbacks for any skill not in catalog
const GENERIC_YOUTUBE_FALLBACKS: YouTubeResource[] = [
    {
        title: "Web Development for Beginners",
        channel: "freeCodeCamp",
        videoId: "pQN-pnXPaVg",
        url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
        duration: "6 hr",
        type: "course"
    }
];

export class YouTubeService {
    /**
     * Finds curated YouTube resources for a given skill.
     * Searches through exact match, substring match, and fallback.
     */
    async getResourcesForSkill(skillName: string): Promise<YouTubeResource[]> {
        const normalized = skillName.toLowerCase().trim();
        
        // Exact match
        if (CURATED_YOUTUBE_RESOURCES[normalized]) {
            return CURATED_YOUTUBE_RESOURCES[normalized];
        }

        // Substring match (both directions)
        const match = Object.keys(CURATED_YOUTUBE_RESOURCES).find(
            k => normalized.includes(k) || k.includes(normalized)
        );
        if (match) {
            return CURATED_YOUTUBE_RESOURCES[match];
        }

        // Generate a YouTube search-based fallback with a real search link
        return [
            {
                title: `${skillName} — Full Tutorial`,
                channel: "YouTube Search",
                videoId: "pQN-pnXPaVg", // Fallback to web dev course
                url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + " tutorial")}`,
                duration: "Varies",
                type: "video"
            },
            ...GENERIC_YOUTUBE_FALLBACKS
        ];
    }
}
