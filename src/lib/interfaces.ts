import type { ReactNode, ElementType } from 'react';

// ============================================================
// TYPES GÉNÉRIQUES
// ============================================================

export type DateLike = Date | string | number | null | undefined;
export type ConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
export type LearningConfigStatus = 'pending' | 'active' | 'ended' | 'cancelled';
export type ToastType = 'success' | 'error' | 'info';

export interface StatusConfigItem {
  color: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
  label: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface Stats {
  totalTransactions: number;
  totalSpent: number;
}

// ============================================================
// OFFRES / PAIEMENTS / TRANSACTIONS
// ============================================================

export interface Offering {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  offeringId: string;
  _id?: string;
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OfferingAlternative {
  offeringId: string;
  quantity: number;
  name?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
  _id?: string;
}

export interface WalletOffering {
  offeringId: string;
  quantity: number;
  name: string;
  price: number;
}

export interface OfferingDetails {
  _id: string;
  name: string;
  price: number;
}

export interface TransactionItem {
  offeringId: OfferingDetails | string;
  quantity?: number;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  name?: string;
  category?: unknown;
}

export interface Payment {
  id: string;
  reference: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  completedAt?: string;
}

export interface Transaction {
  offeringId: unknown;
  _id: string;
  transactionId: string;
  paymentToken: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  completedAt: string;
  items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
  type?: 'purchase' | 'consumption' | 'refund';
  metadata?: Record<string, unknown>;
}

// ============================================================
// UTILISATEURS / RÔLES / PERMISSIONS
// ============================================================

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export enum Permission {
  CREATE_USER = 'CREATE_USER',
  READ_USER = 'READ_USER',
  READ_ANY_USER = 'READ_ANY_USER',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_ANY_USER = 'UPDATE_ANY_USER',
  DELETE_USER = 'DELETE_USER',
  DELETE_ANY_USER = 'DELETE_ANY_USER',
  CREATE_CONSULTATION = 'CREATE_CONSULTATION',
  READ_CONSULTATION = 'READ_CONSULTATION',
  READ_ANY_CONSULTATION = 'READ_ANY_CONSULTATION',
  UPDATE_CONSULTATION = 'UPDATE_CONSULTATION',
  UPDATE_ANY_CONSULTATION = 'UPDATE_ANY_CONSULTATION',
  DELETE_CONSULTATION = 'DELETE_CONSULTATION',
  ASSIGN_CONSULTANT = 'ASSIGN_CONSULTANT',
  COMPLETE_CONSULTATION = 'COMPLETE_CONSULTATION',
  CREATE_SERVICE = 'CREATE_SERVICE',
  READ_SERVICE = 'READ_SERVICE',
  UPDATE_SERVICE = 'UPDATE_SERVICE',
  DELETE_SERVICE = 'DELETE_SERVICE',
  CREATE_PAYMENT = 'CREATE_PAYMENT',
  READ_PAYMENT = 'READ_PAYMENT',
  READ_ANY_PAYMENT = 'READ_ANY_PAYMENT',
  REFUND_PAYMENT = 'REFUND_PAYMENT',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_LOGS = 'VIEW_LOGS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  MANAGE_PERMISSIONS = 'MANAGE_PERMISSIONS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
}

export interface User {
  _id?: string;
  nom: string;
  prenoms: string;
  username: string;
  gender: 'male' | 'female';
  country: string;
  phone: string;
  dateNaissance?: Date;
  paysNaissance?: string;
  villeNaissance?: string;
  heureNaissance?: string;
  password?: string;
  role?: Role;
  secretCode?: string;
  createdAt: string | number | Date;
  customPermissions?: Permission[];
  address?: string;
  city?: string;
  isActive?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  preferences?: {
    language?: string;
    notifications?: boolean;
    newsletter?: boolean;
  };
  rating?: number;
  totalConsultations?: number;
  credits?: number;
  status?: string;
  consultationsCount?: number;
  avatar?: string;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface FormData {
  month?: string;
  year?: string;
  day?: string;
  secretCode: string;
  nom: string;
  prenoms: string;
  dateNaissance: string;
  country: string;
  phone?: string;
  gender?: string;
}

// ============================================================
// CONSULTATIONS / GAME CONFIG / LEARNING CONFIG
// ============================================================

export interface Consultation {
  _id: string;
  userId: string;
  clientId?: {
    nom: string;
    prenoms: string;
    _id: string;
    phone?: string;
    email?: string;
    username: string;
    country: string;
  };
  paymentId?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  timeSpent: string;
  idjeu: string | GameConfiguration;
  edition: unknown;
  id?: string;
  nombredevues: number;
  [key: string]: unknown;
}

export interface GameConfiguration {
  id?: string;
  _id?: string;
  startgameDate: Date;
  endgameDate: Date;
  isActive: boolean;
  status: ConfigStatus;
}

export interface LearningConfiguration {
  id?: string;
  _id?: string;
  startgameDate: Date;
  endgameDate: Date;
  proclamationDate?: Date;
  sequence?: string;
  niveau?: number;
  numeromatch?: string;
  tpsglobal?: number;
  pieces?: string[];
  isActive: boolean;
  status: LearningConfigStatus;
  createdAt?: Date;
  updatedAt?: Date;
  themeId?: number;
  nombredejeu?: number;
  isMatchOver?: boolean;
}

// ============================================================
// WINNERS / STATISTIQUES
// ============================================================

export interface LastEndedGame {
  id: string;
  isActive: boolean;
  status: string;
  startgameDate: string;
  endgameDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Winner {
  country: string;
  consultationId: string;
  clientId: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  combination: string;
  timeSpent: number;
  createdAt: string;
  rank: number;
}

export interface ActiveEdition {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  winningCombination?: string;
}

export interface WinnersData {
  exact: Winner[];
  disordered: Winner[];
  totalExact: number;
  totalDisordered: number;
  totalWinners: number;
}

export interface StatisticsData {
  totalConsultations: number;
  totalParticipants: number;
  uniqueParticipants: number;
  successRate: {
    exact: number;
    disordered: number;
    overall: number;
  };
  digits: {
    frequency: Record<string, number>;
    mostFrequent: Array<{ digit: number; count: number; percentage: number }>;
    leastFrequent: Array<{ digit: number; count: number; percentage: number }>;
  };
  timeStats: {
    average: number;
    fastest: {
      time: number;
      clientId: string | null;
      username: string | null;
      combination: string | null;
    };
    slowest: {
      time: number;
      clientId: string | null;
      username: string | null;
      combination: string | null;
    };
    distribution: {
      under30s: number;
      under60s: number;
      under120s: number;
      over120s: number;
    };
  };
  combinations: {
    totalUnique: number;
    mostCommon: Array<{ combination: string; count: number; percentage: number }>;
    diversity: number;
  };
  topParticipants: Array<{
    clientId: string;
    username: string;
    participations: number;
  }>;
  medals: {
    gold: Winner | null;
    silver: Winner | null;
    bronze: Winner | null;
  };
}

export interface EndedGameResponse {
  consultations: Consultation[];
  activeEdition: ActiveEdition;
  winners: WinnersData | null;
  statistics: StatisticsData | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LastEndedResponse {
  success: boolean;
  hasEndedEdition: boolean;
  configuration: LastEndedGame;
}

export interface EditionInfo {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  isActive: boolean;
  winningCombination: string | null;
}

// ============================================================
// UI / REPORTING
// ============================================================

export interface ReportMetric {
  label: string;
  value: string | number;
  change: number;
  icon: ReactNode;
  color: string;
  subLabel?: string;
}

export interface DateRange {
  value: string;
  label: string;
  icon?: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// ============================================================
// MATCHS / COMPÉTITIONS (harmonisé Lolomaths)
// ============================================================

/**
 * Un match (partie) dans une compétition.
 * Équivalent Kotlin : une ligne de la table `partie`.
 */
export interface MatchInfo {
  id?: string;                     // idpartie
  tournamentId?: string;           // idtournoi
  matchNumber?: number;            // numordrep
  numeromatch?: string;            // numeromatch
  score?: number;                  // score du match
  isgameover?: boolean;            // isgameover
  niveau?: number;                 // Dtfil (0..3)
  timeSpent?: number;              // temps écoulé (secondes)
  datedebut?: string | null;       // datedebut
  datefin?: string | null;         // datefin
  /** Liste des jeux joués dans ce match (rempli côté client). */
  jeux?: GameRecord[];
}

/**
 * Résultat simplifié d'un match (utilisé pour l'affichage).
 */
export interface MatchResult {
  matchNumber: number;
  score: number;
  timeSpent?: number;
}

/**
 * Une compétition complète.
 * Équivalent Kotlin : une ligne de la table `tournoi`.
 */
export interface CompetitionInfo {
  id: string;                      // idtournoi
  displayName: string;             // nom affiché
  name?: string;                   // nom optionnel (fallback)
  consultationId?: string;         // id de la consultation associée
  idConfig?: string;               // id de la configuration

