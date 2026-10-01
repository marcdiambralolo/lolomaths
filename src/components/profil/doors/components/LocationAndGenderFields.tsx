"use client";
import RegisterSelectField from "@/components/commons/RegisterSelectField";
import { GENDER_OPTIONS } from "./constantes";

const LocationAndGenderFields = ({
    country,
    gender,
    onChange,
    errors,
    countryOptions,
}: {
    country: string;
    gender: string;
    onChange: (e: any) => void;
    errors: any;
    countryOptions: any[];
}) => (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <RegisterSelectField
            label="Pays"
            name="country"
            value={country}
            onChange={onChange}
            error={errors.country}
            options={countryOptions}
        />
        <RegisterSelectField
            label="Genre"
            name="gender"
            value={gender}
            onChange={onChange}
            error={errors.gender}
            options={GENDER_OPTIONS}
        />
    </div>
);

export default LocationAndGenderFields;