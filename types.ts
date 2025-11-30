export enum MathOperation {
  ADD = '+',
  SUBTRACT = '-'
}

export interface MathState {
  num1: number;
  num2: number;
  operation: MathOperation;
  result: number;
}

export interface MathStoryResponse {
  story: string;
  emoji: string;
  steps: string[];
  encouragement: string;
}
