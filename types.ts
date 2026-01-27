export type MarkType = 'Short' | '5' | '10';
export type ToneType = 'Formal' | 'Conversational' | 'Persuasive' | 'Analytical';

export interface FormData {
  question: string;
  marks: MarkType;
  subject: string;
  tone: ToneType;
}

export interface GenerationResult {
  id: string;
  prompt: FormData;
  answer: string;
  wordCount: number;
  timestamp: number;
}

export interface ChartDataPoint {
  name: string;
  words: number;
  marks: number; // roughly mapped from mark type for visualization
}