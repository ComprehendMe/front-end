import { useCallback, useEffect, useState } from 'react';
import {
	defaultUserPreferences,
	loadUserPreferences,
	saveUserPreferences,
	type NotificationPreferences,
	type UserPreferences,
} from '@/lib/user-preferences';

export function useUserPreferences(userKey: string) {
	const [preferences, setPreferences] = useState<UserPreferences>(() =>
		loadUserPreferences(userKey),
	);

	useEffect(() => {
		setPreferences(loadUserPreferences(userKey));

		const onUpdate = () => setPreferences(loadUserPreferences(userKey));
		window.addEventListener('comprehendme:preferences-updated', onUpdate);
		return () =>
			window.removeEventListener('comprehendme:preferences-updated', onUpdate);
	}, [userKey]);

	const persist = useCallback(
		(next: UserPreferences) => {
			saveUserPreferences(userKey, next);
			setPreferences(next);
			window.dispatchEvent(
				new CustomEvent('comprehendme:preferences-updated', { detail: next }),
			);
		},
		[userKey],
	);

	const updatePreferences = useCallback(
		(patch: Partial<Omit<UserPreferences, 'notifications'>>) => {
			persist({ ...preferences, ...patch });
		},
		[preferences, persist],
	);

	const updateNotifications = useCallback(
		(patch: Partial<NotificationPreferences>) => {
			persist({
				...preferences,
				notifications: { ...preferences.notifications, ...patch },
			});
		},
		[preferences, persist],
	);

	return {
		preferences,
		updatePreferences,
		updateNotifications,
		resetToDefaults: () => persist(defaultUserPreferences),
	};
}
