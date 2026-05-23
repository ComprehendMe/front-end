const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public body?: unknown,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

type RequestOptions = {
	method?: string;
	body?: unknown;
	signal?: AbortSignal;
};

async function parseJson<T>(res: Response): Promise<T> {
	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text) as T;
}

export async function apiRequest<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	const { method = 'GET', body, signal } = options;
	const headers: HeadersInit = {};
	let payload: string | undefined;

	if (body !== undefined) {
		headers['Content-Type'] = 'application/json';
		payload = JSON.stringify(body);
	}

	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: payload,
		credentials: 'include',
		signal,
	});

	const data = await parseJson<unknown>(res).catch(() => undefined);

	if (!res.ok) {
		const message =
			typeof data === 'object' &&
			data !== null &&
			'message' in data &&
			typeof (data as { message: unknown }).message === 'string'
				? (data as { message: string }).message
				: res.statusText || 'Request failed';
		throw new ApiError(message, res.status, data);
	}

	return data as T;
}

// --- Sessions ---

/** Full-page redirect to Auth0 Google (must use same origin as Vite proxy for cookies). */
export function startGoogleOAuth() {
	const base =
		typeof window !== 'undefined'
			? (import.meta.env.VITE_API_URL ?? '/api')
			: '/api';
	window.location.assign(`${base}/sessions/oauth/google`);
}

export async function signup(email: string, name?: string) {
	return apiRequest<{ ok: boolean; message: string }>('/sessions/signup', {
		method: 'POST',
		body: { email, ...(name?.trim() ? { name: name.trim() } : {}) },
	});
}

export async function login(email: string) {
	return apiRequest<{ ok: boolean; message: string }>('/sessions/login', {
		method: 'POST',
		body: { email },
	});
}

export type VerifySessionResult = {
	ok: boolean;
	intent: string;
	user: { id: string; email: string };
};

const verifySessionInflight = new Map<string, Promise<VerifySessionResult>>();

/** One HTTP request per token (React Strict Mode runs effects twice in dev). */
export function verifySession(token: string) {
	const normalized = token.trim();
	if (!normalized) {
		return Promise.reject(new ApiError('Missing token.', 400));
	}

	const existing = verifySessionInflight.get(normalized);
	if (existing) return existing;

	const request = apiRequest<VerifySessionResult>(
		`/sessions/verify?token=${encodeURIComponent(normalized)}`,
	).finally(() => {
		verifySessionInflight.delete(normalized);
	});

	verifySessionInflight.set(normalized, request);
	return request;
}

export async function logout() {
	return apiRequest<{ ok: boolean }>('/sessions/logout', { method: 'DELETE' });
}

// --- User ---

export type MeUser = {
	avatar?: string;
	email: string;
	name?: string | null;
};

export async function getMe() {
	return apiRequest<MeUser>('/users/@me');
}

export type WeeklyMinutesDay = {
	day: string;
	minutes: number;
	isToday: boolean;
};

export type DashboardStats = {
	streak: number;
	todayMinutes: number;
	dailyGoalMinutes: number;
	ringProgress: number;
	weeklyMinutes: WeeklyMinutesDay[];
};

export async function getDashboardStats() {
	return apiRequest<DashboardStats>('/users/@me/stats');
}

export async function recordActivity() {
	return apiRequest<{ ok: boolean }>('/users/@me/activity', { method: 'POST' });
}

export async function updateMe(data: { name?: string; email?: string }) {
	return apiRequest<MeUser & { ok: boolean }>('/users/@me', {
		method: 'PUT',
		body: data,
	});
}

export async function requestAvatarUpload() {
	return apiRequest<{ route: string; hash: string }>('/users/avatar', {
		method: 'POST',
	});
}

export async function removeAvatar() {
	return apiRequest<{ ok: boolean }>('/users/avatar', { method: 'DELETE' });
}

export async function uploadAvatarBlob(blob: Blob) {
	const form = new FormData();
	form.append('file', blob, 'avatar.webp');

	const res = await fetch(`${API_BASE}/users/avatar/upload`, {
		method: 'POST',
		credentials: 'include',
		body: form,
	});

	const data = await parseJson<{ avatar?: string; message?: string }>(res).catch(
		() => undefined,
	);

	if (!res.ok) {
		const message =
			typeof data === 'object' &&
			data !== null &&
			'message' in data &&
			typeof data.message === 'string'
				? data.message
				: 'Failed to upload image.';
		throw new ApiError(message, res.status, data);
	}

	return getMe();
}

// --- Patients ---

export type Patient = {
	id: string;
	name: string;
	problem: string;
	age: number;
	nationality: string;
	difficulty: 'EASY' | 'MEDIUM' | 'HARD';
};

