"use client";
import Loader from '@/app/loading';
import { Suspense } from 'react';
import WelcomePageClientContent from './components/WelcomePageClientContent';

export default function WelcomePageClient() {
  return (
    <Suspense fallback={<Loader />}>
      <WelcomePageClientContent />
    </Suspense>
  );
} 