import {
  EVENTS,
  track,
  type EventName,
} from "@/lib/analytics/events";

export type ToolLeadId = "runway" | "payroll";

function trackToolEvent(
  event: EventName,
  tool: ToolLeadId,
  props?: Record<string, unknown>,
): void {
  track(event, { tool, ...props });
}

export function trackToolEmailPromptViewed(tool: ToolLeadId): void {
  trackToolEvent(EVENTS.TOOL_EMAIL_PROMPT_VIEWED, tool);
}

export function trackToolEmailStarted(tool: ToolLeadId): void {
  trackToolEvent(EVENTS.TOOL_EMAIL_STARTED, tool);
}

export function trackToolEmailSubmitted(tool: ToolLeadId): void {
  trackToolEvent(EVENTS.TOOL_EMAIL_SUBMITTED, tool);
}

export function trackToolEmailSucceeded(tool: ToolLeadId): void {
  trackToolEvent(EVENTS.TOOL_EMAIL_SUCCEEDED, tool);
}

export function trackToolEmailFailed(tool: ToolLeadId, errorCode: string): void {
  trackToolEvent(EVENTS.TOOL_EMAIL_FAILED, tool, { error_code: errorCode });
}
