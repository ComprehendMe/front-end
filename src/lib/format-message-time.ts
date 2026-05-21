/** e.g. "Wednesday 5:14PM" */
export function formatMessageTime(iso: string): string {
	const d = new Date(iso);
	const day = d.toLocaleDateString('en-US', { weekday: 'long' });
	const time = d
		.toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		})
		.replace(/\s/g, '');
	return `${day} ${time}`;
}

export function getTimeGreeting(): string {
	const hour = new Date().getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
}

export function getPatientFirstName(fullName: string): string {
	return fullName.trim().split(/\s+/)[0] ?? fullName;
}
