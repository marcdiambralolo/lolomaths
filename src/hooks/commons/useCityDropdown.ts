"use client";
import { useCitySearch } from "@/hooks/commons/useCitySearch";
import { CityItem } from "@/lib/interfaces";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CitySelectValue = {
    cityId?: string;
    cityName: string;
    countryName?: string;
    countryCode?: string;
};

const MIN_QUERY_LENGTH = 2;

export const useCityDropdown = ({
    value,
    countryValue,
    cityApiUrl,
    cityApiKey,
    limit,
    fallbackCities,
    onSelectCity,
}: {
    value: string;
    countryValue?: string;
    cityApiUrl: string;
    cityApiKey?: string;
    limit: number;
    fallbackCities: Array<{ name: string; countryName?: string }>;
    onSelectCity: (selected: CitySelectValue) => void;
}) => {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    const query = value.trim();
    const hasQuery = query.length >= MIN_QUERY_LENGTH;

    // Filtrer les villes de fallback
    const fallbackFiltered = useMemo(() => {
        if (!fallbackCities.length || !hasQuery) return [];
        const q = query.toLowerCase();
        return fallbackCities
            .filter((c) => c.name.toLowerCase().includes(q))
            .slice(0, limit)
            .map((c, idx) => ({
                id: `fallback_${idx}_${c.name}`,
                name: c.name,
                countryName: c.countryName,
            }));
    }, [fallbackCities, hasQuery, limit, query]);

    // Recherche de villes
    const { items, loading, netError } = useCitySearch({
        open,
        query,
        countryValue,
        cityApiUrl,
        cityApiKey,
        limit,
        fallbackFiltered,
    });

    const showDropdown = open && (loading || netError || items.length > 0 || (hasQuery && items.length === 0));

    // Sélectionner une ville
    const pickCity = useCallback(
        (city: CityItem) => {
            onSelectCity({
                cityId: city.id,
                cityName: city.name,
                countryName: city.countryName,
                countryCode: city.countryCode,
            });
            setOpen(false);
        },
        [onSelectCity]
    );

    // Fermer le dropdown au clic extérieur
    useEffect(() => {
        const onDocumentClick = (e: MouseEvent) => {
            const el = rootRef.current;
            if (!el) return;
            if (!el.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDocumentClick);
        return () => document.removeEventListener("mousedown", onDocumentClick);
    }, []);

    // Gestion des touches clavier
    const onKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && items.length === 1) {
                pickCity(items[0]);
            }
        },
        [items, pickCity]
    );

    // Ouvrir le dropdown lors de la saisie
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // La fonction onChangeText est passée depuis les props
            return e;
        },
        []
    );

    return {
        open,
        setOpen,
        rootRef,
        query,
        hasQuery,
        items,
        loading,
        netError,
        showDropdown,
        pickCity,
        onKeyDown,
        handleChange,
    };
};