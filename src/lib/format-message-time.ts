import type { TimeFormat } from '@/lib/user-preferences';

function localeFromLang(lang?: string): string {
	if (lang === 'pt-PT') return 'pt-PT';
	return 'en-US';
}

/** e.g. "Wednesday 5:14PM" or "Wednesday 17:14" */
export function formatMessageTime(
	iso: string,
	timeFormat: TimeFormat = '12h',
	lang?: string,
): string {
	const locale = localeFromLang(lang ?? (typeof document !== 'undefined' ? document.documentElement.lang : 'en'));
	const d = new Date(iso);
	const day = d.toLocaleDateString(locale, { weekday: 'long' });
	const time = d
		.toLocaleTimeString(locale, {
			hour: 'numeric',
			minute: '2-digit',
			hour12: timeFormat === '12h',
		})
		.replace(/\s/g, '');
	return `${day} ${time}`;
}

/** Returns the i18n key for the time-of-day greeting. */
export function getGreetingKey(date = new Date()): string {
	const hour = date.getHours();
	if (hour >= 5 && hour < 12) return 'dashboard.index.greeting_morning';
	if (hour >= 12 && hour < 18) return 'dashboard.index.greeting_afternoon';
	return 'dashboard.index.greeting_night';
}
export function getPatientFirstName(fullName: string): string {
	return fullName.trim().split(/\s+/)[0] ?? fullName;
}
