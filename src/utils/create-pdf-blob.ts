import { promises } from "node:fs";

export async function createPDFBlob(filePath: string): Promise<Blob> {
  const fileContent = await promises.readFile(filePath);
  return new Blob([fileContent], { type: "application/pdf" });
}
