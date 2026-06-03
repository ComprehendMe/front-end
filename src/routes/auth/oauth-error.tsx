import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation();
	const { message } = Route.useSearch();
	const defaultMsg = t('auth.oauth_error_default_message');

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
			<img src="/logo.svg" alt={t('auth.verify_alt_logo')} className="h-12 w-12" loading="lazy" />
			<h1 className="text-xl font-semibold text-foreground">
				{t('auth.oauth_error_title')}
			</h1>
			<p className="max-w-md text-center text-muted-foreground">{message === 'Could not sign in with Google.' ? defaultMsg : message}</p>
			{(message || '').toLowerCase().includes('callback') ? (
				<div className="max-w-lg rounded-xl border bg-muted/40 px-4 py-3 text-left text-sm text-muted-foreground">
					<p className="font-medium text-foreground">{t('auth.oauth_error_auth0_setup')}</p>
					<p className="mt-2">
						{t('auth.oauth_error_auth0_instruction')}
					</p>
					<ul className="mt-2 list-inside list-disc space-y-1 font-mono text-xs">
						<li>{t('auth.oauth_error_callback_localhost')}</li>
						<li>{t('auth.oauth_error_callback_127')}</li>
					</ul>
				</div>
			) : null}
			<Button asChild className="rounded-full">
				<Link to="/">{t('auth.oauth_error_back')}</Link>
			</Button>
		</div>
	);
}
