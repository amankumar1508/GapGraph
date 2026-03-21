import pdfParse from "pdf-parse";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { mapSkillToSOC } from "../data/soc-codes";
import { ReasoningTracer } from "../utils/reasoning-tracer";

export interface ExtractedSkills {
    technical: Array<{
        skill: string;
        confidence: number;
        socCode: string | null;
        socTitle: string | null;
    }>;
    soft: Array<{
        skill: string;
        confidence: number;
        socCode: string | null;
        socTitle: string | null;
    }>;
    experience: Array<{
        role: string;
        company: string;
        years: number;
    }>;
    projects: Array<{
        name: string;
        description: string;
    }>;
}

const ZERO_SHOT_NER_PROMPT = `You are a world-class Named Entity Recognition (NER) system specialized in extracting skills from resumes and job descriptions.

TASK: Extract ALL technical and soft skills from the following text.

RULES:
1. Return ONLY valid JSON. No markdown, no explanation.
2. Categorize each skill as "technical" or "soft".
3. Normalize skill names to lowercase (e.g., "React.js" → "react", "Node.JS" → "node.js").
4. Assign a confidence score between 0.0 and 1.0 for each skill based on how clearly it's mentioned.
5. Do NOT invent skills that are not in the text.
6. Include programming languages, frameworks, tools, databases, methodologies, and soft skills.

OUTPUT FORMAT:
{
  "technical": [
    {"skill": "python", "confidence": 0.95},
    {"skill": "react", "confidence": 0.85}
  ],
  "soft": [
    {"skill": "leadership", "confidence": 0.8},
    {"skill": "communication", "confidence": 0.7}
  ],
  "experience": [
    {"role": "Senior Developer", "company": "Tech Corp", "years": 4}
  ],
  "projects": [
    {"name": "E-commerce Platform", "description": "Built scalable backend"}
  ]
}

TEXT TO ANALYZE:
`;

export class DiagnoserService {
    private llm!: ChatOpenAI;
    private isDummyMode: boolean;

    constructor() {
        this.isDummyMode = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === "";
        if (!this.isDummyMode) {
            this.llm = new ChatOpenAI({
                modelName: "gpt-4o-mini",
                temperature: 0,
                maxTokens: 2000,
            });
        }
    }

    /**
     * Extract text from a PDF buffer using pdf-parse
     */
    async extractTextFromPDF(buffer: Buffer): Promise<string> {
        const data = await pdfParse(buffer);
        return data.text;
    }

