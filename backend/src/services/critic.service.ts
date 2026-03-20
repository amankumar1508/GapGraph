import catalogData from "../data/catalog.json";
import { LearningPath, PathNode } from "./planner.service";
import { ReasoningTracer } from "../utils/reasoning-tracer";

interface CatalogCourse {
    courseId: string;
    title: string;
    description: string;
    skillsCovered: string[];
    prerequisites: string[];
    provider: string;
    difficulty: string;
    durationHours: number;
}

export interface CriticResult {
    validatedPath: LearningPath;
    validationReport: {
        totalNodes: number;
        verifiedNodes: number;
        externalRequired: string[];
        warnings: string[];
    };
}

/**
 * Critic Agent: validates every node in the learning path against
 * the local catalog. Flags any skill/course not grounded in the catalog
 * as EXTERNAL_REQUIRED. No hallucinations allowed.
 */
export class CriticService {
    private catalogIndex: Map<string, CatalogCourse>;

    constructor() {
        this.catalogIndex = new Map();
        for (const course of catalogData.courses as CatalogCourse[]) {
            this.catalogIndex.set(course.courseId, course);
        }
    }

    /**
     * Validate every node in the generated learning path against catalog
     */
    validate(
        learningPath: LearningPath,
        tracer: ReasoningTracer
    ): CriticResult {
        tracer.addStep(
            "Critic Agent activated: validating all path nodes against local catalog",
            "Cross-referencing course IDs"
        );

        const warnings: string[] = [];
        let verifiedCount = 0;

        const validatedNodes: PathNode[] = learningPath.nodes.map((node) => {
            const catalogCourse = this.catalogIndex.get(node.courseId);

            if (!catalogCourse) {
                // Course not found in catalog - STRICT: flag it
                tracer.addStep(
                    `VALIDATION FAIL: Course "${node.courseId}" not found in local catalog`,
                    "Flagging as EXTERNAL_REQUIRED"
                );
                warnings.push(
                    `Course "${node.courseId}" (${node.title}) is not in the local catalog`
                );
                return { ...node, status: "EXTERNAL_REQUIRED" as const };
            }

            // Verify course data matches catalog
            if (catalogCourse.title !== node.title) {
                warnings.push(
                    `Course "${node.courseId}" title mismatch: path says "${node.title}", catalog says "${catalogCourse.title}"`
                );
            }

            tracer.addStep(
                `VERIFIED: Course "${node.courseId}" (${node.title}) exists in local catalog`,
                "Node validation passed"
            );

            verifiedCount++;
            return { ...node, status: "AVAILABLE" as const };
        });

        // Also verify that prerequisite edges reference valid catalog courses
        for (const edge of learningPath.edges) {
            if (!this.catalogIndex.has(edge.from)) {
                warnings.push(
                    `Prerequisite edge source "${edge.from}" not found in catalog`
                );
            }
            if (!this.catalogIndex.has(edge.to)) {
                warnings.push(
                    `Prerequisite edge target "${edge.to}" not found in catalog`
                );
            }
        }

        // Validate flagged external skills
        tracer.addStep(
            `Validation complete: ${verifiedCount}/${learningPath.nodes.length} nodes verified, ${learningPath.flaggedExternal.length} external skills, ${warnings.length} warnings`,
            "Critic validation finished"
        );

        return {
            validatedPath: {
                ...learningPath,
                nodes: validatedNodes,
            },
            validationReport: {
                totalNodes: learningPath.nodes.length,
                verifiedNodes: verifiedCount,
                externalRequired: learningPath.flaggedExternal,
                warnings,
            },
        };
    }
}
