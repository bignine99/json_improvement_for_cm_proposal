
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface CustomerRecord {
  [key: string]: any;
}

export interface InputData {
  id: string;
  customerRecord: CustomerRecord;
  chatTranscript: string;
  timestamp: number;
}

export interface MergedProfile {
  resolved_data: Record<string, any>;
  latest_sentiment: 'Positive' | 'Neutral' | 'Negative';
  identified_intent: string;
  updates_applied: string[]; 
  confidence_score: number;
}

export interface ProcessedResult {
  id: string;
  input: InputData;
  output: MergedProfile | null;
  logs: string[];
  durationMs: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}