  // Métadonnées du tournoi
  nomjoueur?: string;              // nomjoueur
  numtournoi?: string;             // numtournoi
  niveau?: number;                 // Dtfil (0..3)
  couleurs?: number;               // themeId
  nombredejeu?: number;            // nombredejeu (jeux par match)
  nbmatch?: number;                // nbmatch (nb total de matchs)
  tempsmatch?: string;             // "-1", "5", "10"...
  tpsglobal?: number;              // 0 ou 1

  // Dates et score
  datedebut: string;               // datedebut
  datefin: string;                 // datefin
  timeSpent?: number;              // temps total (secondes)
  totalScore?: number;             // score total
  isgameover?: boolean;            // isgameover

  // Matchs
  matchInfo: MatchInfo[];
  matches?: MatchResult[];

  // État de validation
  isValidated?: boolean;
}

export interface GameCompletionState {
  isCompletelyFinished: boolean;
  isWaitingForProclamation: boolean;
  isProclamationPassed: boolean;
}

export interface GameState {
  status:
    | 'no_competition'
    | 'not_started'
    | 'active'
    | 'results_available'
    | 'ended_no_proclamation';
  canUserPlay: boolean;
  showGameFinishedBanner: boolean;
  countdown: number | null;
}

export interface TournamentSummary {
  id: string;
  tournamentNumber: string;
  playerName: string;
  level: number;
  matchTime: string;
  isGlobalTime: boolean;
  gamesPerMatch: number;
  totalMatches: number;
  startedAt: string;
  endedAt?: string;
  isGameOver: boolean;
  totalScore?: number | 'xxx';
}

// ============================================================
// ENUMS JEU (transposition Kotlin)
// ============================================================

export enum Direction {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}

export enum DifficultyLevel {
  MINIME = 'MINIME',
  CADET = 'CADET',
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
}

export enum CellState {
  EMPTY = 'EMPTY',
  LOCKED = 'LOCKED',
  PLACED = 'PLACED',
  SELECTED = 'SELECTED',
}

export enum MovementSense {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type SensoryDirection = 'Up' | 'Down' | 'Left' | 'Right';

export enum StateCase {
  Cre = 'Cre',
  Pla = 'Pla',
  Choi = 'Choi',
  Lo = 'Lo',
}

export enum Sens {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

export enum Direc {
  Hor = 'Hor',
  Ver = 'Ver',
}

export enum Dtfil {
  Min = 0,
  Cad = 1,
  Jun = 2,
  Sen = 3,
}

/**
 * Type de case :
 *  - Plateau = case du plateau (tca = 1 en Kotlin)
 *  - PionChiffre = pion nombre dans le rack (tca = 2 en Kotlin)
 *  - PionOperateur = pion opérateur dans le rack (tca = 3 en Kotlin)
 */
export enum TypeCase {
  Plateau = 1,
  PionChiffre = 2,
  PionOperateur = 3,
}

export interface UneCase {
  ncase: number;
  indi: number; // Colonne (0..12)
  indj: number; // Ligne (0..16)
  txt: string;
  itxt: string;
  etat: StateCase;
  tca: TypeCase;
  placep?: number;
  isbou?: boolean;
  isTarget?: boolean;
}

export interface GameResult {
  nbreatind: number;
  result: number;
  notedbase: number;
  bonus: number;
  notedjeu: number;
  combine: string;
  targetCase: UneCase;
  /** Ncase de chaque case de la séquence validée (pour verrouillage sélectif). */
  sequenceNcases: number[];
}

export interface GameScore {
  baseScore: number;
  result: number;
  gameScore: number;
  targetNumber: number;
  bonus: number;
  combination?: string;
}

export interface GameMatrix {
  name: string;
  cells: string[];
  numbers: string[];
  operators: string[];
}

// ============================================================
// THÈMES
// ============================================================

export interface BoardTheme {
  id: number;
  name: string;
  cellBgColor: string;
  lockedCellBgColor: string;
  placedPawnBgColor: string;
  startCellBgColor: string;
  selectedCellBgColor: string;
  cellBorderColor: string;
  normalPawnBgColor: string;
  hoverPawnBgColor: string;
}

export function parseTheme(rawJson: Record<string, unknown>): BoardTheme {
  const getStringColor = (key: string, fallback: string) =>
    typeof rawJson[key] === 'string' && rawJson[key]
      ? (rawJson[key] as string)
      : fallback;

  return {
    id: typeof rawJson.numero === 'number' ? rawJson.numero : 0,
    name: typeof rawJson.nom === 'string' ? rawJson.nom : 'Thème par défaut',
    cellBgColor: getStringColor('coulfondcase', '#ffffff'),
    lockedCellBgColor: getStringColor('coulfondcaseverouille', '#9ca3af'),
    placedPawnBgColor: getStringColor('coulfondpionplace', '#22c55e'),
    startCellBgColor: getStringColor('coulfondcasedepart', '#eab308'),
    selectedCellBgColor: getStringColor('coulfondcaseselectionne', '#3b82f6'),
    cellBorderColor: getStringColor('coulbordurecase', '#cbd5e1'),
    normalPawnBgColor: getStringColor('coulfondpionnormal', '#f8fafc'),
    hoverPawnBgColor: getStringColor('coulfondpionover', '#6366f1'),
  };
}

// ============================================================
// TOURNOIS / MATCHS (modèles internes)
// ============================================================

export interface MatchModel {
  id: string;
  tournamentId: string;
  orderIndex: number;
  isGameOver: boolean;
  userId?: string;
  partId?: string;
  tourId?: string;
  matchNumber?: string;
  startedAt: Date;
  endedAt?: Date;
  score?: string;
}

export interface TournamentModel {
  id: string;
  playerName: string;
  tournamentNumber: string;
  matchTimeLimit: string;
  isGlobalTime: boolean;
  level: DifficultyLevel;
  colorThemeId: number;
  gamesPerMatch: number;
  totalMatches: number;
  isGameOver: boolean;
  startedAt: Date;
  endedAt?: Date;
  tourId?: string;
  userId?: string;
  score?: string;
}

export interface CreateTournamentDto {
  playerName: string;
  matchTimeLimit: string;
  isGlobalTime: boolean;
  level: DifficultyLevel;
  tournamentNumber: string;
  colorThemeId: number;
  gamesPerMatch: number;
  totalMatches: number;
}

export interface TournamentFormState {
  playerName: string;
  tournamentNumber: string;
  matchesCount: number;
  timeLimit: string;
  gamesPerMatch: number;
  isGlobalTime: boolean;
  themeId: number;
  matrixLevelIndex: number;
  customMatchNumbers: string[];
}

export const DEFAULT_FORM_STATE: TournamentFormState = {
  playerName: '',
  tournamentNumber: '',
  matchesCount: 1,
  timeLimit: '5',
  gamesPerMatch: 1,
  isGlobalTime: false,
  themeId: 0,
  matrixLevelIndex: 0,
  customMatchNumbers: [],
};

// ============================================================
// MENU / UI DIVERS
// ============================================================

export interface MainMenuItem {
  id: 'nouveau' | 'scores' | 'aide';
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const MAIN_MENU_ITEMS: MainMenuItem[] = [
  {
    id: 'aide',
    title: 'Aide',
    description: 'Apprendre Lolomaths - Règles et tutoriels',
    href: '/help',
    icon: 'question-mark-circle',
  },
  {
    id: 'scores',
    title: 'Scores',
    description: 'Consulter vos statistiques',
    href: '/star/scores',
    icon: 'chart-bar',
  },
];

export interface FeatureItem {
  icon: ElementType;
  title: string;
  desc: string;
}

export interface PillItem {
  icon: ElementType;
  title: string;
  desc: string;
  tooltip?: string;
}

export interface StepItem {
  icon: ElementType;
  title: string;
  desc: string;
}

export interface TipItem {
  icon: ElementType;
  title: string;
  desc: string;
  color: 'purple' | 'indigo';
}

export type CityItem = {
  id: string;
  name: string;
  countryName?: string;
  countryCode?: string;
  region?: string;
};

// ============================================================
// HISTORIQUE LOCAL (Lolomaths)
// ============================================================

/**
 * Un jeu joué (un coup validé).
 * Équivalent Kotlin : une ligne de la table `jeu`.
 */
export interface GameRecord {
  id: string;                      // identifiant unique
  matchId: string;                 // idpartie
  tournamentId: string;            // idtournoi
  numjeu: number;                  // cnbjeu (1, 2, 3...)
  combinaison: string;             // "3+4*2"
  sequencePions: string;           // "ncase1,ncase2,..." ou "ncase,txt,..."
  cible: number;                   // nbreatind
  resultat: number;                // result
  notedebase: number;              // notedebase
  bonus: number;                   // bonus
  notejeu: number;                 // notedjeu
  niveau: number;                  // Dtfil (0..3)
  dateCreation: string;            // ISO
}

/**
 * Un match (partie) dans un tournoi.
 * Équivalent Kotlin : une ligne de la table `partie`.
 */
export interface MatchRecord {
  id: string;                      // idpartie
  tournamentId: string;            // idtournoi
  numordrep: number;               // numordrep
  numeromatch: string;             // numeromatch
  score: number;                   // score total du match
  isGameOver: boolean;             // isgameover
  datedebut: string;               // ISO
  datefin: string | null;          // ISO
  jeux: GameRecord[];
}

/**
 * Un tournoi complet.
 * Équivalent Kotlin : une ligne de la table `tournoi`.
 */
export interface TournamentRecord {
  id: string;                      // idtournoi
  nomjoueur: string;               // nomjoueur
  numtournoi: string;              // numtournoi
  niveau: number;                  // Dtfil (0..3)
  couleurs: number;                // themeId
  nombredejeu: number;             // jeux par match
  nbmatch: number;                 // nb total de matchs
  tempsmatch: string;              // "-1" ou "5", "10"...
  tpsglobal: number;               // 0 ou 1
  isgameover: boolean;             // isgameover
  score: number;                   // score total
  datedebut: string;               // ISO
  datefin: string | null;          // ISO
  matchs: MatchRecord[];
}