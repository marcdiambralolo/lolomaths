"use client";
import React from "react";
import InputField from "../../InputField";
import SearchIcon from "./SearchIcon";

const CityInput = ({
    id,
    label,
    value,
    placeholder,
    disabled,
    onChange,
    onKeyDown,
}: {
    id: string;
    label: string;
    value: string;
    placeholder: string;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
    <div className="relative">
        <InputField
            label={label}
            name={id}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
        />
        <SearchIcon />
    </div>
);

export default CityInput;