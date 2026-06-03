import type { Patient } from '@/lib/api';

/** Slug used for avatar files in /public/dist (e.g. emma-richardson.webp). */
export function patientAvatarSlug(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** Patient avatars in /dist/patients/, filename is a slug of the patient name. */
export function getPatientImageUrl(patientName: string): string {
	return `/dist/patients/${patientAvatarSlug(patientName)}.webp`;
}

export const PATIENT_BADGE_VARIANTS = [
	'problems',
	'adaptation',
	'emotional',
	'problems',
] as const;

export type PatientBadgeVariant = (typeof PATIENT_BADGE_VARIANTS)[number];

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

/** Stable decorative progress bar per patient (0–100) */
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
