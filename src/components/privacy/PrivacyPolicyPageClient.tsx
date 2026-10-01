'use client';
import { motion } from 'framer-motion';
import { Clock, Cookie, FileText, Link, Lock, Mail, Server, Target, Users } from 'lucide-react';
import ContactCard from './components/ContactCard';
import PageHeader from './components/PageHeader';
import Section from './components/Section';
import StickyHeader from './components/StickyHeader';
import SubSection from './components/SubSection';
import SecurityBadge from './components/SecurityBadge';
import LegalNotice from './components/LegalNotice';
import BulletList from './components/BulletList';

const CONTACT_INFO = {
    phone: '+225 07 58 38 53 87',
    address: 'Abidjan, Côte d\'Ivoire',
    company: 'Lolomaths'
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export default function PrivacyPolicyPageClient() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/50">
            <StickyHeader />
            <PageHeader />

            <div className="max-w-4xl mx-auto px-4 pb-16">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 sm:p-8"
                >

                    <Section title="Responsable du traitement" number={1} icon={<Users className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Le responsable du traitement des données collectées dans le cadre de Lolomaths est l'éditeur du Jeu.
                        </p>
                        <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
                            <p><strong>Jeu :</strong> {CONTACT_INFO.company}</p>
                            <p><strong>Pays :</strong> Côte d'Ivoire</p>
                            <p><strong>Téléphone du support :</strong> {CONTACT_INFO.phone}</p>
                        </div>
                    </Section>

                    <Section title="Données susceptibles d'être collectées" number={2} icon={<Server className="w-4 h-4 text-purple-600" />}>
                        <SubSection title="2.1. Données fournies par l'utilisateur">
                            <BulletList items={[
                                "nom ou pseudonyme",
                                "adresse e-mail, lorsqu'elle est utilisée pour votre compte",
                                "numéro de téléphone, lorsqu'il est nécessaire au fonctionnement d'un service",
                                "informations liées à votre profil de joueur",
                                "informations nécessaires au fonctionnement de votre compte",
                                "communications adressées au support technique"
                            ]} />
                            <p className="text-xs text-gray-400 mt-2">
                                Nous ne demandons pas de données personnelles qui ne sont pas nécessaires au fonctionnement des fonctionnalités concernées.
                            </p>
                        </SubSection>

                        <SubSection title="2.2. Données relatives à l'utilisation du Jeu">
                            <BulletList items={[
                                "progression dans le Jeu",
                                "scores et résultats",
                                "statistiques de jeu",
                                "historique des parties ou opérations effectuées",
                                "informations nécessaires à la prévention de la fraude et des abus",
                                "informations techniques nécessaires au fonctionnement du service"
                            ]} />
                        </SubSection>

                        <SubSection title="2.3. Données techniques">
                            <BulletList items={[
                                "adresse IP",
                                "type d'appareil",
                                "système d'exploitation",
                                "navigateur utilisé",
                                "date et heure de connexion",
                                "informations relatives aux erreurs et dysfonctionnements",
                                "journaux techniques nécessaires à la sécurité du service"
                            ]} />
                        </SubSection>
                    </Section>

                    <Section title="Données de paiement" number={3} icon={<Lock className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Lorsque Lolomaths propose des fonctionnalités nécessitant un paiement, les opérations de paiement peuvent être traitées par un prestataire de paiement tiers.
                        </p>
                        <p>
                            Nous ne collectons pas nécessairement les informations bancaires complètes utilisées pour effectuer un paiement.
                        </p>

                    </Section>

                    <Section title="Finalités du traitement" number={4} icon={<Target className="w-4 h-4 text-purple-600" />}>
                        <SubSection title="Fonctionnement du Jeu">
                            <BulletList items={[
                                "créer et gérer un compte lorsque cette fonctionnalité existe",
                                "permettre l'accès au Jeu",
                                "sauvegarder la progression",
                                "enregistrer les scores et résultats",
                                "fournir les fonctionnalités demandées par l'utilisateur"
                            ]} />
                        </SubSection>

                        <SubSection title="Sécurité">
                            <BulletList items={[
                                "protéger les comptes",
                                "détecter les comportements frauduleux",
                                "prévenir les abus",
                                "détecter les tentatives d'accès non autorisées",
                                "assurer la sécurité de nos infrastructures"
                            ]} />
                        </SubSection>

                        <SubSection title="Paiements">
                            <BulletList items={[
                                "traiter les transactions",
                                "confirmer les paiements",
                                "gérer les achats",
                                "détecter et prévenir les transactions frauduleuses",
                                "gérer les éventuels remboursements ou litiges"
                            ]} />
                        </SubSection>

                        <SubSection title="Support">
                            <BulletList items={[
                                "répondre aux demandes des utilisateurs",
                                "résoudre les problèmes techniques",
                                "traiter les réclamations",
                                "améliorer la qualité du service"
                            ]} />
                        </SubSection>

                        <SubSection title="Amélioration du Jeu">
                            <BulletList items={[
                                "identifier les dysfonctionnements",
                                "améliorer les performances",
                                "comprendre l'utilisation générale du Jeu",
                                "améliorer l'expérience utilisateur",
                                "développer de nouvelles fonctionnalités"
                            ]} />
                        </SubSection>
                    </Section>

                    <Section title="Base du traitement" number={5} icon={<FileText className="w-4 h-4 text-purple-600" />}>
                        <p>Les traitements de données personnelles sont réalisés conformément à la réglementation applicable en matière de protection des données personnelles.</p>
                        <p>Selon la nature du traitement, celui-ci peut notamment être fondé sur :</p>
                        <BulletList items={[
                            "l'exécution du service demandé par l'utilisateur",
                            "le consentement de l'utilisateur lorsque celui-ci est requis",
                            "le respect d'une obligation légale",
                            "la nécessité de protéger la sécurité et l'intégrité du Jeu",
                            "nos intérêts légitimes, lorsque la réglementation applicable le permet"
                        ]} />
                    </Section>

                    <Section title="Destinataires des données" number={6} icon={<Users className="w-4 h-4 text-purple-600" />}>
                        <p>Les données personnelles sont accessibles uniquement aux personnes ou prestataires qui en ont besoin pour assurer le fonctionnement du Jeu.</p>
                        <BulletList items={[
                            "les membres habilités de l'équipe exploitant Lolomaths",
                            "les prestataires techniques nécessaires à l'hébergement et au fonctionnement du Jeu",
                            "les prestataires de paiement, lorsque l'utilisateur effectue une transaction",
                            "les prestataires chargés de la sécurité ou de la maintenance technique",
                            "les autorités compétentes lorsque la communication des informations est imposée par la loi"
                        ]} />
                        <p className="font-semibold text-purple-700 mt-2">Nous ne vendons pas les données personnelles des utilisateurs.</p>
                    </Section>

                    <Section title="Hébergement et prestataires techniques" number={7} icon={<Server className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Pour assurer le fonctionnement de Lolomaths, certaines données peuvent être hébergées ou traitées par des prestataires techniques.
                        </p>
                        <p>
                            Ces prestataires sont sélectionnés en fonction de leurs capacités techniques et des garanties qu'ils offrent en matière de sécurité et de confidentialité.
                        </p>

                    </Section>

                    <Section title="Conservation des données" number={8} icon={<Clock className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Nous conservons les données personnelles uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.
                        </p>
                        <p>La durée de conservation peut notamment dépendre :</p>
                        <BulletList items={[
                            "de la durée d'existence du compte utilisateur",
                            "de la nécessité de conserver l'historique des transactions",
                            "des obligations comptables ou légales",
                            "des nécessités de sécurité",
                            "de la résolution d'un litige"
                        ]} />
                        <p>Lorsque les données ne sont plus nécessaires, elles sont supprimées ou anonymisées.</p>
                    </Section>

                    <Section title="Cookies et technologies similaires" number={9} icon={<Cookie className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Lolomaths peut utiliser des cookies, des mécanismes de stockage local ou des technologies similaires nécessaires au fonctionnement du Jeu.
                        </p>
                        <p>Ces technologies peuvent notamment permettre :</p>
                        <BulletList items={[
                            "de maintenir une session utilisateur",
                            "de mémoriser certaines préférences",
                            "d'assurer la sécurité",
                            "d'améliorer les performances",
                            "de conserver certaines informations nécessaires au fonctionnement du Jeu"
                        ]} />
                    </Section>

                    <Section title="Sécurité des données" number={10} icon={<Lock className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Nous mettons en œuvre des mesures techniques et organisationnelles raisonnables destinées à protéger les données personnelles contre :
                        </p>
                        <BulletList items={[
                            "l'accès non autorisé",
                            "la perte",
                            "la destruction",
                            "la modification non autorisée",
                            "la divulgation",
                            "l'utilisation abusive"
                        ]} />
                        <p className="text-xs text-gray-400 mt-2">
                            Aucun système informatique ou transmission sur Internet ne peut être garanti comme étant totalement sécurisé.
                        </p>
                    </Section>

                    <Section title="Données des mineurs" number={11} icon={<Users className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Lolomaths n'a pas pour objectif de collecter volontairement des données personnelles de mineurs en dehors des conditions prévues par la réglementation applicable.
                        </p>
                        <p>
                            Si nous apprenons qu'une donnée personnelle a été collectée auprès d'un mineur dans des conditions qui ne respectent pas les exigences applicables, nous prendrons les mesures raisonnables nécessaires.
                        </p>
                    </Section>

                    <Section title="Vos droits" number={12} icon={<FileText className="w-4 h-4 text-purple-600" />}>
                        <SubSection title="Droit d'accès">
                            <p>Vous pouvez demander à savoir quelles données personnelles vous concernant sont traitées et, dans les conditions prévues par la loi, obtenir une copie de ces données.</p>
                        </SubSection>
                        <SubSection title="Droit de rectification">
                            <p>Vous pouvez demander la correction de données personnelles inexactes ou incomplètes.</p>
                        </SubSection>
                        <SubSection title="Droit de suppression">
                            <p>Vous pouvez demander la suppression de vos données personnelles lorsque les conditions légales permettant cette suppression sont réunies.</p>
                        </SubSection>
                        <SubSection title="Droit d'opposition">
                            <p>Vous pouvez vous opposer à certains traitements de vos données lorsque la réglementation applicable vous reconnaît ce droit.</p>
                        </SubSection>
                        <SubSection title="Droit au retrait du consentement">
                            <p>Lorsque le traitement repose sur votre consentement, vous pouvez retirer celui-ci dans les conditions applicables.</p>
                        </SubSection>
                    </Section>

                    <Section title="Exercice de vos droits" number={13} icon={<Mail className="w-4 h-4 text-purple-600" />}>
                        <p>Pour exercer vos droits ou poser une question concernant la protection de vos données personnelles, vous pouvez contacter notre support :</p>
                        <div className="mt-2 p-3 bg-purple-50 rounded-lg text-sm">
                            <p><strong>Téléphone :</strong> {CONTACT_INFO.phone}</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Lorsque cela est nécessaire, nous pouvons vous demander des informations permettant de vérifier votre identité.
                            </p>
                        </div>
                    </Section>

                    <Section title="Réclamations" number={14} icon={<FileText className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Si vous estimez que vos droits relatifs à vos données personnelles ne sont pas respectés, nous vous invitons à nous contacter en premier lieu.
                        </p>
                        <p>
                            En Côte d'Ivoire, l'ARTCI intervient notamment dans le domaine de la protection des données personnelles.
                        </p>
                    </Section>

                    <Section title="Transfert de données" number={15} icon={<Server className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Lorsque certains de nos prestataires techniques sont situés en dehors de la Côte d'Ivoire ou lorsque des données sont traitées depuis un autre pays, les transferts concernés seront réalisés conformément aux exigences légales et réglementaires applicables.
                        </p>
                    </Section>

                    <Section title="Liens vers des services tiers" number={16} icon={<Link className="w-4 h-4 text-purple-600" />}>
                        <p>
                            Lolomaths peut éventuellement contenir des liens ou intégrer des services fournis par des tiers.
                        </p>
                        <p>
                            Nous vous recommandons de consulter les politiques de confidentialité des services tiers avant de leur communiquer des informations personnelles.
                        </p>
                        <p>Nous ne sommes pas responsables des pratiques de confidentialité de services tiers que nous ne contrôlons pas.</p>
                    </Section>

                    <Section title="Modification de la présente politique" number={17} icon={<Clock className="w-4 h-4 text-purple-600" />}>
                        <p>Nous pouvons modifier cette Politique de confidentialité afin de tenir compte :</p>
                        <BulletList items={[
                            "de l'évolution du Jeu",
                            "de l'ajout ou de la modification de fonctionnalités",
                            "de l'évolution de nos pratiques",
                            "de l'évolution de la réglementation applicable",
                            "de l'évolution de nos prestataires techniques"
                        ]} />
                        <p>En cas de modification importante, une nouvelle date de mise à jour sera affichée.</p>
                    </Section>

                    <Section title="Contact" number={18} icon={<Mail className="w-4 h-4 text-purple-600" />}>
                        <p>Pour toute question concernant cette Politique de confidentialité :</p>
                        <ContactCard />

                    </Section>
                    <SecurityBadge />
                    <LegalNotice />
                </motion.div>
            </div>
        </div>
    );
}