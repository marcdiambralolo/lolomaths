'use client';
import { useLoginForm } from '@/hooks/auth/login/useLoginForm';
import FormContainer from './components/FormContainer';
import FormHeader from './components/FormHeader';
import { LoginErrorAlert } from './components/LoginErrorAlert';
import { LoginInputField } from './components/LoginInputField';
import Logo from './components/Logo';
import RegisterLink from './components/RegisterLink';
import SecurityBadge from './components/SecurityBadge';
import SubmitButton from './components/SubmitButton';
import WelcomeDialog from './components/WelcomeDialog';

const LoginForm = () => {
  const {
    handleSubmit, error, isSubmitDisabled, isLoading, isPending,
    isHydrated, usernameProps, passwordProps,
    hasChosenAccount, setHasChosenAccount,
  } = useLoginForm();

  return (
    <>
      <WelcomeDialog
        open={isHydrated && !hasChosenAccount}
        onHasAccount={() => setHasChosenAccount(true)}
      />

      {hasChosenAccount && (
        <FormContainer>
          <Logo />
          <FormHeader />

          {error && <LoginErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <LoginInputField {...usernameProps} />
            <LoginInputField {...passwordProps} />

            <SubmitButton
              isSubmitDisabled={isSubmitDisabled}
              isHydrated={isHydrated}
              isLoading={isLoading}
              isPending={isPending}
            />
          </form>

          <div className="mt-6 space-y-4">
             <SecurityBadge />
            <RegisterLink />
           
          </div>
        </FormContainer>
      )}
    </>
  );
};

export default LoginForm;