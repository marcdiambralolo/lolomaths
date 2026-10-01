"use client";
import { Shield } from "lucide-react";
import PhoneInput from "./PhoneInput";
import SecretCodeInput from "./SecretCodeInput";

const SecurityHeader = () => (
    <div className="mb-3 flex items-center gap-2">
        <Shield className="h-5 w-5 text-purple-600" />
        <span className="text-sm font-bold text-purple-700 dark:text-purple-400">
            Sécurité de vos gains
        </span>
    </div>
);

const SecurityFields = ({
    secretCode,
    phone,
    onSecretCodeChange,
    onPhoneChange,
    errors,
}: {
    secretCode: string;
    phone: string;
    onSecretCodeChange: (code: string) => void;
    onPhoneChange: (phone: string) => void;
    errors: any;
}) => (
    <div className="mb-1 w-full rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-4 dark:from-purple-950/30 dark:to-indigo-950/30">
        <SecurityHeader />
        <div className="grid grid-cols-1 gap-4">
            <SecretCodeInput
                value={secretCode}
                onChange={onSecretCodeChange}
                error={errors.secretCode}
            />

            <PhoneInput
                value={phone}
                onChange={onPhoneChange}
                error={errors.phone}
            />
        </div>
    </div>
);

export default SecurityFields;