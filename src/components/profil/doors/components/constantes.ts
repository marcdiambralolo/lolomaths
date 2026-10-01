export const DAYS = Array.from({ length: 31 }, (_, i) => {
    const value = String(i + 1);
    return { value, label: value };
});

export const MONTHS = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
];

export const YEARS = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: String(year), label: String(year) };
});

export const GENDER_OPTIONS = [
    { value: "", label: "Sélectionner" },
    { value: "male", label: "Homme" },
    { value: "female", label: "Femme" },
] as const;