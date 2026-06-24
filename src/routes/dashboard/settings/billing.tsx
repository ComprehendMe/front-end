import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Download, Search, SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DashboardButton } from "@/components/dashboard/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ApiError,
	type BillingInvoice,
	type BillingSummary,
	confirmPremiumCheckout,
	getBillingSummary,
	startPremiumCheckout,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/settings/billing")({
	validateSearch: (search: Record<string, unknown>) => ({
		session_id:
			typeof search.session_id === "string" ? search.session_id : undefined,
	}),
	component: BillingPage,
});

type InvoiceFilter = "all" | "active" | "archived";

function PlanCard({
	title,
	price,
	features,
	action,
	highlight,
}: {
	title: string;
	price: string;
	features: string[];
	action: ReactNode;
	highlight?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex flex-1 flex-col rounded-2xl border border-[#E8EDF2] bg-white p-6 max-w-[min(100%,32rem)]",
				highlight && "ring-1 ring-primary/20",
			)}
		>
			<p className="text-lg font-medium text-[#4B4E58]">{title}</p>
			<p className="mt-2 text-3xl font-bold text-[#1C1F22]">{price}</p>
			<ul className="mt-6 flex flex-1 flex-col gap-3">
				{features.map((feature) => (
					<li
						key={feature}
						className="flex items-center gap-2 text-sm text-[#4B4E58]"
					>
						<Check className="h-4 w-4 shrink-0 text-primary" />
						{feature}
					</li>
				))}
			</ul>
			<div className="mt-8">{action}</div>
		</div>
	);
}

