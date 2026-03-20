import pdfParse from "pdf-parse";
import Bytez from "bytez.js";
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
  ]
}

TEXT TO ANALYZE:
`;

export class DiagnoserService {
    private bytezModel!: any;
    private isDummyMode: boolean;

    constructor() {
        const apiKey = process.env.BYTEZ_API_KEY || "b441f287092403006b112c897c01f629";
        this.isDummyMode = !apiKey || apiKey.trim() === "";
        if (!this.isDummyMode) {
            const sdk = new Bytez(apiKey);
            this.bytezModel = sdk.model("meta-llama/Meta-Llama-3.1-8B-Instruct");
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
                ]
            };
        }

        tracer.addStep(
            "Initiating Zero-Shot NER extraction from document text",
            "Sending text to LLM for skill extraction"
        );

        const { error, output } = await this.bytezModel.run([
            {
                role: "system",
                content: "You are a precise NER system. Return only valid JSON without markdown wrapping."
            },
            {
                role: "user",
                content: ZERO_SHOT_NER_PROMPT + text
            }
        ]);

        if (error) {
            throw new Error("Bytez LLaMA Integration Error: " + JSON.stringify(error));
        }

        tracer.addStep(
            "LLM returned raw skill extraction result",
            "Parsing JSON response"
        );

        let parsed: {
            technical: Array<{ skill: string; confidence: number }>;
            soft: Array<{ skill: string; confidence: number }>;
        };

        try {
            let content = "";
            if (typeof output === "string") {
                content = output;
            } else if (Array.isArray(output) && output[0]?.generated_text) {
                // Remove the input prompt from the generated text if returned together
                const textOutput = output[0].generated_text;
                const promptIndex = textOutput.lastIndexOf(ZERO_SHOT_NER_PROMPT + text);
                if (promptIndex !== -1) {
                    content = textOutput.substring(promptIndex + (ZERO_SHOT_NER_PROMPT + text).length).trim();
                } else {
                    content = textOutput;
                }
            } else {
                content = JSON.stringify(output);
            }

            // Strip any markdown code fences if present
            const cleaned = content
                .replace(/```json\n?/g, "")
                .replace(/```\n?/g, "")
                .trim();
            parsed = JSON.parse(cleaned);
        } catch (e) {
            tracer.addStep(
                "Failed to parse LLM response as JSON",
                "Returning empty skill set"
            );
            return { technical: [], soft: [] };
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

        return { technical, soft };
    }

    /**
     * Extract skills from JD text (plain text, not PDF)
     */
    async extractSkillsFromJD(
        jdText: string,
        tracer: ReasoningTracer
    ): Promise<ExtractedSkills> {
        if (this.isDummyMode) {
            tracer.addStep("DUMMY MODE: Processing Job Description text", "Returning mock JD skills");
            return {
                technical: [
                    { skill: "Python", confidence: 0.9, socCode: null, socTitle: null },
                    { skill: "React", confidence: 0.9, socCode: null, socTitle: null },
                    { skill: "LangGraph", confidence: 1.0, socCode: null, socTitle: null },
                    { skill: "ChromaDB", confidence: 0.95, socCode: null, socTitle: null }
                ],
                soft: []
            };
        }

        tracer.addStep(
            "Processing Job Description text",
            "Extracting JD skills using Zero-Shot NER"
        );
        return this.extractSkills(jdText, tracer);
    }
}
