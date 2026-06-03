import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiError, verifySession } from '@/lib/api';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth/verify')({
	validateSearch: (search: Record<string, unknown>) => ({
		token:
			typeof search.token === 'string'
				? search.token.trim()
				: '',
	}),
	component: VerifyPage,
});

function VerifyPage() {
	const { t } = useTranslation();
	const { token } = Route.useSearch();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const [message, setMessage] = useState(t('auth.verify_loading_message'));

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage(t('auth.verify_error_message_invalid'));
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				const result = await verifySession(token);
				if (cancelled) return;
				setStatus('success');
				setMessage(t('auth.verify_success_message'));
				const target = result.onboardingCompleted
					? '/dashboard'
					: '/auth/onboarding';
				setTimeout(() => navigate({ to: target }), 800);
			} catch (e) {
				if (cancelled) return;
				setStatus('error');
				setMessage(
					e instanceof ApiError
						? e.message
						: t('auth.verify_error_message_generic'),
				);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [token, navigate, t]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
			<img src="/logo.svg" alt={t('auth.verify_alt_logo')} className="h-12 w-12" loading="lazy" />
			<h1 className="text-xl font-semibold text-foreground">
				{status === 'loading' && t('auth.verify_loading_title')}
				{status === 'success' && t('auth.verify_success_title')}
				{status === 'error' && t('auth.verify_error_title')}
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message}</p>
			{status === 'error' && (
				<Button asChild className="rounded-full">
					<Link to="/">{t('auth.verify_back_to_home')}</Link>
				</Button>
			)}
		</div>
	);
}
