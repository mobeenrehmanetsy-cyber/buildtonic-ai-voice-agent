import { getPageContext } from "../voice/model.ts";
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  channel: "text" | "voice";
  interrupted?: boolean;
};
export const languages = [
  ["en-GB", "English"],
  ["fr-FR", "Français"],
  ["es-ES", "Español"],
  ["de-DE", "Deutsch"],
  ["it-IT", "Italiano"],
  ["pt-PT", "Português"],
  ["pl-PL", "Polski"],
  ["ur-PK", "اردو"],
  ["ar-SA", "العربية"],
  ["hi-IN", "हिन्दी"],
] as const;
export function safeLanguage(value: unknown) {
  return languages.find(([code]) => code === value)?.[0] ?? "en-GB";
}
const paths = [
  "/",
  "/projects",
  "/heritage",
  "/expertise",
  "/about",
  "/areas",
  "/faq",
  "/guides",
  "/health-and-safety",
  "/careers",
  "/start-project",
  "/privacy",
  ...[
    "rose-cottage",
    "guildford-quaker-meeting-house",
    "the-old-thatch",
    "the-laurels",
    "elm-park-gardens",
    "winters-hill",
  ].map((s) => "/projects/" + s),
  ...["new-homes", "extensions-renovations", "consent", "surveys"].map(
    (s) => "/expertise/" + s,
  ),
];
export function safeContext(value: unknown) {
  const v =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const path =
    typeof v.pathname === "string" ? v.pathname.replace(/\/$/, "") || "/" : "/";
  return getPageContext(
    paths.includes(path) ? path : "/",
    typeof v.selectedStarter === "string" &&
      /^[a-z0-9-]{1,50}$/.test(v.selectedStarter)
      ? v.selectedStarter
      : undefined,
  );
}
export function contextualStarters(pathname: string) {
  const c = safeContext({ pathname });
  if (c.pageType === "project")
    return [
      "What did Buildtonic do on this project?",
      "I have a similar project in mind.",
    ];
  if (pathname.includes("surveys"))
    return [
      "What surveys can you help with?",
      "I have a concern about my building.",
    ];
  if (pathname.includes("new-homes"))
    return [
      "Can you help me build a new home?",
      "What do I need before getting started?",
    ];
  if (pathname.includes("heritage") || pathname.includes("consent"))
    return [
      "Do you work on listed buildings?",
      "I have a heritage project in mind.",
    ];
  return [
    "What does Buildtonic do?",
    "I have a project in mind.",
    "I’m not sure which service I need.",
  ];
}
export function boundedHistory(messages: ChatMessage[]) {
  let length = 0;
  return messages
    .filter((m) => m.text.trim())
    .slice(-24)
    .reverse()
    .filter((m) => {
      length += m.text.length;
      return length <= 24000;
    })
    .reverse();
}
export function parseMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value) || value.length > 24)
    throw Error("Invalid conversation");
  let size = 0;
  return value.map((item, index) => {
    if (
      !item ||
      !["user", "assistant"].includes(item.role) ||
      typeof item.text !== "string" ||
      !item.text.trim() ||
      item.text.length > 4000
    )
      throw Error("Invalid conversation");
    size += item.text.length;
    if (size > 24000) throw Error("Conversation too long");
    return {
      id: String(index),
      role: item.role,
      text: item.text,
      channel: item.channel === "voice" ? "voice" : "text",
      interrupted: item.interrupted === true,
    };
  });
}
export function upsertMessage(messages: ChatMessage[], message: ChatMessage) {
  const index = messages.findIndex((m) => m.id === message.id);
  if (index < 0) return [...messages, message].slice(-80);
  return messages.map((m, i) => (i === index ? message : m));
}
export function safeHref(value: string) {
  return paths.includes(value) ? value : undefined;
}
