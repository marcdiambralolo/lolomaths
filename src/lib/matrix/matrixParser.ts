// lib/matrix/matrixParser.ts

import { GameMatrix } from "../interfaces";

 

export function parseGameMatrix(rawJson: unknown): GameMatrix {
  if (typeof rawJson !== 'object' || rawJson === null) {
    throw new Error('Format JSON invalide pour la matrice');
  }

  const obj = rawJson as Record<string, unknown>;

  const parseStringArray = (arr: unknown): string[] => {
    if (!Array.isArray(arr)) return [];
    return arr
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  };

  return {
    name: typeof obj.nom === 'string' ? obj.nom : 'Matrice Sans Nom',
    cells: Array.isArray(obj.cases) ? obj.cases.map(String) : [],
    numbers: parseStringArray(obj.nombres),
    operators: parseStringArray(obj.operateurs),
  };
}