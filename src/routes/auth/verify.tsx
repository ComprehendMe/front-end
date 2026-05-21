import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
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
	const { token } = Route.useSearch();
	const navigate = useNavigate();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const [message, setMessage] = useState('Verifying your account…');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage('Invalid link: missing token.');
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				await verifySession(token);
				if (cancelled) return;
				setStatus('success');
				setMessage('Account verified! Redirecting…');
				setTimeout(() => navigate({ to: '/dashboard' }), 800);
			} catch (e) {
				if (cancelled) return;
				setStatus('error');
				setMessage(
					e instanceof ApiError
						? e.message
						: 'Could not verify the link. Request a new email.',
				);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [token, navigate]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
			<img src="/logo.svg" alt="ComprehendMe" className="h-12 w-12" />
			<h1 className="text-xl font-semibold text-foreground">
				{status === 'loading' && 'Verifying…'}
				{status === 'success' && 'All set!'}
				{status === 'error' && 'Something went wrong'}
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message}</p>
			{status === 'error' && (
				<Button asChild className="rounded-full">
					<Link to="/">Back to home</Link>
				</Button>
			)}
		</div>
	);
}
