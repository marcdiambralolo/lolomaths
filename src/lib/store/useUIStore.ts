import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_NAME = 'lolomaths-ui';
const CURRENT_VERSION = 1;

interface UIState {
  afficheChoix: boolean;
  idEditionencours: string | null;
  setAfficheChoix: (value: boolean) => void;
  setIdEditionencours: (id: string | null) => void;
}

const INITIAL_STATE = {
  afficheChoix: false,
  idEditionencours: null as string | null,
};

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      setAfficheChoix: (value) => set({ afficheChoix: value }),
      setIdEditionencours: (id) => set({ idEditionencours: id }),
    }),
    {
      name: STORAGE_NAME,
      version: CURRENT_VERSION,
      partialize: (state) => ({
        afficheChoix: state.afficheChoix,
        idEditionencours: state.idEditionencours,
      }),
    }
  )
);