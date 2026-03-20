import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import dotenv from "dotenv";
import { DiagnoserService } from "./services/diagnoser.service";
import { PlannerService } from "./services/planner.service";
import { CriticService } from "./services/critic.service";
import { ReasoningTracer } from "./utils/reasoning-tracer";

dotenv.config();

const server = Fastify({ logger: true });

// --- Services ---
const diagnoser = new DiagnoserService();
const planner = new PlannerService();
const critic = new CriticService();

// --- Global SSE connections ---
const sseClients = new Map<string, (data: string) => void>();

async function main() {
    // Register plugins
    await server.register(cors, { origin: true });
    await server.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

    // ============================================================
    // SSE Endpoint: /api/stream/:sessionId
    // Clients connect here to receive reasoning trace in real-time
    // ============================================================
    server.get<{ Params: { sessionId: string } }>(
        "/api/stream/:sessionId",
        async (request, reply) => {
            const { sessionId } = request.params;

            reply.raw.writeHead(200, {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                "Access-Control-Allow-Origin": "*",
            });

            // Register this client
            const sendEvent = (data: string) => {
                reply.raw.write(`data: ${data}\n\n`);
            };

            sseClients.set(sessionId, sendEvent);

            // Send initial connection event
            sendEvent(
                JSON.stringify({
                    step: 0,
                    logic: "Connected to reasoning stream",
                    action: "Awaiting analysis",
                    timestamp: new Date().toISOString(),
                })
            );

            // Cleanup on close
            request.raw.on("close", () => {
                sseClients.delete(sessionId);
            });
        }
    );

    // ============================================================
    // POST /api/analyze
    // Receives a resume PDF + optional JD text, runs the full
    // Diagnoser → Planner → Critic pipeline
    // ============================================================
    server.post("/api/analyze", async (request, reply) => {
        const sessionId = `session-${Date.now()}`;
        const tracer = new ReasoningTracer();

        // If an SSE client is listening, forward reasoning steps
        tracer.on("step", (step) => {
            const sendEvent = sseClients.get(sessionId);
            if (sendEvent) {
                sendEvent(JSON.stringify(step));
            }
        });

        try {
            tracer.addStep(
                "Analysis pipeline initiated",
                "Receiving uploaded documents"
            );

            // Parse multipart form data
            const parts = request.parts();
            let resumeBuffer: Buffer | null = null;
            let resumeFilename = "unknown.pdf";
            let jdText = "";

            for await (const part of parts) {
                if (part.type === "file" && part.fieldname === "resume") {
                    resumeBuffer = await part.toBuffer();
                    resumeFilename = part.filename || "resume.pdf";
                } else if (part.type === "field" && part.fieldname === "jdText") {
                    jdText = part.value as string;
                }
            }

            if (!resumeBuffer) {
                return reply.status(400).send({ error: "Resume PDF is required" });
            }

            // Default JD if not provided
            if (!jdText) {
                jdText = `
          We are looking for a Full-Stack Developer with experience in:
          - React, Next.js, TypeScript for frontend development
          - Node.js, Express for backend development
          - PostgreSQL, database design
          - Docker, CI/CD, DevOps practices
          - Git, Agile methodologies
          - Strong communication and teamwork skills
          - System design and microservices architecture
        `;
            }

            // ==========================================
            // STEP 1: DIAGNOSER - Extract skills
            // ==========================================
            tracer.addStep(
                "PHASE 1: Running Diagnoser Agent",
                "Extracting text from Resume PDF"
            );

            const resumeText = await diagnoser.extractTextFromPDF(resumeBuffer);

            tracer.addStep(
                `Resume text extracted: ${resumeText.length} characters`,
                "Extracting skills from resume"
            );

            const resumeSkills = await diagnoser.extractSkills(resumeText, tracer);

            tracer.addStep(
                "Extracting skills from Job Description",
                "Running NER on JD text"
            );

            const jdSkills = await diagnoser.extractSkillsFromJD(jdText, tracer);

            // ==========================================
            // STEP 2: PLANNER - Build learning path
            // ==========================================
            tracer.addStep(
                "PHASE 2: Running Planner Agent",
                "Identifying skill gaps"
            );

            const resumeSkillNames = [
                ...resumeSkills.technical.map((s) => s.skill),
                ...resumeSkills.soft.map((s) => s.skill),
            ];
            const jdSkillNames = [
                ...jdSkills.technical.map((s) => s.skill),
                ...jdSkills.soft.map((s) => s.skill),
            ];

            const skillGaps = planner.identifyGaps(
                resumeSkillNames,
                jdSkillNames,
                tracer
            );

            tracer.addStep(
                `${skillGaps.length} skill gaps identified: [${skillGaps.join(", ")}]`,
                "Building DAG and computing learning path"
            );

            const learningPath = planner.buildLearningPath(skillGaps, tracer);

            // ==========================================
            // STEP 3: CRITIC - Validate path
            // ==========================================
            tracer.addStep(
                "PHASE 3: Running Critic Agent",
                "Validating learning path against catalog"
            );

            const criticResult = critic.validate(learningPath, tracer);

            tracer.addStep(
                "All phases complete. Analysis pipeline finished successfully.",
                "Returning results"
            );

            // Build final response
            const result = {
                sessionId,
                resumeFilename,
                extractedSkills: {
                    resume: resumeSkills,
                    jd: jdSkills,
                },
                skillGaps,
                learningPath: criticResult.validatedPath,
                validationReport: criticResult.validationReport,
                reasoningTrace: tracer.getSteps(),
            };

            // Signal SSE stream completion
            const sendEvent = sseClients.get(sessionId);
            if (sendEvent) {
                sendEvent(JSON.stringify({ step: -1, logic: "DONE", action: "COMPLETE" }));
            }

            return reply.status(200).send(result);
        } catch (error: any) {
            tracer.addStep(`Error: ${error.message}`, "Pipeline failed");

            const sendEvent = sseClients.get(sessionId);
            if (sendEvent) {
                sendEvent(
                    JSON.stringify({
                        step: -1,
                        logic: `Error: ${error.message}`,
                        action: "FAILED",
                    })
                );
            }

            return reply.status(500).send({
                error: "Analysis failed",
                message: error.message,
                reasoningTrace: tracer.getSteps(),
            });
        }
    });

    // ============================================================
    // GET /api/health
    // ============================================================
    server.get("/api/health", async () => {
        return {
            status: "ok",
            service: "GapGraph Backend",
            timestamp: new Date().toISOString(),
        };
    });

    // ============================================================
    // Start server
    // ============================================================
    const port = parseInt(process.env.PORT || "3001", 10);
    try {
        await server.listen({ port, host: "0.0.0.0" });
        console.log(`🚀 GapGraph Backend running on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}

main();
