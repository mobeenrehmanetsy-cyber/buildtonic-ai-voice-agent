import "server-only";
import {
  mkdir,
  readFile,
  writeFile,
  rename,
  open,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
export type Document<T> = { version: number; value: T };
export interface RecordStore {
  mode: "local" | "remote";
  get<T>(key: string): Promise<Document<T> | null>;
  // Atomic compare-and-swap. null means create only. false means conflict.
  put<T>(key: string, value: T, expected: number | null): Promise<boolean>;
}
const validKey = (key: string) => {
  if (!/^[a-z0-9-]{1,100}$/i.test(key)) throw Error("Invalid record key");
  return key;
};
export class FileStore implements RecordStore {
  mode = "local" as const;
  private root: string;
  constructor(root: string) {
    this.root = root;
  }
  async get<T>(key: string): Promise<Document<T> | null> {
    try {
      return JSON.parse(
        await readFile(path.join(this.root, validKey(key) + ".json"), "utf8"),
      );
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
  async put<T>(key: string, value: T, expected: number | null) {
    validKey(key);
    await mkdir(this.root, { recursive: true, mode: 0o700 });
    const lockPath = path.join(this.root, key + ".lock");
    let lock;
    try {
      lock = await open(lockPath, "wx", 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST") return false;
      throw error;
    }
    const temp = path.join(this.root, key + "-" + randomUUID() + ".tmp");
    try {
      const old = await this.get(key);
      if ((old?.version ?? null) !== expected) return false;
      await writeFile(
        temp,
        JSON.stringify({ version: (old?.version ?? 0) + 1, value }),
        { mode: 0o600 },
      );
      await rename(temp, path.join(this.root, key + ".json"));
      return true;
    } finally {
      await unlink(temp).catch(() => {});
      await lock.close();
      await unlink(lockPath);
    }
  }
}
// Small HTTP CAS contract, so a chosen durable store can replace local files
// without changing enquiry, consent or telephone workflows. See Phase 3 report.
export class HttpStore implements RecordStore {
  mode = "remote" as const;
  private base: string;
  private token: string;
  constructor(base: string, token: string) {
    this.base = base;
    this.token = token;
  }
  async get<T>(key: string): Promise<Document<T> | null> {
    const r = await fetch(`${this.base}/records/${validKey(key)}`, {
      headers: { Authorization: `Bearer ${this.token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (r.status === 404) return null;
    if (!r.ok) throw Error("Storage unavailable");
    const data = await r.json();
    if (
      !Number.isInteger(data.version) ||
      data.version < 1 ||
      !("value" in data)
    )
      throw Error("Invalid storage response");
    return data;
  }
  async put<T>(key: string, value: T, expected: number | null) {
    const r = await fetch(`${this.base}/records/${validKey(key)}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...(expected === null
          ? { "If-None-Match": "*" }
          : { "If-Match": String(expected) }),
      },
      body: JSON.stringify({ value }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (r.status === 409 || r.status === 412) return false;
    if (![200, 201, 204].includes(r.status))
      throw Error("Storage did not confirm persistence");
    return true;
  }
}
export function getStore(): RecordStore {
  const base = process.env.LEAD_STORE_URL;
  if (base && process.env.LEAD_STORE_TOKEN) {
    if (!base.startsWith("https://")) throw Error("Storage requires HTTPS");
    return new HttpStore(base.replace(/\/$/, ""), process.env.LEAD_STORE_TOKEN);
  }
  if (process.env.VERCEL) throw Error("storage_not_configured");
  return new FileStore(
    // Runtime-only development records are never deployable application assets.
    path.resolve(
      /* turbopackIgnore: true */ process.env.LEAD_LOCAL_DIR || ".local-data",
    ),
  );
}
