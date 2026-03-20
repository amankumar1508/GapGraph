import { EventEmitter } from "events";

export interface ReasoningStep {
    step: number;
    logic: string;
    action: string;
    timestamp: string;
}

/**
 * ReasoningTracer captures Chain-of-Thought (CoT) steps
 * and emits them as SSE events.
 */
export class ReasoningTracer extends EventEmitter {
    private steps: ReasoningStep[] = [];
    private stepCounter = 0;

    addStep(logic: string, action: string): ReasoningStep {
        this.stepCounter++;
        const step: ReasoningStep = {
            step: this.stepCounter,
            logic,
            action,
            timestamp: new Date().toISOString(),
        };
        this.steps.push(step);
        this.emit("step", step);
        return step;
    }

    getSteps(): ReasoningStep[] {
        return [...this.steps];
    }

    reset(): void {
        this.steps = [];
        this.stepCounter = 0;
    }
}
