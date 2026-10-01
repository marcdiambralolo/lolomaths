import { Consultation } from "@/lib/interfaces";
import { formatRelativeDate, formatToHMS, parseTimeToSeconds } from "@/lib/learning/functions";

export function useConsultationCard(consultation: Consultation) {
    const client = consultation.clientId;
    const nomJoueur = client?.username || 'Anonyme';
    const country = client?.country || "Côte d'Ivoire";
    const timeSpent = consultation.timeSpent || '0';
    const relativeDate = formatRelativeDate(consultation.createdAt);
    const timeInSeconds = parseTimeToSeconds(timeSpent);
    const formattedTime = formatToHMS(timeInSeconds);
    const nombredevues = consultation.nombredevues || 0;

    return {
        client, nomJoueur, country, timeSpent, relativeDate,
        timeInSeconds, formattedTime, nombredevues
    };
}