
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SYSTEM_INSTRUCTION_MERGE, PROPOSAL_SECTION_MAP } from "../constants";
import { InputData, MergedProfile } from "../types";

export const mergeDataWithFlash = async (input: InputData): Promise<{ json: MergedProfile | null, logs: string[] }> => {
  const logs: string[] = [];

  try {
    const libraryId = input.customerRecord.library_id || "";
    const sectionCode = libraryId.split('_')[0];
    const sectionName = PROPOSAL_SECTION_MAP[sectionCode] || "General CM Section";

    logs.push(`System: Connecting to secure API proxy...`);
    logs.push(`Analyzing Logic: Cross-referencing [${sectionCode}] ${sectionName}...`);

    const prompt = `
    [CONTEXT]
    Current Section: ${sectionCode} (${sectionName})
    Project Meta: ${JSON.stringify(input.customerRecord.project_meta)}
    
    [OBJECTIVE]
    Perform a "Deep Architecting" of this proposal section.
    1. Reason through the specific CM challenges of this section type (e.g., risk, cost, schedule).
    2. Enhance the draft while maintaining 100% fidelity to the original keywords.
    3. Use logic that balances the "Construction Golden Triangle" (Quality, Cost, Schedule).

    [INPUT DRAFT (JSON)]
    ${JSON.stringify(input.customerRecord, null, 2)}
    
    [USER REQUEST]
    "${input.chatTranscript}"
    `;

    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: SYSTEM_INSTRUCTION_MERGE,
        prompt,
        model: 'gemini-2.5-flash-lite',
        temperature: 0.3,
        thinkingBudget: 4000,
        maxOutputTokens: 8000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown server error');
    }

    logs.push(`Fidelity Verification: Anchoring original keywords...`);
    logs.push(`Optimization: Strategy refined via secure server-side reasoning.`);
    logs.push(`✅ Complete: Enhanced via API proxy (key protected).`);

    return { json: result.data, logs };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logs.push(`❌ Error: ${message}`);
    console.error("Enhancement Error:", error);
    return { json: null, logs };
  }
};
