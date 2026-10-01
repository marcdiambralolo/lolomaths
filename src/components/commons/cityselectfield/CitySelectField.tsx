"use client";
import { CitySelectValue, useCityDropdown } from "@/hooks/commons/useCityDropdown";
import React, { memo, useCallback } from "react";
import ErrorMessage from "../ErrorMessage";
import CityFieldContainer from "./components/CityFieldContainer";
import CityInput from "./components/CityInput";
import SuggestionsDropdown from "./components/SuggestionsDropdown";

interface CitySelectFieldProps {
  id: string;
  label: string;
  value: string;
  countryValue?: string;
  placeholder?: string;
  cityApiUrl: string;
  cityApiKey?: string;
  limit?: number;
  onChangeText: (nextValue: string) => void;
  onSelectCity: (selected: CitySelectValue) => void;
  error?: string;
  disabled?: boolean;
  fallbackCities?: Array<{ name: string; countryName?: string }>;
}

function CitySelectFieldBase({
  id,
  label,
  value,
  countryValue,
  placeholder = "Rechercher une ville…",
  cityApiUrl,
  cityApiKey,
  limit = 8,
  onChangeText,
  onSelectCity,
  error,
  disabled,
  fallbackCities = [],
}: CitySelectFieldProps) {
  const {
    setOpen,
    rootRef,
    query,
    items,
    loading,
    netError,
    showDropdown,
    pickCity,
    onKeyDown,
  } = useCityDropdown({
    value,
    countryValue,
    cityApiUrl,
    cityApiKey,
    limit,
    fallbackCities,
    onSelectCity,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeText(e?.target?.value ?? "");
      setOpen(true);
    },
    [onChangeText, setOpen]
  );

  return (
    <CityFieldContainer ref={rootRef}>
      <CityInput
        id={id}
        label={label}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
      />

      <SuggestionsDropdown
        show={showDropdown as boolean}
        loading={loading}
        netError={netError}
        items={items}
        query={query}
        onSelect={pickCity}
        limit={limit}
      />
      {error && <ErrorMessage message={error!} />}
    </CityFieldContainer>
  );
}

export const CitySelectField = memo(CitySelectFieldBase);