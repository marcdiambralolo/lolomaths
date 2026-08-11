'use client';
import { default as CacheLink } from '@/components/commons/CacheLink';
import { useRegisterForm } from '@/hooks/auth/register/useRegisterForm';
import { motion } from "framer-motion";
import { Loader2, Lock, User } from 'lucide-react';
import Image from "next/image";
import { default as React } from 'react';
import WelcomePageClient from '../login/welcome/WelcomePageClient';
import { RegisterErrorMessage } from './components/RegisterErrorMessage';
import { RegisterInputField } from './components/RegisterInputField';
import { RegisterPasswordStrengthIndicator } from './components/RegisterPasswordStrengthIndicator';

const RegisterForm: React.FC = () => {
  const {
    showPassword, showConfirmPassword, isSubmitDisabled, isLoading, isPending,
    error, passwordStrength, formData, passwordsMatch, errors, mounted,
    handleChange, handleSubmit, setShowConfirmPassword, setShowPassword, setError,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-2">
      <div className=" bg-white p-4">

        <div className="text-center mb-2">
          <CacheLink href="/" className="block group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <div className="relative w-80 h-10 overflow-hidden ">
                <Image
                  src="/logo.png"
                  alt="Diambra Puzzle"
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </CacheLink>

          <div className="mt-8 space-y-3 w-full">
            <div className="relative group w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative  p-2 hover:border-blue-200/50 transition-all duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1 text-center">
                  <span className="text-sm  font-medium">
                    Si vous possédez déjà un compte Diambra
                  </span>
                  <CacheLink
                    href="/auth/login"
                    className="inline-flex items-center gap-2 px-2  py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl  hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 group/link"
                  >
                    <span className="text-sm  font-medium">Cliquez ici</span>
                    <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </CacheLink>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Sinon, remplissez le formulaire ci-dessous, puis cliquez sur <br /> le bouton « S’inscrire ».
              </p>
            </div>
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

          <button
            type="submit"
            disabled={mounted ? isSubmitDisabled : false}
            className={`
                w-full py-3 rounded-xl font-semibold text-sm
                shadow-md hover:shadow-lg
                flex items-center justify-center gap-2 transition-all duration-200
                ${mounted && isSubmitDisabled
                ? 'bg-gray-200 text-gray-400 border border-blue-100 cursor-not-allowed'
                : 'border border-orange-200 bg-blue-600 text-white hover:from-blue-200 hover:to-blue-400'
              }
              `}
          >
            {mounted && (isLoading || isPending) ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Inscription...</span>
              </>
            ) : (
              <>
                <span>S'inscrire</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <CacheLink
            href="/terms"
            className="text-xs text-blue-700 font-semibold hover:underline transition-colors"
          >
            Conditions générales d'utilisation
          </CacheLink>
        </div>

      </div>
      <WelcomePageClient />
    </div>
  );
};

export default function RegisterPageClient() {
  return (<RegisterForm />);
}