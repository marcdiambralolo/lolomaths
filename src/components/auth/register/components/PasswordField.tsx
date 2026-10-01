'use client';
import { Lock } from 'lucide-react';
import { RegisterInputField } from './RegisterInputField';
import { RegisterPasswordStrengthIndicator } from './RegisterPasswordStrengthIndicator';

interface PasswordFieldProps {
    password: string;
    showPassword: boolean;
    onTogglePassword: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 👈 1. Ajout du type
    error?: string;
    passwordStrength: number;
}

const PasswordField = ({ 
    password, 
    showPassword, 
    onTogglePassword, 
    onChange, // 👈 2. Récupération de la prop
    error, 
    passwordStrength 
}: PasswordFieldProps) => (
    <div>
        <RegisterInputField
            label="Mot de passe"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onChange} // 👈 3. Passage de la fonction onChange au lieu de () => {}
            error={error}
            placeholder=""
            icon={<Lock className="w-4 h-4" />}
            showPassword={showPassword}
            onTogglePassword={onTogglePassword}
        />
        {password && <RegisterPasswordStrengthIndicator strength={passwordStrength} />}
    </div>
);

export default PasswordField;