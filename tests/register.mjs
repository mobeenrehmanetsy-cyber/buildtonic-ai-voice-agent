// Test-process only: block paid/network calls and load TS without runtime dependencies.
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
globalThis.fetch = async () => {
  throw Error("Network calls are disabled in unit tests.");
};
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only")
      return {
        url: "data:text/javascript,export%20%7B%7D",
        shortCircuit: true,
      };
    if (
      specifier.startsWith(".") &&
      context.parentURL?.startsWith("file:") &&
      !/\.[a-z]+$/.test(specifier)
    ) {
      const url = new URL(specifier + ".ts", context.parentURL);
      if (existsSync(url)) return { url: url.href, shortCircuit: true };
    }
    return next(specifier, context);
  },
});
