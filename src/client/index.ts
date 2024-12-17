import { createTRPCClient, httpLink } from "@trpc/client";
import { resolve } from "node:path";

import { env } from "../utils/env";

import { fileExists } from "../utils/file-exist";
import { createPDFBlob } from "../utils/create-pdf-blob";

import type { AppRouter } from "../server";

const trpc = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: `http://localhost:${env.PORT}`,
    }),
  ],
});

const FILES = {
  cv: {
    path: resolve(__dirname, "../../content/cv.pdf"),
    name: "cv.pdf",
  },
  jobDescription: {
    path: resolve(__dirname, "../../content/job-description.pdf"),
    name: "job-description.pdf",
  },
};

async function uploadPDFs() {
  try {
    const formData = new FormData();

    for (const [key, file] of Object.entries(FILES)) {
      if (!(await fileExists(file.path))) {
        console.error(`File not found: ${file.path}`);
        throw new Error(`Missing file: ${file.name}`);
      }

      console.log(`Processing file: ${file.name}`);

      const blob = await createPDFBlob(file.path);
      formData.append(key, blob, file.name);
    }

    console.log("Uploading files...");

    const response = await trpc.analyzeCandidate.mutate(formData);

    console.log("Canidate analyze:\n");
    console.dir(response, { depth: 10 });
  } catch (error) {
    console.error("Error uploading PDFs:", error);
  }
}

uploadPDFs().catch(console.error);
