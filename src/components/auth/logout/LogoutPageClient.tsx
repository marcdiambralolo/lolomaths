'use client';
import { useLogoutPage } from "@/hooks/auth/logout/useLogoutPage";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { StarField } from "./components/StarField";
import { SuccessState } from "./components/SuccessState";

export default function LogoutPageClient() {
  const { progress, status } = useLogoutPage();

  const renderContent = (() => {
    switch (status) {
      case "loading": return <LoadingState progress={progress} />;
      case "success": return <SuccessState />;
      case "error": return <ErrorState />;
    }
  })();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#070B1A] via-[#0F1C3F] to-[#070B1A] p-3 sm:p-6">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-[#2E5AA6]/15 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ scale: [1.15, 1, 1.15], rotate: [60, 0, 60] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-[#4F83D1]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 sm:w-96 sm:h-96 bg-[#9BC2FF]/8 rounded-full blur-3xl"
        />
      </div>

      <StarField />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {renderContent}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="mt-5 sm:mt-6 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-xs sm:text-sm font-medium shadow-lg hover:bg-white/15 transition-colors cursor-default"
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Vos données sont protégées</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}