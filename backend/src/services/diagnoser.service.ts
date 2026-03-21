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

const ZERO_SHOT_NER_PROMPT = `You are an expert ATS (Applicant Tracking System) parser and Named Entity Recognition (NER) AI.
Your exact purpose is to extract a highly accurate, production-ready profile of skills from the provided text (either a resume or a job description).

STRICT RULES:
1. ONLY return a purely valid JSON object. Do NOT include any markdown formatting (no \`\`\`json), no introductory text, no conversational filler. Your entire response must be parsable by JSON.parse().
2. The JSON must strictly adhere to this schema:
{
  "technical": [
    {"skill": "skill_name", "confidence": 0.0_to_1.0}
  ],
  "soft": [
    {"skill": "skill_name", "confidence": 0.0_to_1.0}
  ]
}
3. Normalize all technologies to their industry-standard lowercase names (e.g., "react.js" or "react" -> "react", "node" -> "node.js").
4. 'confidence' must be vividly accurate based on how centrally the skill is featured in the text.
5. Provide a comprehensive list. Do not summarize or skip important technologies.

TEXT TO ANALYZE:
`;

export class DiagnoserService {
    private bytezModel!: any;

    constructor() {
        const apiKey = process.env.BYTEZ_API_KEY || "b441f287092403006b112c897c01f629";
        const sdk = new Bytez(apiKey);
        this.bytezModel = sdk.model("meta-llama/Meta-Llama-3.1-8B-Instruct");
    }

    /**
     * Extract text from a PDF buffer using pdf-parse
     */
    async extractTextFromPDF(buffer: Buffer): Promise<string> {
        const data = await pdfParse(buffer);
        return data.text;
    }

    async extractSkills(
        text: string,
        tracer: ReasoningTracer
    ): Promise<ExtractedSkills> {
        tracer.addStep(
            "Initiating Meta-LLaMA parsing of document text",
            "Sending text to LLM for production-grade extraction"
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
        
        console.log("=== RAW BYTEZ OUTPUT ===");
        console.dir(output, { depth: null });
        console.log("========================");

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
            } else if (output && typeof output === "object" && typeof output.content === "string") {
                content = output.content;
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

            // Robust fallback if strict JSON parse fails natively
            const cleaned = content
                .replace(/^[\s\S]*?\{/, "{") // Strip leading text before first {
                .replace(/\}[^}]*$/, "}")   // Strip trailing text after last }
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
            "Extracting optimal JD skills using Meta-LLaMA NER"
        );
        return this.extractSkills(jdText, tracer);
    }
}
