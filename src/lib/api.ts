const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public body?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

type RequestOptions = {
	method?: string;
	body?: unknown;
	signal?: AbortSignal;
};

// --- Tab-scoped session tokens (isolated per browser tab) ---

const SESSION_KEY = "pap_session";

type StoredSession = {
	access: string;
	refresh: string;
};

export function getStoredSession(): StoredSession | null {
	try {
		const raw = sessionStorage.getItem(SESSION_KEY);
		return raw ? (JSON.parse(raw) as StoredSession) : null;
	} catch {
		return null;
	}
}

function storeSession(session: StoredSession) {
	try {
		sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
	} catch {
		/* sessionStorage may be unavailable */
	}
}

function clearSession() {
	try {
		sessionStorage.removeItem(SESSION_KEY);
	} catch {
		/* noop */
	}
}

// --- Token refresh with deduplication ---

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
	if (refreshPromise) return refreshPromise;

	refreshPromise = (async () => {
		try {
			const session = getStoredSession();
			if (!session?.refresh) return false;

			const res = await fetch(`${API_BASE}/sessions/refresh`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken: session.refresh }),
				credentials: "include",
			});

			if (!res.ok) {
				clearSession();
				return false;
			}

			const data = (await res.json()) as {
				access?: string;
				refresh?: string;
			};
			if (data.access && data.refresh) {
				storeSession({ access: data.access, refresh: data.refresh });
				return true;
			}

			clearSession();
			return false;
		} catch {
			clearSession();
			return false;
		} finally {
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

// --- Main request helper ---

async function parseJson<T>(res: Response): Promise<T> {
	const text = await res.text();
	if (!text) return undefined as T;
	return JSON.parse(text) as T;
}

async function apiRequestInternal<T>(
	path: string,
	options: RequestOptions,
	retryCount: number,
): Promise<T> {
	const { method = "GET", body, signal } = options;
	const headers: HeadersInit = {};
	let payload: string | undefined;

	const session = getStoredSession();
	if (session?.access) {
		headers["Authorization"] = `Bearer ${session.access}`;
	}

	const lang = typeof window !== 'undefined' ? document.documentElement.lang : 'en';
	headers['Accept-Language'] = lang;

	if (body !== undefined) {
		headers["Content-Type"] = "application/json";
		payload = JSON.stringify(body);
	}

	const res = await fetch(`${API_BASE}${path}`, {
		method,
		headers,
		body: payload,
		credentials: "include",
		signal,
	});

	const data = await parseJson<unknown>(res).catch(() => undefined);

	if (!res.ok) {
		const message =
			typeof data === "object" &&
			data !== null &&
			"message" in data &&
			typeof (data as { message: unknown }).message === "string"
				? (data as { message: string }).message
				: res.statusText || "Request failed";

		if (res.status === 401 && retryCount === 0) {
			const session = getStoredSession();
			if (session?.refresh) {
				const refreshed = await refreshTokens();
				if (refreshed) {
					return apiRequestInternal<T>(path, options, retryCount + 1);
				}
			}
			clearSession();
		}

		throw new ApiError(message, res.status, data);
	}

	return data as T;
}

export async function apiRequest<T>(
	path: string,
	options: RequestOptions = {},
): Promise<T> {
	return apiRequestInternal<T>(path, options, 0);
}

// --- Sessions ---

/** Full-page redirect to Auth0 Google (must use same origin as Vite proxy for cookies). */
export function startGoogleOAuth() {
	const base =
		typeof window !== "undefined"
			? (import.meta.env.VITE_API_URL ?? "/api")
			: "/api";
	window.location.assign(`${base}/sessions/oauth/google`);
}

export type SignupPayload = {
	email: string;
	name?: string;
	dateOfBirth?: string;
	college?: string;
	referralSource?: string;
};

export async function signup(payload: SignupPayload) {
	const { email, name, dateOfBirth, college, referralSource } = payload;
	return apiRequest<{ ok: boolean; message: string }>("/sessions/signup", {
		method: "POST",
		body: {
			email,
			...(name?.trim() ? { name: name.trim() } : {}),
			...(dateOfBirth ? { dateOfBirth } : {}),
			...(college ? { college } : {}),
			...(referralSource ? { referralSource } : {}),
		},
	});
}

export async function completeOnboarding(payload: {
	dateOfBirth: string;
	college: string;
	referralSource: string;
}) {
	return apiRequest<{ ok: boolean }>("/users/@me/onboarding", {
		method: "POST",
		body: payload,
	});
}

export async function login(email: string) {
	return apiRequest<{ ok: boolean; message: string }>("/sessions/login", {
		method: "POST",
		body: { email },
	});
}

export type VerifySessionResult = {
	ok: boolean;
	intent: string;
	onboardingCompleted?: boolean;
	user: { id: string; email: string };
	access?: string;
	refresh?: string;
};

const verifySessionInflight = new Map<string, Promise<VerifySessionResult>>();

/** One HTTP request per token (React Strict Mode runs effects twice in dev). */
export function verifySession(token: string) {
	const normalized = token.trim();
	if (!normalized) {
		return Promise.reject(new ApiError("Missing token.", 400));
	}

	const existing = verifySessionInflight.get(normalized);
	if (existing) return existing;

	const request = apiRequest<VerifySessionResult>(
		`/sessions/verify?token=${encodeURIComponent(normalized)}`,
	)
		.then((result) => {
			if (result.access && result.refresh) {
				storeSession({ access: result.access, refresh: result.refresh });
			}
			return result;
		})
		.finally(() => {
			verifySessionInflight.delete(normalized);
		});

	verifySessionInflight.set(normalized, request);
	return request;
}

export async function logout() {
	clearSession();
	return apiRequest<{ ok: boolean }>("/sessions/logout", { method: "DELETE" });
}

// --- User ---

export type MeUser = {
	avatar?: string;
	email: string;
	name?: string | null;
	onboardingCompleted?: boolean;
};

export async function getMe() {
	return apiRequest<MeUser>("/users/@me");
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
	return apiRequest<DashboardStats>("/users/@me/stats");
}

export async function recordActivity() {
	return apiRequest<{ ok: boolean }>("/users/@me/activity", { method: "POST" });
}

export async function requestEmailChange(newEmail: string) {
	return apiRequest<{ ok: boolean; message: string }>(
		"/users/@me/change-email",
		{
			method: "POST",
			body: { newEmail },
		},
	);
}

export async function updateMe(data: { name?: string; email?: string }) {
	return apiRequest<MeUser & { ok: boolean }>("/users/@me", {
		method: "PUT",
		body: data,
	});
}

export async function deleteAccount() {
	return apiRequest<{ ok: boolean }>("/users/@me", { method: "DELETE" });
}

export async function requestAvatarUpload() {
	return apiRequest<{ route: string; hash: string }>("/users/avatar", {
		method: "POST",
	});
}

export async function removeAvatar() {
	return apiRequest<{ ok: boolean }>("/users/avatar", { method: "DELETE" });
}

export async function uploadAvatarBlob(blob: Blob) {
	const form = new FormData();
	form.append("file", blob, "avatar.webp");

	const headers: HeadersInit = {};
	const session = getStoredSession();
	if (session?.access) {
		headers["Authorization"] = `Bearer ${session.access}`;
	}

	const res = await fetch(`${API_BASE}/users/avatar/upload`, {
		method: "POST",
		headers,
		credentials: "include",
		body: form,
	});

	const data = await parseJson<{ avatar?: string; message?: string }>(
		res,
	).catch(() => undefined);

	if (!res.ok) {
		const message =
			typeof data === "object" &&
			data !== null &&
			"message" in data &&
			typeof data.message === "string"
				? data.message
				: "Failed to upload image.";
		throw new ApiError(message, res.status, data);
	}

	return getMe();
}

// --- Patients ---

export type Patient = {
	id: string;
	name: string;
	gender: string;
	problem: string;
	age: number;
	nationality: string;
	difficulty: "EASY" | "MEDIUM" | "HARD";
};

export async function listPatients() {
	return apiRequest<Patient[]>("/patients");
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
	difficulty: "EASY" | "MEDIUM" | "HARD";
	endedAt: string;
	pausedAt: string | null;
	durationMinutes: number;
	hasReport: boolean;
};

export async function listChats() {
	return apiRequest<Chat[]>("/chats");
}

export async function createChat(patientId: string) {
	return apiRequest<Chat>("/chats", {
		method: "POST",
		body: { patientId },
	});
}

export async function getChat(chatId: string) {
	return apiRequest<Chat>(`/chats/${chatId}`);
}

export async function listChatHistory() {
	return apiRequest<ChatHistoryItem[]>("/chats/history");
}

export async function pauseChat(chatId: string) {
	return apiRequest<{ ok: boolean }>(`/chats/${chatId}/pause`, {
		method: "POST",
	});
}

export async function endChat(chatId: string) {
	return apiRequest<{ ok: boolean }>(`/chats/${chatId}/end`, {
		method: "POST",
	});
}

export async function deleteChat(chatId: string) {
	return apiRequest<{ success: boolean }>(`/chats/${chatId}`, {
		method: "DELETE",
	});
}

// --- Messages ---

export type Message = {
	id: string;
	chatId: string;
	role: "user" | "model";
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
			method: "POST",
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

export type FriendInfo = FriendUser & {
	friendshipId: string;
	nickname: string | null;
};

export type FriendSearchResult = FriendUser & {
	relation: "none" | "pending" | "accepted" | "incoming";
	requestId?: string;
};

export async function listFriends() {
	return apiRequest<FriendInfo[]>("/friends");
}

export async function updateFriendNickname(
	friendshipId: string,
	nickname: string | null,
) {
	return apiRequest<{ ok: boolean }>(
		`/friends/${friendshipId}/nickname`,
		{
			method: "PUT",
			body: { nickname },
		},
	);
}

export async function searchFriends(name: string) {
	return apiRequest<FriendSearchResult[]>(
		`/friends/search?name=${encodeURIComponent(name)}`,
	);
}

export async function requestFriend(userId: string) {
	return apiRequest<{ ok: boolean }>("/friends/requests", {
		method: "POST",
		body: { userId },
	});
}

export async function removeFriend(friendId: string) {
	return apiRequest<{ ok: boolean }>(`/friends/${friendId}`, {
		method: "DELETE",
	});
}

export type FriendRequest = {
	id: string;
	requester: FriendUser & { email?: string };
	createdAt: string;
};

export async function listFriendRequests() {
	return apiRequest<FriendRequest[]>("/friends/requests");
}

export async function respondToFriendRequest(
	requestId: string,
	status: "ACCEPTED" | "DECLINED",
) {
	return apiRequest<{ ok: boolean }>(`/friends/requests/${requestId}`, {
		method: "PUT",
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
	status: "active" | "archived";
	downloadUrl: string | null;
};

export type BillingSummary = {
	plan: "FREE" | "PREMIUM";
	invoices: BillingInvoice[];
	checkoutAvailable: boolean;
};

export async function getBillingSummary() {
	return apiRequest<BillingSummary>("/payments/billing");
}

export async function startPremiumCheckout() {
	return apiRequest<{ url: string }>("/payments/checkout", { method: "POST" });
}

export async function confirmPremiumCheckout(sessionId: string) {
	return apiRequest<{ ok: boolean; plan: "FREE" | "PREMIUM" }>(
		"/payments/confirm",
		{
			method: "POST",
			body: { sessionId },
		},
	);
}

// --- Review ---

export type MoveAnalysis = {
	messageId: string;
	moveIndex: number;
	moveNumber: number;
	content: string;
	score: number;
	quality: "strong" | "adequate" | "needs_attention" | "needs_adjustment";
	category: string;
	feedback: string;
	highlights: string[];
	improvements: string[];
};

export type ReviewResult = {
	chatId: string;
	reviewStatus: "PENDING" | "READY" | "FAILED";
	errorMessage: string | null;
	patient: { name: string; age: number; problem: string };
	moves: MoveAnalysis[];
	totalScore: number;
	averageMove: number;
	totalMessages: number;
	analyzedAt: string | null;
};

export async function getChatReview(chatId: string) {
	return apiRequest<ReviewResult>(`/chats/${chatId}/review`);
}

export async function recomputeChatReview(chatId: string) {
	return apiRequest<{ ok: boolean }>(`/chats/${chatId}/review/recompute`, {
		method: "POST",
	});
}

export async function downloadChatReviewReport(chatId: string) {
	const headers: HeadersInit = {};
	const session = getStoredSession();
	if (session?.access) {
		headers["Authorization"] = `Bearer ${session.access}`;
	}

	const res = await fetch(`${API_BASE}/chats/${chatId}/review/report`, {
		headers,
		credentials: "include",
	});
	if (!res.ok) {
		throw new ApiError("Failed to download report.", res.status);
	}
	return await res.blob();
}

export async function waitForReviewReady(
	chatId: string,
	maxAttempts = 20,
	intervalMs = 1500,
) {
	for (let i = 0; i < maxAttempts; i++) {
		const review = await getChatReview(chatId);
		if (review.reviewStatus === "READY" || review.reviewStatus === "FAILED") {
			return review;
		}
		await new Promise((r) => setTimeout(r, intervalMs));
	}
	return getChatReview(chatId);
}

export async function waitForModelReply(
	chatId: string,
	previousModelCount: number,
	maxAttempts = 60,
	intervalMs = 2000,
): Promise<string | null> {
	for (let i = 0; i < maxAttempts; i++) {
		await new Promise((r) => setTimeout(r, intervalMs));
		const messages = await listMessages(chatId);
		const modelMessages = messages.filter((m) => m.role === "model");
		if (modelMessages.length > previousModelCount) {
			return modelMessages[modelMessages.length - 1].content;
		}
	}
	return null;
}
