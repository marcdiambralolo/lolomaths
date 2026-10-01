'use client';
import { useRegisterForm } from '@/hooks/auth/register/useRegisterForm';
import { Lock, User } from 'lucide-react';
import { default as React } from 'react';
import WelcomePageClientContent from '../../login/welcome/WelcomePageClient';
import Divider from './Divider';
import InstructionText from './InstructionText';
import LoginRedirectBanner from './LoginRedirectBanner';
import Logo from './Logo';
import PasswordField from './PasswordField';
import { RegisterErrorMessage } from './RegisterErrorMessage';
import { RegisterInputField } from './RegisterInputField';
import SubmitButton from './SubmitButton';
import TermsFooter from './TermsFooter';

const RegisterForm: React.FC = () => {
    const {
        showPassword, showConfirmPassword, isSubmitDisabled, isLoading, errors,
        isPending, error, passwordStrength, formData, passwordsMatch, mounted,
        handleChange, handleSubmit, setShowConfirmPassword, setShowPassword, setError,
    } = useRegisterForm();

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2">
            <div className="bg-white p-4">
                <div className="text-center mb-2">
                    <Logo />

                    <div className="mt-8 space-y-3 w-full">
                        <LoginRedirectBanner />
                        <Divider />
                        <InstructionText />
                    </div>
                </div>

                {error && <RegisterErrorMessage error={error} onClose={() => setError(null)} />}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <RegisterInputField
                        label="Email"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={errors.username}
                        placeholder="Entrez votre adresse e-mail."
                        icon={<User className="w-4 h-4" />}
                        showSuccess
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PasswordField
                            password={formData.password}
                            showPassword={showPassword}
                            onTogglePassword={() => setShowPassword(!showPassword)}
                            onChange={handleChange}
                            error={errors.password}
                            passwordStrength={passwordStrength}
                        />

                        <RegisterInputField
                            label="Confirmer"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            placeholder=""
                            icon={<Lock className="w-4 h-4" />}
                            showPassword={showConfirmPassword}
                            onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                            showSuccess={passwordsMatch}
                        />
                    </div>

                    <SubmitButton
                        mounted={mounted}
                        isSubmitDisabled={isSubmitDisabled}
                        isLoading={isLoading}
                        isPending={isPending}
                    />
                </form>

                <TermsFooter />
            </div>

            <WelcomePageClientContent />
        </div>
    );
};

export default RegisterForm;