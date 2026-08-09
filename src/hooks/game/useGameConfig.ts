

export const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return mins > 0
        ? `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`
        : `${secs}.${tenths}s`;
};

export type ToastType = 'success' | 'error' | 'info';

export type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

export type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
export type DateLike = Date | string | number | null | undefined;
export const DEFAULT_FORM_STATUS: ConfigStatus = 'pending';
 
  