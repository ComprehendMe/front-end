export type TimeFormat = '12h' | '24h';
export type AppLanguage = 'en' | 'pt-PT';

export type NotificationPreferences = {
	desktopEnabled: boolean;
	unreadBadgeEnabled: boolean;
	pushTimeoutMinutes: number;
	emailCommunication: boolean;
	emailAnnouncements: boolean;
	soundsDisabled: boolean;
};

export type UserPreferences = {
	language: AppLanguage;
	timeFormat: TimeFormat;
	notifications: NotificationPreferences;
};

const STORAGE_PREFIX = 'comprehendme:prefs:';

export const defaultNotificationPreferences: NotificationPreferences = {
	desktopEnabled: true,
	unreadBadgeEnabled: true,
	pushTimeoutMinutes: 10,
	emailCommunication: false,
	emailAnnouncements: true,
	soundsDisabled: false,
};

export const defaultUserPreferences: UserPreferences = {
	language: 'en',
	timeFormat: '12h',
	notifications: defaultNotificationPreferences,
};

function storageKey(userKey: string) {
	return `${STORAGE_PREFIX}${userKey}`;
}

export function loadUserPreferences(userKey: string): UserPreferences {
	if (typeof window === 'undefined') return defaultUserPreferences;

	try {
		const raw = localStorage.getItem(storageKey(userKey));
		if (!raw) return defaultUserPreferences;
		const parsed = JSON.parse(raw) as Partial<UserPreferences>;
		return {
			language: parsed.language === 'pt-PT' ? 'pt-PT' : 'en',
			timeFormat: parsed.timeFormat === '24h' ? '24h' : '12h',
			notifications: {
				...defaultNotificationPreferences,
				...parsed.notifications,
			},
		};
	} catch {
		return defaultUserPreferences;
	}
}

export function saveUserPreferences(
	userKey: string,
	preferences: UserPreferences,
): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(storageKey(userKey), JSON.stringify(preferences));
}

export async function requestDesktopNotificationPermission(): Promise<boolean> {
	if (typeof window === 'undefined' || !('Notification' in window)) {
		return false;
	}
	if (Notification.permission === 'granted') return true;
	if (Notification.permission === 'denied') return false;
	const result = await Notification.requestPermission();
	return result === 'granted';
}

export function showDesktopNotification(title: string, body: string) {
	if (typeof window === 'undefined' || !('Notification' in window)) return;
	if (Notification.permission !== 'granted') return;
	new Notification(title, { body, icon: '/logo.svg' });
}
