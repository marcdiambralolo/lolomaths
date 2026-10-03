import type { ReactNode, ElementType } from 'react';

// ============================================================
// TYPES GÉNÉRIQUES / UTILITAIRES
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
  winningCombination: string;
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

export interface MatchResult {
  matchNumber: number;
  type: string;
  score: number;
  timeSpent?: number;
  trouves?: number;
  rates?: number;
}

export interface MatchInfo {
  id?: string;
  timeSpent?: number;
  matchNumber?: number;
  competitionId?: string;
  score?: number;
  entite?: number;
  niveau?: number;
  numeromatch?: string;
  isgameover?: boolean;
  datedebut?: string | null;
  datefin?: string | null;
}

export interface CompetitionInfo {
  niveau: unknown;
  id: string;
  datedebut: string;
  datefin: string;
  idConfig: string;
  matchInfo: MatchInfo[];
  consultationId: string;
  timeSpent?: number;
  name?: string;
  matches?: MatchResult[];
  totalScore?: number;
  isValidated?: boolean;
  displayName: string;
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
// ENUMS JEU
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

// ============================================================
// MODÈLES DE JEU (Kotlin → TS)
// ============================================================

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

export interface UneCase {
  ncase: number;
  indi: number; // Colonne (0..12)
  indj: number; // Ligne (0..16)
  txt: string;
  itxt: string;
  etat: StateCase;
  tca: 1 | 2 | 3; // 1 = Case Plateau, 2 = Pion Chiffre, 3 = Pion Opérateur
  placep?: number;
  isbou?: boolean;
}

export interface GameResult {
  nbreatind: number;
  result: number;
  notedbase: number;
  bonus: number;
  notedjeu: number;
  combine: string;
  targetCase: UneCase;
}

export interface GameScore {
  baseScore: number; // notedebase
  result: number; // result
  gameScore: number; // notedjeu
  targetNumber: number; // nbreatind
  bonus: number; // bonus
  combination?: string; // combine
}

export interface GameMatrix {
  name: string; // nom
  cells: string[]; // cases
  numbers: string[]; // nbre
  operators: string[]; // oper
}

// ============================================================
// THÈMES
// ============================================================

export interface BoardTheme {
  id: number; // numero
  name: string; // nom
  cellBgColor: string; // coulfondcase
  lockedCellBgColor: string; // coulfondcaseverouille
  placedPawnBgColor: string; // coulfondpionplace
  startCellBgColor: string; // coulfondcasedepart
  selectedCellBgColor: string; // coulfondcaseselectionne
  cellBorderColor: string; // coulbordurecase
  normalPawnBgColor: string; // coulfondpionnormal
  hoverPawnBgColor: string; // coulfondpionover
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
// TOURNOIS / MATCHS
// ============================================================

export interface MatchModel {
  id: string; // idpartie
  tournamentId: string; // idtournoi
  orderIndex: number; // numordrep
  isGameOver: boolean; // isgameover
  userId?: string; // iduser
  partId?: string; // idpart
  tourId?: string; // idtour
  matchNumber?: string; // numeromatch
  startedAt: Date; // datedebut
  endedAt?: Date; // datefin
  score?: string; // score
}

export function createMatch(
  tournamentId: string,
  orderIndex: number,
  matchNumber: string,
  tourId?: string
): Omit<MatchModel, 'id'> {
  return {
    tournamentId,
    orderIndex,
    matchNumber,
    tourId,
    isGameOver: false,
    startedAt: new Date(),
  };
}

export interface TournamentModel {
  id: string; // idtournoi
  playerName: string; // nomjoueur
  tournamentNumber: string; // numtournoi
  matchTimeLimit: string; // tempsmatch
  isGlobalTime: boolean; // tpsglobal
  level: DifficultyLevel; // niveau
  colorThemeId: number; // couleurs
  gamesPerMatch: number; // nombredejeu
  totalMatches: number; // nbmatch
  isGameOver: boolean; // isgameover
  startedAt: Date; // datedebut
  endedAt?: Date; // datefin
  tourId?: string; // idtour
  userId?: string; // iduser
  score?: string; // score
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

export function createTournament(
  dto: CreateTournamentDto
): Omit<TournamentModel, 'id'> {
  return {
    playerName: dto.playerName.slice(0, 20),
    tournamentNumber: dto.tournamentNumber,
    matchTimeLimit: dto.matchTimeLimit,
    isGlobalTime: dto.isGlobalTime,
    level: dto.level,
    colorThemeId: dto.colorThemeId,
    gamesPerMatch: dto.gamesPerMatch,
    totalMatches: dto.totalMatches,
    isGameOver: false,
    startedAt: new Date(),
  };
}

export interface TournamentFormState {
  playerName: string; // njoueur
  tournamentNumber: string; // numetour
  matchesCount: number; // nbrdmat
  timeLimit: string; // stpdjeu
  gamesPerMatch: number; // spnbjeu
  isGlobalTime: boolean; // globalrb / perkchrb
  themeId: number; // sptheme
  matrixLevelIndex: number; // spniv
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

export interface Case {
  ncase: number;
  indi: number;
  indj: number;
  txt: string;
  itxt: string;
  etat: StateCase;
  tca: 1 | 2 | 3;
  placep?: number;
  isbou?: boolean;
}