import CacheLink from '@/components/commons/CacheLink';
import {
  AlertCircle,
  FileText,
  Gamepad2,
  Lock,
  Scale,
  Shield,
  Users
} from 'lucide-react';
import React from 'react';

export interface TermsSection {
  number: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  content: React.ReactNode;
}

// ============================================================
// Composants internes
// ============================================================

const List = React.memo(({ items }: { items: string[] }) => (
  <ul className="space-y-1.5 ml-4">
    {items.map((item, index) => (
      <li key={index} className="flex items-start gap-2">
        <span className="mt-1 flex-shrink-0 text-purple-500">•</span>
        <span className="text-purple-700">{item}</span>
      </li>
    ))}
  </ul>
));

List.displayName = 'List';

const SubTitle = React.memo(({ children }: { children: React.ReactNode }) => (
  <h4 className="font-bold text-purple-700 mt-3 mb-1.5">{children}</h4>
));

SubTitle.displayName = 'SubTitle';

const Highlight = React.memo(({ children }: { children: React.ReactNode }) => (
  <span className="font-bold text-purple-600">{children}</span>
));

Highlight.displayName = 'Highlight';

// ============================================================
// Hook principal
// ============================================================

export function useTermsSections(): TermsSection[] {
  return [
    // ============================================================
    // 1. ACCEPTATION DES CONDITIONS
    // ============================================================
    {
      number: '1',
      title: 'Acceptation des conditions',
      icon: Shield,
      iconColor: 'bg-purple-100 text-purple-600',
      content: (
        <>
          <p>
            En jouant à <Highlight>Lolomaths</Highlight>, vous acceptez pleinement
            et sans réserve les présentes conditions d&apos;utilisation.
            Si vous n&apos;acceptez pas ces conditions, vous devez cesser
            immédiatement d&apos;utiliser le jeu.
          </p>
          <p className="mt-2">
            Nous nous réservons le droit de modifier ces conditions à tout
            moment afin d&apos;améliorer votre expérience de jeu ou de nous
            conformer aux évolutions légales et techniques. Les utilisateurs
            seront informés des changements significatifs.
          </p>
        </>
      ),
    },

    // ============================================================
    // 2. DESCRIPTION DU JEU (enrichie)
    // ============================================================
    {
      number: '2',
      title: 'Description du jeu',
      icon: Gamepad2,
      iconColor: 'bg-indigo-100 text-indigo-600',
      content: (
        <>
          <p>
            <Highlight>Lolomaths</Highlight> est un jeu de réflexion et de
            calcul mental. Il combine
            <strong> logique</strong>, <strong>arithmétique</strong> et
            <strong> stratégie</strong> pour offrir une expérience ludique et
            éducative.
          </p>

          <SubTitle>🎯 Objectif du jeu</SubTitle>
          <p>
            Atteindre le <strong>nombre cible</strong> affiché sur le plateau
            en formant des <strong>combinaisons mathématiques valides</strong>{' '}
            à l&apos;aide des pions (chiffres et opérateurs) disponibles dans
            votre rack.
          </p>

          <SubTitle>🧩 Plateau de jeu</SubTitle>
          <List
            items={[
              'Un plateau de 17 lignes × 13 colonnes (221 cases)',
              'Une case de départ centrale (position 110) d’où part toute combinaison',
              'Des cases contenant des nombres cibles (de 0 à 640 selon le niveau)',
              'Les cases cibles se verrouillent définitivement une fois atteintes',
            ]}
          />

          <SubTitle>🎲 Pions et combinaisons</SubTitle>
          <List
            items={[
              'Chaque joueur dispose d’un rack de 6 chiffres (0 à 9) et 4 opérateurs (+, −, ×, ÷)',
              'Les combinaisons doivent alterner chiffres et opérateurs (ex. : 3 + 4 × 2)',
              'Toute combinaison doit démarrer et se terminer par un chiffre',
              'Les opérateurs doivent être encadrés (à gauche et à droite, ou en haut et en bas)',
              'Aucune superposition de pions n’est autorisée',
            ]}
          />

          <SubTitle>🏆 Système de points</SubTitle>
          <List
            items={[
              'Note de base : +5 points si le résultat égale exactement la cible',
              'Malus : −N points (N = écart absolu) si le résultat diffère de la cible',
              'Bonus de niveau : +1 point si la cible dépasse un seuil selon le niveau',
              'Bonus de longueur : +1 point par pion au-delà de 6 pions utilisés',
              'Bonus d’opérateurs : +1 point par opérateur × ou ÷ utilisé',
            ]}
          />

          <SubTitle>⏱️ Déroulement d’une partie</SubTitle>
          <List
            items={[
              'Chaque match comporte un nombre défini de jeux (par défaut : 20)',
              'Un chronomètre global ou par match peut être activé',
              'Le joueur valide sa combinaison en choisissant la direction souhaitée',
              'La partie se termine lorsque tous les jeux sont épuisés ou que le temps est écoulé',
              'Le score final est calculé et affiché sur l’écran de résultats',
            ]}
          />

          <SubTitle>📈 Niveaux de difficulté</SubTitle>
          <List
            items={[
              'Minime : cibles ≥ 30 (pour débutants)',
              'Cadet : cibles ≥ 100',
              'Junior : cibles ≥ 200',
              'Senior : cibles ≥ 300 (mode expert)',
            ]}
          />

          <SubTitle>🎓 Aspect éducatif</SubTitle>
          <p>
            Lolomaths est conçu pour développer les compétences en{' '}
            <strong>calcul mental</strong>, <strong>logique</strong> et{' '}
            <strong>résolution de problèmes</strong>. Il est adapté aux
            enfants, aux étudiants et aux adultes souhaitant entretenir leur
            agilité mathématique.
          </p>
        </>
      ),
    },

    // ============================================================
    // 3. COMPTE UTILISATEUR
    // ============================================================
    {
      number: '3',
      title: 'Compte utilisateur',
      icon: Users,
      iconColor: 'bg-purple-100 text-purple-600',
      content: (
        <>
          <p>
            La création d&apos;un compte est <strong>gratuite et optionnelle</strong>.
            Elle vous permet de bénéficier de fonctionnalités avancées :
          </p>
          <List
            items={[
              'Sauvegarder automatiquement vos scores et statistiques',
              'Suivre votre progression dans le temps',
              'Recevoir des défis quotidiens personnalisés',
              'Participer à des tournois et classements en ligne',
              'Débloquer des thèmes et niveaux exclusifs',
            ]}
          />

          <SubTitle>🔐 Sécurité du compte</SubTitle>
          <List
            items={[
              'Vous êtes responsable de la confidentialité de vos identifiants',
              'Un code secret personnel peut être requis pour les parties compétitives',
              'Toute activité suspecte doit être signalée immédiatement',
              'Un seul compte par utilisateur est autorisé',
            ]}
          />
        </>
      ),
    },

    // ============================================================
    // 4. UTILISATION ACCEPTABLE
    // ============================================================
    {
      number: '4',
      title: 'Utilisation acceptable',
      icon: Shield,
      iconColor: 'bg-emerald-100 text-emerald-600',
      content: (
        <>
          <p>
            En jouant à Lolomaths, vous vous engagez à respecter les règles
            suivantes :
          </p>
          <List
            items={[
              'Ne pas tricher ni utiliser de programmes automatisés (bots, scripts, IA)',
              'Ne pas tenter de pirater, modifier ou décompiler le jeu',
              'Ne pas perturber l’expérience des autres joueurs',
              'Ne pas utiliser le jeu à des fins malveillantes, illégales ou commerciales non autorisées',
              'Ne pas créer de faux comptes ni usurper l’identité d’autrui',
              'Ne pas exploiter de bugs ou de failles de sécurité',
            ]}
          />
          <p className="mt-2">
            Toute violation peut entraîner la <strong>suspension immédiate</strong>{' '}
            de votre compte et, le cas échéant, des poursuites judiciaires.
          </p>
        </>
      ),
    },

    // ============================================================
    // 5. PROPRIÉTÉ INTELLECTUELLE
    // ============================================================
    {
      number: '5',
      title: 'Propriété intellectuelle',
      icon: FileText,
      iconColor: 'bg-indigo-100 text-indigo-600',
      content: (
        <>
          <p>
            Le jeu <Highlight>Lolomaths</Highlight>, son code source, son
            design graphique, ses règles, son concept original, sa marque et
            son logo sont la <strong>propriété exclusive de Diambra</strong>.
          </p>
          <p className="mt-2">
            Toute reproduction, distribution, modification, adaptation ou
            exploitation, totale ou partielle, sans autorisation écrite
            préalable est <strong>strictement interdite</strong> et constitue
            une contrefaçon sanctionnée par le Code de la propriété
            intellectuelle.
          </p>
          <p className="mt-2">
            Les marques et logos tiers éventuellement présents restent la
            propriété de leurs détenteurs respectifs.
          </p>
        </>
      ),
    },

    // ============================================================
    // 6. LIMITATION DE RESPONSABILITÉ
    // ============================================================
    {
      number: '6',
      title: 'Limitation de responsabilité',
      icon: AlertCircle,
      iconColor: 'bg-rose-100 text-rose-600',
      content: (
        <>
          <p>
            Lolomaths est un jeu de <strong>divertissement et d’apprentissage</strong>.
            Nous ne garantissons pas :
          </p>
          <List
            items={[
              'La disponibilité permanente et ininterrompue du jeu',
              "L'absence totale de bugs, erreurs ou dysfonctionnements",
              'Des performances spécifiques sur tous les appareils',
              'La conservation illimitée des données en cas de force majeure',
            ]}
          />
          <p className="mt-2">
            Diambra ne saurait être tenue responsable des dommages directs ou
            indirects résultant de l&apos;utilisation ou de l&apos;impossibilité
            d&apos;utiliser le jeu.
          </p>
        </>
      ),
    },

    // ============================================================
    // 7. PROTECTION DES DONNÉES
    // ============================================================
    {
      number: '7',
      title: 'Protection des données',
      icon: Lock,
      iconColor: 'bg-teal-100 text-teal-600',
      content: (
        <>
          <p>
            Nous accordons une importance primordiale à la protection de vos
            données personnelles. Celles-ci sont traitées conformément aux
            réglementations en vigueur, notamment la loi ivoirienne relative
            à la protection des données à caractère personnel et le RGPD pour
            les utilisateurs européens.
          </p>
          <SubTitle>📋 Données collectées</SubTitle>
          <List
            items={[
              'Informations de compte (nom, prénom, identifiant)',
              'Données de jeu (scores, statistiques, historique des parties)',
              'Données techniques (type d’appareil, version du système)',
            ]}
          />
          <SubTitle>🛡️ Vos droits</SubTitle>
          <List
            items={[
              'Droit d’accès à vos données personnelles',
              'Droit de rectification et de suppression',
              'Droit à la portabilité de vos données',
              'Droit d’opposition au traitement',
            ]}
          />
          <p className="mt-2">
            Pour plus d&apos;informations, consultez notre{' '}
            <CacheLink
              href="/privacy"
              className="text-purple-600 hover:underline font-semibold"
            >
              politique de confidentialité
            </CacheLink>
            .
          </p>
        </>
      ),
    },

    // ============================================================
    // 8. RÉSILIATION
    // ============================================================
    {
      number: '8',
      title: 'Résiliation',
      icon: AlertCircle,
      iconColor: 'bg-rose-100 text-rose-600',
      content: (
        <>
          <p>
            Nous nous réservons le droit de <strong>suspendre</strong> ou{' '}
            <strong>résilier</strong> un compte utilisateur, sans préavis ni
            indemnité, en cas de :
          </p>
          <List
            items={[
              'Violation flagrante des présentes conditions d’utilisation',
              'Comportement frauduleux ou malveillant',
              'Tentative de piratage ou d’exploitation de failles',
              'Inactivité prolongée (plus de 24 mois)',
            ]}
          />
          <p className="mt-2">
            Vous pouvez également <strong>supprimer votre compte</strong> à
            tout moment depuis les paramètres de l&apos;application. Cette
            suppression entraînera l&apos;effacement définitif de vos données
            de jeu.
          </p>
        </>
      ),
    },

    // ============================================================
    // 9. LOI APPLICABLE
    // ============================================================
    {
      number: '9',
      title: 'Loi applicable',
      icon: Scale,
      iconColor: 'bg-cyan-100 text-cyan-600',
      content: (
        <>
          <p>
            Les présentes conditions d&apos;utilisation sont régies et
            interprétées conformément au <strong>droit ivoirien</strong>.
          </p>
          <p className="mt-2">
            En cas de litige relatif à l&apos;interprétation, la validité ou
            l&apos;exécution des présentes, les tribunaux compétents d&apos;
            <strong>Abidjan (Côte d&apos;Ivoire)</strong> seront seuls saisis,
            sauf disposition légale impérative contraire.
          </p>
          <p className="mt-2">
            Avant toute action judiciaire, les parties s&apos;engagent à
            rechercher une <strong>solution amiable</strong>.
          </p>
        </>
      ),
    },
  ];
}