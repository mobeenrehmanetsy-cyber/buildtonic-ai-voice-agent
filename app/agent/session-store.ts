"use client";
import { useSyncExternalStore } from "react";
import { emptyQualification, type Qualification } from "./qualification";
import { upsertMessage, type ChatMessage } from "./conversation";
type Session = {
  messages: ChatMessage[];
  qualification: Qualification;
  manualLanguage: string | undefined;
  pendingQuestion?: string;
};
const initial: Session = {
  messages: [],
  qualification: emptyQualification,
  manualLanguage: undefined,
  pendingQuestion: undefined,
};
let state = initial;
const listeners = new Set<() => void>();
export function getSession() {
  return state;
}
export function setSession(patch: Partial<Session>) {
  state = { ...state, ...patch };
  listeners.forEach((fn) => fn());
}
export function putMessage(message: ChatMessage) {
  setSession({ messages: upsertMessage(state.messages, message) });
}
export function resetSession() {
  state = { ...initial, manualLanguage: state.manualLanguage };
  listeners.forEach((fn) => fn());
}
export function useAgentSession() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getSession,
    () => initial,
  );
}