export async function listPatients() {
	return apiRequest<Patient[]>('/patients');
}

// --- Chats ---

export type Chat = {
	id: string;
	userId: string;
	patientId: string;
	title: string;
	updatedAt: string;
	endedAt: string | null;
	pausedAt?: string | null;
	patient: Patient;
};

export type ChatHistoryItem = {
	id: string;
	chatId: string;
	patientId: string;
	name: string;
	problem: string;
	difficulty: 'EASY' | 'MEDIUM' | 'HARD';
	endedAt: string;
	durationMinutes: number;
	hasReport: boolean;
};

export async function listChats() {
	return apiRequest<Chat[]>('/chats');
}

export async function createChat(patientId: string) {
	return apiRequest<Chat>('/chats', {
		method: 'POST',
		body: { patientId },
	});
}

export async function getChat(chatId: string) {
	return apiRequest<Chat>(`/chats/${chatId}`);
}

export async function listChatHistory() {
	return apiRequest<ChatHistoryItem[]>('/chats/history');
}

export async function pauseChat(chatId: string) {
	return apiRequest<{ ok: boolean }>(`/chats/${chatId}/pause`, {
		method: 'POST',
	});
}

export async function endChat(chatId: string) {
	return apiRequest<{ ok: boolean }>(`/chats/${chatId}/end`, {
		method: 'POST',
	});
}

export async function deleteChat(chatId: string) {
	return apiRequest<{ success: boolean }>(`/chats/${chatId}`, {
		method: 'DELETE',
	});
}

// --- Messages ---

export type Message = {
	id: string;
	chatId: string;
	role: 'user' | 'model';
	content: string;
	status: string;
	createdAt?: string;
};

export async function listMessages(chatId: string) {
	return apiRequest<Message[]>(`/chats/${chatId}/messages`);
}

export async function sendMessage(chatId: string, content: string) {
	return apiRequest<{ status: string; userMessageId: string }>(
		`/chats/${chatId}/messages`,
		{
			method: 'POST',
			body: { content },
		},
	);
}

// --- Friends ---

export type FriendUser = {
	id: string;
	name: string | null;
	avatar: string | null;
	email?: string;
};

export type FriendSearchResult = FriendUser & {
	relation: 'none' | 'pending' | 'accepted' | 'incoming';
	requestId?: string;
};

export async function listFriends() {
	return apiRequest<FriendUser[]>('/friends');
}

export async function searchFriends(name: string) {
	return apiRequest<FriendSearchResult[]>(
		`/friends/search?name=${encodeURIComponent(name)}`,
	);
}

export async function requestFriend(userId: string) {
	return apiRequest<{ ok: boolean }>('/friends/requests', {
		method: 'POST',
		body: { userId },
	});
}

export async function removeFriend(friendId: string) {
	return apiRequest<{ ok: boolean }>(`/friends/${friendId}`, {
		method: 'DELETE',
	});
}

export type FriendRequest = {
	id: string;
	requester: FriendUser & { email?: string };
	createdAt: string;
};

export async function listFriendRequests() {
	return apiRequest<FriendRequest[]>('/friends/requests');
}

export async function respondToFriendRequest(
	requestId: string,
	status: 'ACCEPTED' | 'DECLINED',
) {
	return apiRequest<{ ok: boolean }>(`/friends/requests/${requestId}`, {
		method: 'PUT',
		body: { status },
	});
}

// --- Billing ---

export type BillingInvoice = {
	id: string;
	name: string;
	date: string;
	plan: string;
	amount: string;
	status: 'active' | 'archived';
	downloadUrl: string | null;
};

export type BillingSummary = {
	plan: 'FREE' | 'PREMIUM';
	invoices: BillingInvoice[];
	checkoutAvailable: boolean;
};

export async function getBillingSummary() {
	return apiRequest<BillingSummary>('/payments/billing');
}

export async function startPremiumCheckout() {
	return apiRequest<{ url: string }>('/payments/checkout', { method: 'POST' });
}

export async function confirmPremiumCheckout(sessionId: string) {
	return apiRequest<{ ok: boolean; plan: 'FREE' | 'PREMIUM' }>(
		'/payments/confirm',
		{
			method: 'POST',
			body: { sessionId },
		},
	);
}

export async function waitForModelReply(
	chatId: string,
	previousModelCount: number,
	maxAttempts = 15,
	intervalMs = 2000,
): Promise<string | null> {
	for (let i = 0; i < maxAttempts; i++) {
		await new Promise((r) => setTimeout(r, intervalMs));
		const messages = await listMessages(chatId);
		const modelMessages = messages.filter((m) => m.role === 'model');
		if (modelMessages.length > previousModelCount) {
			return modelMessages[modelMessages.length - 1].content;
		}
	}
	return null;
}
