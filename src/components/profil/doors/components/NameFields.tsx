"use client";
import InputField from "@/components/commons/InputField";

const NameFields = ({
    nom,
    prenoms,
    onChange,
    errors,
}: {
    nom: string;
    prenoms: string;
    onChange: (e: any) => void;
    errors: any;
}) => (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <InputField
            label="Nom"
            name="nom"
            value={nom}
            onChange={onChange}
            error={errors.nom}
            placeholder="Votre nom de famille"
        />

        <InputField
            label="Prénoms"
            name="prenoms"
            value={prenoms}
            onChange={onChange}
            error={errors.prenoms}
            placeholder="Tous vos prénoms"
        />
    </div>
);

export default NameFields;