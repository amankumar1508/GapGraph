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
    private llm: ChatOpenAI;

    constructor() {
        this.llm = new ChatOpenAI({
            modelName: "gpt-4o-mini",
            temperature: 0,
            maxTokens: 2000,
        });
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
        };

        try {
            const content = response.content as string;
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
        tracer.addStep(
            "Processing Job Description text",
            "Extracting JD skills using Zero-Shot NER"
        );
        return this.extractSkills(jdText, tracer);
    }
}