    /**
     * Use LangChain Zero-Shot NER to extract skills from text
     */
    async extractSkills(
        text: string,
        tracer: ReasoningTracer
    ): Promise<ExtractedSkills> {
        if (this.isDummyMode) {
            tracer.addStep(
                "DUMMY MODE ENABLED: Skipping zero-shot NER extraction",
                "Returning mock extracted skills for candidates"
            );
            return {
                technical: [
                    { skill: "Python", confidence: 0.95, socCode: "15-1299.08", socTitle: "Computer Systems Architects" },
                    { skill: "React", confidence: 0.85, socCode: null, socTitle: null },
                    { skill: "SQL", confidence: 0.80, socCode: null, socTitle: null },
                    { skill: "Git", confidence: 0.90, socCode: null, socTitle: null }
                ],
                soft: [
                    { skill: "Communication", confidence: 0.80, socCode: null, socTitle: null }
                ],
                experience: [
                    { role: "Software Engineer", company: "TechCorp India", years: 3 }
                ],
                projects: [
                    { name: "Scalable Microservices Backend", description: "Migrated monolithic application to Spring Boot microservices, improving uptime by 40%." },
                    { name: "Real-time Analytics Dashboard", description: "Built with React and WebSocket for live data monitoring." }
                ]
            };
        }

        tracer.addStep(
            "Initiating Zero-Shot NER extraction from document text",
            "Sending text to LLM for skill extraction"
        );

        const response = await this.llm.invoke([
            new SystemMessage(
                "You are a precise NER system. Return only valid JSON."
            ),
            new HumanMessage(ZERO_SHOT_NER_PROMPT + text),
        ]);

        tracer.addStep(
            "LLM returned raw skill extraction result",
            "Parsing JSON response"
        );

        let parsed: {
            technical: Array<{ skill: string; confidence: number }>;
            soft: Array<{ skill: string; confidence: number }>;
            experience?: Array<{ role: string; company: string; years: number }>;
            projects?: Array<{ name: string; description: string }>;
        };

        try {
            const content = response.content as string;
            // Strip any markdown code fences if present
            const cleaned = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            parsed = JSON.parse(cleaned);
            if (!parsed || typeof parsed !== 'object') {
                parsed = { technical: [], soft: [] };
            }
            if (!Array.isArray(parsed.technical)) parsed.technical = [];
            if (!Array.isArray(parsed.soft)) parsed.soft = [];
            // Filter out any entries with missing skill names
            parsed.technical = parsed.technical.filter(s => s && typeof s.skill === 'string' && s.skill.length > 0);
            parsed.soft = parsed.soft.filter(s => s && typeof s.skill === 'string' && s.skill.length > 0);
        } catch (e) {
            tracer.addStep(
                "Failed to parse LLM response as JSON",
                "Returning empty skill set"
            );
            return { technical: [], soft: [], experience: [], projects: [] };
        }

        tracer.addStep(
            `Extracted ${parsed.technical.length} technical and ${parsed.soft.length} soft skills`,
            "Mapping skills to O*NET SOC codes"
        );

        // Map to SOC codes
        const technical = parsed.technical.map((s) => {
            const soc = mapSkillToSOC(s.skill);
            return {
                skill: s.skill,
                confidence: s.confidence,
                socCode: soc?.code || null,
                socTitle: soc?.title || null,
            };
        });

        const soft = parsed.soft.map((s) => {
            const soc = mapSkillToSOC(s.skill);
            return {
                skill: s.skill,
                confidence: s.confidence,
                socCode: soc?.code || null,
                socTitle: soc?.title || null,
            };
        });

        tracer.addStep(
            `SOC mapping complete. ${technical.filter((t) => t.socCode).length}/${technical.length} technical skills mapped`,
            "Skill extraction complete"
        );

        return { 
            technical, 
            soft, 
            experience: parsed.experience || [], 
            projects: parsed.projects || [] 
        };
    }

    /**
     * Extract skills from JD text (plain text, not PDF)
     */
    async extractSkillsFromJD(
        jdText: string,
        tracer: ReasoningTracer
    ): Promise<ExtractedSkills> {
        if (this.isDummyMode) {
            tracer.addStep("DUMMY MODE: Processing Job Description text", "Scanning JD for catalog keywords since OpenAI is unavailable");

            const catalogKeywords = [
                "python", "javascript", "node.js", "express", "react", "frontend", "backend",
                "typescript", "sql", "postgresql", "docker", "ci/cd", "devops", 
                "kubernetes", "aws", "machine learning", "tensorflow", "git", "agile", 
                "system design", "cybersecurity", "algorithms", "data structures"
            ];
            
            const lowerJd = jdText.toLowerCase();
            const extracted: string[] = [];
            
            // Heuristic mappings for broad terms
            if (lowerJd.includes("backend")) {
                extracted.push("node.js", "express", "postgresql", "docker", "system design");
            }
            if (lowerJd.includes("frontend") || lowerJd.includes("front-end")) {
                extracted.push("react", "javascript", "typescript");
            }
            if (lowerJd.includes("data science") || lowerJd.includes("ai")) {
                extracted.push("python", "machine learning", "tensorflow");
            }
            
            // Scan for exact keyword matches
            for (const kw of catalogKeywords) {
                if (lowerJd.includes(kw) && !extracted.includes(kw)) {
                    extracted.push(kw);
                }
            }
            
            // Fallback if absolutely nothing matched so we don't get an empty roadmap
            if (extracted.length === 0) {
                extracted.push("docker", "kubernetes", "aws", "system design");
            }

            const technical = extracted.map(skill => ({
                skill,
                confidence: 0.95,
                socCode: null,
                socTitle: null
            }));

            return {
                technical,
                soft: [],
                experience: [],
                projects: []
            };
        }

        tracer.addStep(
            "Processing Job Description text",
            "Extracting JD skills using Zero-Shot NER"
        );
        return this.extractSkills(jdText, tracer);
    }
}