function BillingPage() {
	const { t } = useTranslation();
	const { session_id: sessionId } = Route.useSearch();
	const navigate = useNavigate();
	const [billing, setBilling] = useState<BillingSummary | null>(null);
	const [loading, setLoading] = useState(true);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [invoiceFilter, setInvoiceFilter] = useState<InvoiceFilter>("all");
	const [invoiceSearch, setInvoiceSearch] = useState("");
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const featuresBasic = useMemo(() => [
		t('dashboard.settings.billing.basic_feature_1'),
		t('dashboard.settings.billing.basic_feature_2'),
		t('dashboard.settings.billing.basic_feature_3'),
	], [t]);

	const featuresPremium = useMemo(() => [
		t('dashboard.settings.billing.premium_feature_1'),
		t('dashboard.settings.billing.premium_feature_2'),
		t('dashboard.settings.billing.premium_feature_3'),
		t('dashboard.settings.billing.premium_feature_4'),
	], [t]);

	const loadBilling = useCallback(async () => {
		try {
			const data = await getBillingSummary();
			setBilling(data);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.billing.toast_load_error'),
			);
		} finally {
			setLoading(false);
		}
	}, [t]);

	useEffect(() => {
		void loadBilling();
	}, [loadBilling]);

	useEffect(() => {
		if (!sessionId) return;

		let cancelled = false;
		(async () => {
			try {
				const result = await confirmPremiumCheckout(sessionId);
				if (cancelled) return;
				if (result.ok) {
					toast.success(t('dashboard.settings.billing.toast_premium_activated'));
					await loadBilling();
				}
				await navigate({
					to: "/dashboard/settings/billing",
					search: { session_id: undefined, ec: undefined },
					replace: true,
				});
			} catch (e) {
				if (cancelled) return;
				toast.error(
					e instanceof ApiError ? e.message : t('dashboard.settings.billing.toast_confirm_error'),
				);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [sessionId, loadBilling, navigate, t]);

	const filteredInvoices = useMemo(() => {
		if (!billing?.invoices.length) return [];
		return billing.invoices.filter((inv: BillingInvoice) => {
			if (invoiceFilter !== "all" && inv.status !== invoiceFilter) {
				return false;
			}
			if (!invoiceSearch.trim()) return true;
			return inv.name.toLowerCase().includes(invoiceSearch.toLowerCase());
		});
	}, [billing, invoiceFilter, invoiceSearch]);

	const isPremium = billing?.plan === "PREMIUM";

	async function handleUpgrade() {
		if (!billing?.checkoutAvailable) {
			toast.error(t('dashboard.settings.billing.toast_upgrade_unavailable'));
			return;
		}

		setCheckoutLoading(true);
		try {
			const { url } = await startPremiumCheckout();
			window.location.assign(url);
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.billing.toast_checkout_error'),
			);
			setCheckoutLoading(false);
		}
	}

	function toggleInvoice(id: string) {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}

	if (loading) {
		return (
			<div className="flex w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<p className="text-muted-foreground">{t('common.loading')}</p>
			</div>
		);
	}

	const filterOptions: { value: InvoiceFilter; label: string }[] = [
		{ value: "all", label: t('dashboard.settings.billing.filter_all') },
		{ value: "active", label: t('dashboard.settings.billing.filter_active') },
		{ value: "archived", label: t('dashboard.settings.billing.filter_archived') },
	];

	return (
		<div className="flex w-full flex-col border-t lg:border-l lg:border-t-0">
			<div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
				<h3 className="text-lg font-semibold text-[#4B4E58]">{t('dashboard.settings.billing.title')}</h3>
				<Separator className="mt-3.5" />

				<div className="mt-6 flex flex-col gap-5 lg:flex-row 4xl:gap-8">
					<PlanCard
						title={t('dashboard.settings.billing.basic_plan')}
						price={t('dashboard.settings.billing.basic_price')}
						features={featuresBasic}
						action={
							<DashboardButton
								className="w-full rounded-full"
								variant="secondary"
								disabled={!isPremium}
							>
								{!isPremium ? t('dashboard.settings.billing.basic_current_plan') : t('dashboard.settings.billing.basic_switch')}
							</DashboardButton>
						}
					/>
					<PlanCard
						title={t('dashboard.settings.billing.premium_plan')}
						price={t('dashboard.settings.billing.premium_price')}
						features={featuresPremium}
						highlight
						action={
							<DashboardButton
								className="w-full rounded-full"
								disabled={isPremium || checkoutLoading}
								onClick={() => void handleUpgrade()}
							>
								{isPremium
									? t('dashboard.settings.billing.premium_current_plan')
									: checkoutLoading
										? t('common.redirecting')
										: t('dashboard.settings.billing.premium_switch')}
							</DashboardButton>
						}
					/>
				</div>
			</div>

			<div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
				<h4 className="text-base font-semibold text-[#4B4E58]">
					{t('dashboard.settings.billing.previous_invoices')}
				</h4>

				{billing && billing.invoices.length > 0 ? (
					<>
						<div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
							<div className="flex flex-wrap gap-2">
								{filterOptions.map(({ value, label }) => (
									<button
										key={value}
										type="button"
										onClick={() => setInvoiceFilter(value)}
										className={cn(
											"rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
											invoiceFilter === value
												? "bg-[#1C1F22] text-white"
												: "bg-[#F0F5FA] text-[#4B4E58] hover:bg-[#E2E8F0]",
										)}
									>
										{label}
									</button>
								))}
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<div className="relative min-w-[180px]">
									<Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
									<Input
										placeholder={t('dashboard.settings.billing.search_placeholder')}
										value={invoiceSearch}
										onChange={(e) => setInvoiceSearch(e.target.value)}
										className="h-9 rounded-lg bg-[#F0F5FA] pl-9"
									/>
								</div>
								<button
									type="button"
									className="flex h-9 items-center gap-2 rounded-lg border border-[#E8EDF2] bg-white px-3 text-sm font-medium text-[#4B4E58]"
								>
									<SlidersHorizontal className="h-4 w-4" />
									{t('dashboard.settings.billing.sort_most_recent')}
								</button>
							</div>
						</div>

						<div className="mt-4 overflow-hidden rounded-xl border border-[#E8EDF2]">
							<div className="w-full overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow className="bg-[#FAFBFC] hover:bg-[#FAFBFC]">
											<TableHead className="w-10" />
											<TableHead className="font-semibold text-[#4B4E58]">
												{t('dashboard.settings.billing.table_invoice_name')}
											</TableHead>
											<TableHead className="font-semibold text-[#4B4E58]">
												{t('dashboard.settings.billing.table_date')}
											</TableHead>
											<TableHead className="font-semibold text-[#4B4E58]">
												{t('dashboard.settings.billing.table_plan_type')}
											</TableHead>
											<TableHead className="font-semibold text-[#4B4E58]">
												{t('dashboard.settings.billing.table_amount')}
											</TableHead>
											<TableHead className="w-12" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredInvoices.map((invoice) => (
											<TableRow key={invoice.id}>
												<TableCell>
													<input
														type="checkbox"
														checked={selectedIds.has(invoice.id)}
														onChange={() => toggleInvoice(invoice.id)}
														className="h-4 w-4 rounded border-gray-300"
													/>
												</TableCell>
												<TableCell className="font-medium">
													{invoice.name}
												</TableCell>
												<TableCell className="text-muted-foreground">
													{invoice.date}
												</TableCell>
												<TableCell className="text-muted-foreground">
													{invoice.plan}
												</TableCell>
												<TableCell className="font-medium">
													{invoice.amount}
												</TableCell>
												<TableCell>
													{invoice.downloadUrl ? (
														<a
															href={invoice.downloadUrl}
															target="_blank"
															rel="noreferrer"
															className="text-muted-foreground hover:text-primary"
															aria-label={t('dashboard.settings.billing.invoice_download_aria', { name: invoice.name })}
														>
															<Download className="h-4 w-4" />
														</a>
													) : null}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</>
				) : (
					<p className="mt-4 text-sm text-muted-foreground">
						{t('dashboard.settings.billing.no_invoices')}
					</p>
				)}
			</div>
		</div>
	);
}
