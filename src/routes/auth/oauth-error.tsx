import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth/oauth-error')({
	validateSearch: (search: Record<string, unknown>) => ({
		message:
			typeof search.message === 'string'
				? search.message
				: 'Não foi possível entrar com o Google.',
	}),
	component: OAuthErrorPage,
});

function OAuthErrorPage() {
	const { message } = Route.useSearch();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
			<img src="/logo.svg" alt="ComprehendMe" className="h-12 w-12" />
			<h1 className="text-xl font-semibold text-foreground">
				Login com Google falhou
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message}</p>
			<Button asChild className="rounded-full">
				<Link to="/">Voltar à página inicial</Link>
			</Button>
		</div>
	);
}
