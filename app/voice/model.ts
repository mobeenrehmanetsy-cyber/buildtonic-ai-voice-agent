import type { ProjectBrief } from "../start-project/model";

export type VoicePhase =
  | "idle"
  | "invitation"
  | "open"
  | "requesting-permission"
  | "connecting"
  | "listening"
  | "user-speaking"
  | "assistant-thinking"
  | "assistant-speaking"
  | "muted"
  | "ending"
  | "ended"
  | "error";
export type MicrophoneState = "off" | "requesting" | "live" | "muted";
export type PageContext = {
  pathname: string;
  pageType:
    | "home"
    | "project"
    | "portfolio"
    | "expertise"
    | "heritage"
    | "enquiry"
    | "information";
  identifier?: string;
  selectedStarter?: string;
};
export type LanguagePreference = {
  mode: "automatic" | "manual";
  browserLanguages: readonly string[];
  manualLanguage?: string;
  resolvedLanguage: string;
};
export type VoiceSnapshot = {
  phase: VoicePhase;
  microphone: MicrophoneState;
  error?: string;
};

// Phase 2 boundary only. No implementation, credentials, network or media access.
export interface VoiceSessionAdapter {
  connect(input: {
    context: PageContext;
    language: LanguagePreference;
  }): Promise<void>;
  subscribe(listener: (snapshot: VoiceSnapshot) => void): () => void;
  setMuted(muted: boolean): Promise<void>;
  end(): Promise<void>;
}
export type QualifiedEnquiry = {
  projectBrief?: Partial<ProjectBrief>;
  fullName?: string;
  projectLocation?: string;
  serviceInterest?: string;
  description?: string;
  preferredContact?: "email" | "telephone";
  summary?: string;
};
export type AiCallRequest = {
  fullName: string;
  internationalTelephone: string;
  projectLocation: string;
  preferredLanguage: string;
  serviceInterest: string;
  aiCallConsent: true;
  consentRecordedAt: string;
};

export function getPageContext(
  pathname: string,
  selectedStarter?: string,
): PageContext {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/")
    return { pathname: path, pageType: "home", selectedStarter };
  if (path === "/projects")
    return { pathname: path, pageType: "portfolio", selectedStarter };
  if (path.startsWith("/projects/"))
    return {
      pathname: path,
      pageType: "project",
      identifier: path.split("/")[2],
      selectedStarter,
    };
  if (path === "/heritage")
    return {
      pathname: path,
      pageType: "heritage",
      identifier: "heritage",
      selectedStarter,
    };
  if (path.startsWith("/expertise"))
    return {
      pathname: path,
      pageType: "expertise",
      identifier: path.split("/")[2],
      selectedStarter,
    };
  if (path === "/start-project")
    return { pathname: path, pageType: "enquiry", selectedStarter };
  return {
    pathname: path,
    pageType: "information",
    identifier: path.slice(1),
    selectedStarter,
  };
}
export function resolveLanguage(
  browserLanguages: readonly string[],
  manualLanguage?: string,
  supported: readonly string[] = ["en-GB"],
): LanguagePreference {
  const requested = manualLanguage ? [manualLanguage] : browserLanguages;
  const resolved =
    requested
      .map(
        (lang) =>
          supported.find((s) => s.toLowerCase() === lang.toLowerCase()) ??
          supported.find(
            (s) =>
              s.split("-")[0].toLowerCase() ===
              lang.split("-")[0].toLowerCase(),
          ),
      )
      .find(Boolean) ?? "en-GB";
  return {
    mode: manualLanguage ? "manual" : "automatic",
    browserLanguages,
    manualLanguage,
    resolvedLanguage: resolved,
  };
}
export const starters = [
  {
    id: "heritage",
    label: "Heritage or listed building",
    href: "/heritage",
    linkLabel: "Explore heritage expertise",
  },
  {
    id: "new-homes",
    label: "A new home",
    href: "/expertise/new-homes",
    linkLabel: "Explore new homes",
  },
  {
    id: "extensions-renovations",
    label: "Extension or renovation",
    href: "/expertise/extensions-renovations",
    linkLabel: "Explore extensions & renovations",
  },
  {
    id: "surveys",
    label: "Survey or building concern",
    href: "/expertise/surveys",
    linkLabel: "Explore surveys & reports",
  },
  {
    id: "other",
    label: "Something else",
    href: "/start-project",
    linkLabel: "Contact the Buildtonic team",
  },
] as const;
export const voiceLabels: Record<VoicePhase, string> = {
  idle: "Not connected",
  invitation: "Not connected",
  open: "Not connected",
  "requesting-permission": "Requesting microphone permission",
  connecting: "Connecting",
  listening: "Listening",
  "user-speaking": "You are speaking",
  "assistant-thinking": "Considering your question",
  "assistant-speaking": "Buildtonic is speaking",
  muted: "Microphone muted",
  ending: "Ending conversation",
  ended: "Conversation ended",
  error: "Connection unavailable",
};
