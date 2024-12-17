import { promises, constants } from "node:fs";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await promises.access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
