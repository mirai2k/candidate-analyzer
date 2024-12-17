import { TRPCError } from "@trpc/server";
import { env } from "./env";

export async function analyzeContents(contents: string[]) {
  const payload = {
    contents: contents.map((content) => ({
      parts: [{ text: content }],
      role: "user",
    })),
    systemInstruction: `
      Analyze the provided texts: one is a job description, and the other is a candidate's CV. Return the analysis in JSON format using the following schema for further processing:

      Schema:
      {
        "analysis": {
          "candidate_strengths": Array<string>,  // List of strengths identified in the candidate's CV
          "candidate_weaknesses": Array<string>, // List of weaknesses identified in the candidate's CV
          "alignment": {  // Detailed alignment analysis
            "skills_match": Array<string>,          // List of matching skills between CV and job description
            "skills_mismatch": Array<string>,       // List of skills missing in the candidate's profile
            "experience_match": Array<string>,      // List of matching experience points
            "experience_mismatch": Array<string>,   // List of missing or unmatched experience points
            "qualifications_match": Array<string>,  // List of matching qualifications
            "qualifications_mismatch": Array<string> // List of unmatched or missing qualifications
          },
          "suitability": string  // A summary describing how well the candidate aligns with the job description
        }
      }

      Instructions:
        1. Evaluate the candidate's strengths and weaknesses based on the CV.  
        2. Compare the candidate's skills, experience, and qualifications with the requirements in the job description.  
        3. Provide a detailed analysis of how well the candidate aligns with the job description and identify any gaps or mismatches.  
        4. Summarize the overall suitability of the candidate for the position.
    `,
  };

  try {
    const response = await fetch(env.GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: env.GEMINI_API_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `External API error: ${response.statusText}`,
      });
    }

    const result = await response.json();

    if (!result?.candidates?.[0]?.content?.parts[0]?.text) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Invalid response from external API.",
      });
    }

    return JSON.parse(
      result?.candidates?.[0]?.content?.parts[0]?.text.replace(
        /```json\n|```/g,
        ""
      )
    );
  } catch (error) {
    console.error("Error while calling internal API:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to communicate with the internal API.",
    });
  }
}
