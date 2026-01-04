
export interface CalculationRow {
  id: string;
  n1: number;
  n2: number;
  n3: number;
  n4: number;
  result: number;
  timestamp: number;
}

export interface WoodAdvice {
  projectSuggestions: string[];
  estimatedWeight: {
    oak: number;
    pine: number;
    walnut: number;
  };
  summary: string;
}
