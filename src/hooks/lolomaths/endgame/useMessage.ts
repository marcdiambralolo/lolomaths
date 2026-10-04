'use client';

import { ValidationMessage } from '@/lib/learning/interface';
import { MESSAGE_DURATION } from '@/lib/learning/constantes';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useMessage = () => {
  const [message, setMessage] = useState<ValidationMessage | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = useCallback(
    (text: string, type: 'success' | 'error') => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMessage({ text, type });
      timeoutRef.current = setTimeout(
        () => setMessage(null),
        MESSAGE_DURATION
      );
    },
    []
  );

  const clearMessage = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { message, showMessage, clearMessage };
};