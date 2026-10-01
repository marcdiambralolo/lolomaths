export interface GameConfig {
  numbers: string[];
  operators: string[];
  niveau: number;
}

const DEFAULT_CONFIG: GameConfig = {
  numbers: ['12', '5', '3', '20', '8', '2'],
  operators: ['+', '-', '*', '/'],
  niveau: 3,
};

export const loadGameConfig = (): GameConfig => {
  try {
    const savedConfig = localStorage.getItem('lolomaths_config');
    if (!savedConfig) return DEFAULT_CONFIG;
    
    const config = JSON.parse(savedConfig);
    return {
      numbers: config.numbers ?? DEFAULT_CONFIG.numbers,
      operators: config.operators ?? DEFAULT_CONFIG.operators,
      niveau: config.niveau ?? DEFAULT_CONFIG.niveau,
    };
  } catch (e) {
    console.error('Erreur chargement config:', e);
    return DEFAULT_CONFIG;
  }
};