import type { TimeFormat } from '@/lib/user-preferences';

/** e.g. "Wednesday 5:14PM" or "Wednesday 17:14" */
export function formatMessageTime(
	iso: string,
	timeFormat: TimeFormat = '12h',
): string {
	const d = new Date(iso);
	const day = d.toLocaleDateString('en-US', { weekday: 'long' });
	const time = d
		.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: timeFormat === '12h',
		})
		.replace(/\s/g, '');
	return `${day} ${time}`;
}

export function getTimeGreeting(date = new Date()): string {
	const hour = date.getHours();
	if (hour >= 5 && hour < 12) return 'Good morning';
	if (hour >= 12 && hour < 18) return 'Good afternoon';
	return 'Good night';
}
export function getPatientFirstName(fullName: string): string {
	return fullName.trim().split(/\s+/)[0] ?? fullName;
}
