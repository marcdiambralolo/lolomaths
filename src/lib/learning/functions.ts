import { toSafeDate } from "./configUtils";
import { MATCH_TYPES } from "./constantes";
import { DateLike } from "./interface";
 

export const caldure = (dateFin: string, dateDebut: string) => {
  const diff = new Date(dateFin).getTime() - new Date(dateDebut).getTime();
  return Math.floor(diff / 1000) + " sec";
};
 
let cachedLetterPairs: string[] | null = null;

export const generateLetterPairs = (): string[] => {
  if (cachedLetterPairs) return cachedLetterPairs;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  cachedLetterPairs = alphabet
    .split("")
    .flatMap((a) => alphabet.split("").map((b) => a + b));

  return cachedLetterPairs;
};

 

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "00/00/0000 à 00h:00mn:00s";

  const datePart = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return `${datePart} à ${timePart}`;
};

export const choix = (tpsglobale: number): string =>
  ({ 0: "Nombre", 1: "Couleur", 2: "Image", 3: "Lettre" }[tpsglobale] || "Global");

export const niveauOptions = Array.from({ length: 9 }, (_, i) => i + 2);

export const optionOptions = [
  { value: 0, label: 'Manuel' },
  { value: 1, label: 'Automatique' }
]; 

  

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0s';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export function formatDateFR(value: DateLike): string {
  const date = toSafeDate(value, new Date());
  if (!isValidDate(date)) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year}` + " à " + `${hour}:${minute}:${second}`;
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}


export const getMatchType = (tpsglobal?: number): string => {
  if (tpsglobal === undefined) return 'Inconnu';
  return MATCH_TYPES[tpsglobal] ?? 'Inconnu';
};

export const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const diffInSeconds = Math.floor((end - start) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const minutes = Math.floor(diffInSeconds / 60);
  const seconds = diffInSeconds % 60;
  return `${minutes}m ${seconds}s`;
};

export const calculateDurationInSeconds = (startDate: string, endDate: string): number => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.floor((end - start) / 1000);
};

export const formatCompetitionDate = (dateStr?: string): string => {
  if (!dateStr) return 'Non définie';
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Date invalide' : date.toLocaleString();
  } catch {
    return 'Date invalide';
  }
};

export const parseTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;

  if (/^\d+$/.test(timeStr)) {
    return parseInt(timeStr, 10);
  }

  const match = timeStr.match(/(\d+(?:\.\d+)?)\s*(?:sec|s)?/i);
  return match ? parseFloat(match[1]) : 0;
};

export const formatTimeFromSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (restSeconds === 0) return `${minutes} min`;
  return `${minutes} min ${restSeconds} sec`;
};

export const formatRelativeDate = (dateStr: string): string => {
  if (!dateStr) return 'Date inconnue';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

export const formatDateHistorique = (dateStr: string): string => {
  if (!dateStr) return 'Date inconnue';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

const TIME_PATTERNS = [
  { regex: /(\d+)\s*h/, multiplier: 3600 },
  { regex: /(\d+)\s*m/, multiplier: 60 },
  { regex: /(\d+)\s*s/, multiplier: 1 },
  { regex: /^(\d+)$/, multiplier: 1 }
] as const;

export const extractSecondsFromTimeSpent = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  if (/^\d+$/.test(timeSpent)) {
    return parseInt(timeSpent, 10);
  }

  let totalSeconds = 0;
  for (const { regex, multiplier } of TIME_PATTERNS) {
    const match = timeSpent.match(regex);
    if (match) {
      totalSeconds += parseInt(match[1], 10) * multiplier;
    }
  }

  return totalSeconds;
};

export const formatSecondsToTime = (seconds: number): string => {
  if (seconds === 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};


export const formatToHMS = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts: string[] = [];
    parts.push(`${hours}h`);
    parts.push(`${minutes.toString().padStart(2, '0')}mn`);
    parts.push(`${seconds.toString().padStart(2, '0')}s`);

    return parts.join(' ');
};
 