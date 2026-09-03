import HelpPage from '@/components/aide/HelpPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aide & Règles du Jeu Lolomaths',
  description: 'Règles du jeu, lexique et système de notation pour maîtriser Lolomaths.',
};

export default function Aide() {

  return <HelpPage />;
}