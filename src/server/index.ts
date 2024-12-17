import { initTRPC, TRPCError } from "@trpc/server";
import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { z } from "zod";

import cors from "cors";

import { env } from "../utils/env";

import { analyzeContents } from "../utils/analyze-contents";
import { processFile } from "../utils/process-file";

const t = initTRPC.create();

const appRouter = t.router({
  analyzeCandidate: t.procedure
    .input(z.instanceof(FormData))
    .mutation(async ({ input }) => {
      const contents: string[] = [];

      for (const file of input.values()) {
        if (file instanceof File) {
          const text = await processFile(file);
          contents.push(text);
        }
      }

      if (contents.length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "At least two files are required.",
        });
      }

      const result = await analyzeContents(contents);

      return {
        message: "success",
        result,
      };
    }),
});

export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
  onError(opts) {
    console.error("[Error]: ", opts.error.message);
  },
}).listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing server...");
  server.close(() => {
    console.log("Server closed.");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received. Closing server...");
  server.close(() => {
    console.log("Server closed.");
  });
});
