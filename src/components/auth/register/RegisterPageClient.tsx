'use client';
import { useRegisterForm } from '@/hooks/auth/register/useRegisterForm';
import { Lock, User } from 'lucide-react';
import { default as React } from 'react';
import FormContainer from './components/FormContainer';
import FormHeader from './components/FormHeader';
import { RegisterErrorMessage } from './components/RegisterErrorMessage';
import { RegisterInputField } from './components/RegisterInputField';
import { RegisterPasswordStrengthIndicator } from './components/RegisterPasswordStrengthIndicator';
import SubmitButton from './components/SubmitButton';
import TermsFooter from './components/TermsFooter';

const RegisterForm: React.FC = () => {
  const {
    showPassword, showConfirmPassword, isSubmitDisabled, isLoading,
    isPending, error, passwordStrength, formData, passwordsMatch, errors, mounted,
    handleChange, handleSubmit, setShowConfirmPassword, setShowPassword, setError,
  } = useRegisterForm();

  return (
    <FormContainer>
      <FormHeader />

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
          <div>
            <RegisterInputField
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder=""
              icon={<Lock className="w-4 h-4" />}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
            {formData.password && <RegisterPasswordStrengthIndicator strength={passwordStrength} />}
          </div>

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

    </FormContainer>
  );
};

export default RegisterForm;