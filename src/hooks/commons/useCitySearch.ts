import { CityItem } from "@/lib/interfaces";
import { useEffect, useRef, useState } from "react";

const DEBOUNCE_DELAY = 250;
const MIN_QUERY_LENGTH = 2;

const getObjectRecord = (value: unknown): Record<string, unknown> | null => {
    return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
};

const parseCities = (raw: unknown): CityItem[] => {
    const rawRecord = getObjectRecord(raw);
    const arr = Array.isArray(raw)
        ? raw
        : rawRecord?.data ?? rawRecord?.results ?? rawRecord?.items ?? [];
    if (!Array.isArray(arr)) return [];

    return arr
        .map((item): CityItem | null => {
            const x = getObjectRecord(item);
            if (!x) return null;

            const countryObj = getObjectRecord(x.country);
            const id = String(x.id ?? x._id ?? x.geonameId ?? x.cityId ?? x.place_id ?? x.name ?? "");
            const name = String(x.name ?? x.city ?? x.toponymName ?? x.label ?? "");
            if (!id || !name) return null;

            return {
                id,
                name,
                countryName: typeof (x.countryName ?? x.country ?? x.country_name ?? countryObj?.name) === 'string'
                    ? String(x.countryName ?? x.country ?? x.country_name ?? countryObj?.name)
                    : undefined,
                countryCode: typeof (x.countryCode ?? x.country_code ?? countryObj?.code) === 'string'
                    ? String(x.countryCode ?? x.country_code ?? countryObj?.code)
                    : undefined,
                region: typeof (x.region ?? x.adminName1 ?? x.state) === 'string'
                    ? String(x.region ?? x.adminName1 ?? x.state)
                    : undefined,
            };
        })
        .filter((item): item is CityItem => Boolean(item));
};

export const useCitySearch = ({
    open,
    query,
    countryValue,
    cityApiUrl,
    cityApiKey,
    limit,
    fallbackFiltered,
}: {
    open: boolean;
    query: string;
    countryValue?: string;
    cityApiUrl: string;
    cityApiKey?: string;
    limit: number;
    fallbackFiltered: CityItem[];
}) => {
    const [items, setItems] = useState<CityItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [netError, setNetError] = useState<string | null>(null);

    const lastQueryRef = useRef<string>("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isFetchingRef = useRef(false);

    const hasQuery = query.length >= MIN_QUERY_LENGTH;

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!open) {
            setItems([]);
            setLoading(false);
            setNetError(null);
            return;
        }

        if (!hasQuery) {
            setItems([]);
            setLoading(false);
            setNetError(null);
            return;
        }

        const qKey = `${query}__${countryValue ?? ""}`.toLowerCase();
        lastQueryRef.current = qKey;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setLoading(true);
        setNetError(null);

        timeoutRef.current = setTimeout(async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            try {
                const url = typeof window === 'undefined'
                    ? new URL(cityApiUrl, 'http://localhost')
                    : new URL(cityApiUrl, window.location.origin);

                url.searchParams.set("query", query);
                url.searchParams.set("limit", String(limit));
                if (countryValue) url.searchParams.set("country", countryValue);

                const res = await fetch(url.toString(), {
                    method: "GET",
                    headers: cityApiKey ? { Authorization: `Bearer ${cityApiKey}` } : undefined,
                });

                if (lastQueryRef.current !== qKey) return;

                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();

                const parsed = parseCities(json);
                setItems(parsed);
                setLoading(false);
                setNetError(null);
            } catch (err: unknown) {
                if (lastQueryRef.current !== qKey) return;

                if (fallbackFiltered.length) {
                    setItems(fallbackFiltered);
                    setLoading(false);
                    setNetError(null);
                    return;
                }
                setItems([]);
                setLoading(false);
                setNetError("Impossible de charger les villes");
            } finally {
                isFetchingRef.current = false;
            }
        }, DEBOUNCE_DELAY);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cityApiUrl, cityApiKey, countryValue, fallbackFiltered, hasQuery, limit, open, query]);

    return { items, loading, netError };
};