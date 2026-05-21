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
	const [message, setMessage] = useState('A verificar a tua conta…');

	useEffect(() => {
		if (!token) {
			setStatus('error');
			setMessage('Link inválido: token em falta.');
			return;
		}

		let cancelled = false;

		(async () => {
			try {
				await verifySession(token);
				if (cancelled) return;
				setStatus('success');
				setMessage('Conta verificada! A redirecionar…');
				setTimeout(() => navigate({ to: '/dashboard' }), 800);
			} catch (e) {
				if (cancelled) return;
				setStatus('error');
				setMessage(
					e instanceof ApiError
						? e.message
						: 'Não foi possível verificar o link. Pede um novo email.',
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
				{status === 'loading' && 'A verificar…'}
				{status === 'success' && 'Tudo pronto!'}
				{status === 'error' && 'Algo correu mal'}
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message}</p>
			{status === 'error' && (
				<Button asChild className="rounded-full">
					<Link to="/">Voltar à página inicial</Link>
				</Button>
			)}
		</div>
	);
}
