import { TRPCError } from "@trpc/server";

import pdf from "pdf-parse";

export async function processFile(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid file type "${file.type}". Only PDF files are allowed.`,
    });
  }

  if (file.size === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `File "${file.name}" is empty and cannot be processed.`,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { text } = await pdf(buffer);

  return text;
}
