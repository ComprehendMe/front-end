import type { MeUser } from '@/lib/api';

function hasDisplayName(user: MeUser): boolean {
	return Boolean(user.name?.trim());
}

/** First name — never uses email */
export function getFirstName(user: MeUser, fallback = 'there'): string {
	if (!hasDisplayName(user)) return fallback;

	const first = user.name!.trim().split(/\s+/)[0];
	return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

/** Full name for the header — never uses email */
export function getDisplayName(user: MeUser, fallback = 'Add your name'): string {
	if (!hasDisplayName(user)) return fallback;
	return user.name!.trim();
}

export function getInitials(user: MeUser): string {
	if (hasDisplayName(user)) {
		return user
			.name!.trim()
			.split(/\s+/)
			.map((n) => n[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();
	}
	return '?';
}

export function splitFullName(name: string | null | undefined): {
	firstName: string;
	lastName: string;
} {
	if (!name?.trim()) return { firstName: '', lastName: '' };
	const parts = name.trim().split(/\s+/);
	const firstName = parts[0] ?? '';
	const lastName = parts.slice(1).join(' ');
	return { firstName, lastName };
}

export function joinFullName(firstName: string, lastName: string): string {
	return [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
}
