'use client';
import { GameState } from '@/lib/learning/interface';
import { useDiambraStore } from "@/lib/store/diambra.store";
import { useCallback, useEffect, useRef, useState } from 'react';
import useMatchManagement from './useMatchManagement';

const useGameState = () => {
    const [state, setState] = useState<GameState>({
        tpsglobal: 0,
        casesdujeuencours: [],
        casesinitiales: [],
        pieces: [],
        selectedCase: null,
        datedebut: "",
        start: false,
        showPun: false,
        punChangeCount: 0,
        matchEnCours: -1,
        infomatch: [],
        isGameover: false,
        isTransitioning: false,
    });

    const updateState = useCallback((updates: Partial<GameState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    return { state, setState, updateState };
};

export const useGameGenerator = () => {
    const { gameConfig } = useDiambraStore();
    const { state, setState, updateState } = useGameState();

    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (state.showPun) {
            setState(prev => ({
                ...prev,
                punChangeCount: (prev.punChangeCount || 0) + 1,
            }));
        }
    }, [state.showPun, setState]);

    useEffect(() => {
        if (!state.start) updateState({ start: true });
    }, [state.start, updateState]);

    const { timeElapsed } = useMatchManagement(state, setState, updateState);

   
    return {
        timeElapsed,
        punChangeCount: state.punChangeCount,
        casesdujeuencours: state.casesdujeuencours,
        casesinitiales: state.casesinitiales,
        pieces: state.pieces,
        selectedCase: state.selectedCase,
        showPun: state.showPun,
        tpsglobal: state.tpsglobal,
        niveau: gameConfig?.niveau,
    };
};

export default useGameGenerator;