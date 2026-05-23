import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/auth/oauth-error')({
	validateSearch: (search: Record<string, unknown>) => ({
		message:
			typeof search.message === 'string'
				? search.message
				: 'Could not sign in with Google.',
	}),
	component: OAuthErrorPage,
});

function OAuthErrorPage() {
	const { message } = Route.useSearch();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
			<img src="/logo.svg" alt="ComprehendMe" className="h-12 w-12" />
			<h1 className="text-xl font-semibold text-foreground">
				Google sign-in failed
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message}</p>
			{message.toLowerCase().includes('callback') ? (
				<div className="max-w-lg rounded-xl border bg-muted/40 px-4 py-3 text-left text-sm text-muted-foreground">
					<p className="font-medium text-foreground">Auth0 setup</p>
					<p className="mt-2">
						In Auth0 → Application → Settings → Allowed Callback URLs, add:
					</p>
					<ul className="mt-2 list-inside list-disc space-y-1 font-mono text-xs">
						<li>http://localhost:3000/api/sessions/oauth/cb</li>
						<li>http://127.0.0.1:3000/api/sessions/oauth/cb</li>
					</ul>
				</div>
			) : null}
			<Button asChild className="rounded-full">
				<Link to="/">Back to home</Link>
			</Button>
		</div>
	);
}
