import { LexiconItem, RuleItem, BonusItem } from '@/lib/lolomaths/interfaces';

export const LEXICON_DATA: LexiconItem[] = [
    { term: 'Opérateurs', definition: 'Ce sont les signes d\'Addition (+), de Soustraction (-), de Multiplication (×) et de Division (÷).' },
    { term: 'Plateau', definition: 'Le plateau est constitué de cases comportant des nombres et une case "Départ".' },
    { term: 'Pions de nombre', definition: 'Ce sont les pions marqués de nombres (6 pions par jeu).' },
    { term: 'Pions d\'opérateur', definition: 'Ce sont les pions marqués d\'opérateurs (6 pions par jeu).' },
    { term: 'Nombres du plateau', definition: 'Ce sont les nombres inscrits dans les cases du plateau.' },
    { term: 'Combinaison de pions', definition: 'C\'est l\'agencement (en ligne ou en colonne) sur le plateau de pion(s) de nombre et de pion(s) d\'opérateur. Une combinaison débute et finit par un pion de nombre.' },
    { term: 'Jeu', definition: 'C\'est la combinaison de pions validée.' },
    { term: 'Match', definition: 'C\'est l\'ensemble de jeux.' },
];

export const BASIC_RULES: RuleItem[] = [
    { title: 'Alternance des nombres', description: 'Pas de juxtaposition de deux pions de nombre.' },
    { title: 'Alternance des opérateurs', description: 'Pas de juxtaposition de deux pions d\'opérateur.' },
    { title: 'Fermeture propre', description: 'Pas de mise d\'un pion d\'opérateur en bout de combinaison.' },
    { title: 'Emplacement unique', description: 'Pas de superposition de pions sur la même case.' },
];

export const BONUS_DATA: BonusItem[] = [
    { condition: 'Résultat strictement égal au nombre à atteindre', points: '5' },
    { condition: '7 pions utilisés', points: '1' },
    { condition: '8 pions utilisés', points: '2' },
    { condition: '9 pions utilisés', points: '3' },
    { condition: '10 pions utilisés', points: '4' },
    { condition: 'Nombre à atteindre ≥ 30 (Niveau 1)', points: '1' },
    { condition: 'Nombre à atteindre ≥ 100 (Niveau 2)', points: '1' },
    { condition: 'Nombre à atteindre ≥ 200 (Niveau 3)', points: '1' },
    { condition: 'Nombre à atteindre ≥ 300 (Niveau 4)', points: '1' },
    { condition: 'Première utilisation de × ou ÷ sur le plateau', points: '1' },
];