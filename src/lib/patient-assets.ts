import type { Patient } from '@/lib/api';

/** Fotos em /public/patients (copiadas de front-end/dist) */
export const PATIENT_IMAGES = [
	'/patients/patient-1.png',
	'/patients/patient-2.png',
	'/patients/patient-3.png',
	'/patients/patient-4.png',
] as const;

export const PATIENT_BADGE_VARIANTS = [
	'problems',
	'adaptation',
	'emotional',
	'problems',
] as const;

export type PatientBadgeVariant = (typeof PATIENT_BADGE_VARIANTS)[number];

export function getPatientImageUrl(index: number): string {
	return PATIENT_IMAGES[index % PATIENT_IMAGES.length];
}

export function getPatientBadgeVariant(index: number): PatientBadgeVariant {
	return PATIENT_BADGE_VARIANTS[index % PATIENT_BADGE_VARIANTS.length];
}

const PROBLEM_LABELS: Record<PatientBadgeVariant, string> = {
	problems: 'Problems at school/work',
	adaptation: 'Adaptation problems',
	emotional: 'Emotional problems',
};

export function getPatientProblemLabel(index: number): string {
	return PROBLEM_LABELS[getPatientBadgeVariant(index)];
}

export function difficultyToLevel(
	difficulty: 'EASY' | 'MEDIUM' | 'HARD',
): 'easy' | 'medium' | 'hard' {
	return difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
}

/** Barra decorativa estável por paciente (0–100) */
export function getPatientProgressPercent(patientId: string): number {
	let hash = 0;
	for (let i = 0; i < patientId.length; i++) {
		hash = (hash + patientId.charCodeAt(i) * (i + 1)) % 100;
	}
	return 35 + (hash % 50);
}

export function getPatientIndex(patients: Patient[], patientId: string): number {
	const idx = patients.findIndex((p) => p.id === patientId);
	return idx >= 0 ? idx : 0;
}
