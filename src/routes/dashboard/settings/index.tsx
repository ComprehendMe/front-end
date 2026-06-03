import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DashboardButton } from "@/components/dashboard/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	ApiError,
	deleteAccount,
	getMe,
	logout,
	removeAvatar,
	requestEmailChange,
	updateMe,
	uploadAvatarBlob,
} from "@/lib/api";
import { fileToWebpBlob } from "@/lib/image";
import { getInitials, joinFullName, splitFullName } from "@/lib/user-display";
import { Route as DashboardRoute } from "../../dashboard";

export const Route = createFileRoute("/dashboard/settings/")({
	component: SettingsPage,
});

function SettingsPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const { user: contextUser } = DashboardRoute.useRouteContext();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState(contextUser.email);
	const [avatar, setAvatar] = useState<string | null | undefined>(
		contextUser.avatar,
	);
	const [saving, setSaving] = useState(false);
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [editingEmail, setEditingEmail] = useState(false);
	const [newEmail, setNewEmail] = useState("");
	const [emailVerificationSent, setEmailVerificationSent] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		const { firstName: f, lastName: l } = splitFullName(contextUser.name);
		setFirstName(f);
		setLastName(l);
		setEmail(contextUser.email);
		setAvatar(contextUser.avatar);
	}, [contextUser]);

	async function handleSaveProfile() {
		const name = joinFullName(firstName, lastName);
		if (!name.trim()) {
			toast.error(t('dashboard.settings.account.toast_name_required'));
			return;
		}

		setSaving(true);
		try {
			await updateMe({ name: name.trim() });
			await router.invalidate();
			const fresh = await getMe();
			const parts = splitFullName(fresh.name);
			setFirstName(parts.firstName);
			setLastName(parts.lastName);
			setAvatar(fresh.avatar);
			toast.success(t('dashboard.settings.account.toast_profile_updated'));
		} catch (e) {
			toast.error(e instanceof ApiError ? e.message : t('dashboard.settings.account.toast_save_error'));
		} finally {
			setSaving(false);
		}
	}

	async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error(t('dashboard.settings.account.toast_image_too_large'));
			return;
		}

		setAvatarLoading(true);
		try {
			const webp = await fileToWebpBlob(file);
			const fresh = await uploadAvatarBlob(webp);
			setAvatar(fresh.avatar);
			await router.invalidate();
			toast.success(t('dashboard.settings.account.toast_photo_updated'));
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : t('dashboard.settings.account.toast_photo_update_error'),
			);
		} finally {
			setAvatarLoading(false);
			e.target.value = "";
		}
	}

	async function handleRemoveAvatar() {
		setAvatarLoading(true);
		try {
			await removeAvatar();
			setAvatar(null);
			await router.invalidate();
			toast.success(t('dashboard.settings.account.toast_photo_removed'));
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : t('dashboard.settings.account.toast_photo_remove_error'),
			);
		} finally {
			setAvatarLoading(false);
		}
	}

	async function handleChangeEmail() {
		if (!newEmail.trim() || newEmail === email) {
			setEditingEmail(false);
			return;
		}

		setSaving(true);
		try {
			const result = await requestEmailChange(newEmail.trim());
			setEmailVerificationSent(true);
			setEditingEmail(false);
			toast.success(result.message || t('dashboard.settings.account.toast_email_sent'));
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.account.toast_email_change_error'),
			);
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount() {
		setDeleting(true);
		try {
			await deleteAccount();
			toast.success(t('dashboard.settings.account.toast_account_deleted'));
			await router.navigate({ to: "/" });
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : t('dashboard.settings.account.toast_delete_error'),
			);
			setConfirmDelete(false);
		} finally {
			setDeleting(false);
		}
	}

	async function handleLogoutAll() {
		try {
			await logout();
			await router.navigate({ to: "/" });
		} catch {
			toast.error(t('dashboard.settings.account.toast_logout_error'));
		}
	}

	const initials = getInitials({
		...contextUser,
		name: joinFullName(firstName, lastName) || contextUser.name,
	});

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.account.title')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-[18px]">
					<p className="font-semibold text-[#4B4E58] text-[16px]">
						{t('dashboard.settings.account.profile_photo')}
					</p>
					<div className="flex items-center gap-4">
						<Avatar className="h-[120px] w-[120px]">
							{avatar ? <AvatarImage src={avatar} alt="" /> : null}
							<AvatarFallback className="bg-primary/10 text-2xl text-primary">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col gap-3">
							<div className="flex flex-wrap gap-2">
								<DashboardButton
									className="rounded-full"
									disabled={avatarLoading}
									asChild
								>
									<label className="cursor-pointer">
										{avatarLoading ? t('dashboard.settings.account.uploading_dots') : t('dashboard.settings.account.change_image')}
										<input
											type="file"
											accept="image/png,image/jpeg,image/webp"
											className="sr-only"
											onChange={(e) => void handleAvatarChange(e)}
										/>
									</label>
								</DashboardButton>
								<DashboardButton
									className="rounded-full"
									variant="secondary"
									disabled={avatarLoading || !avatar}
									onClick={() => void handleRemoveAvatar()}
								>
									{t('dashboard.settings.account.remove_image')}
								</DashboardButton>
							</div>
							<p className="font-medium text-[#757575] text-sm">
								{t('dashboard.settings.account.image_hint')}
							</p>
						</div>
					</div>
				</div>
				<div className="mt-5 grid w-full grid-cols-1 gap-3.5 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.account.first_name')}
						</p>
						<Input
							className="w-full bg-gray-100"
							placeholder={t('dashboard.settings.account.first_name_placeholder')}
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.account.last_name')}
						</p>
						<Input
							className="w-full bg-gray-100"
							placeholder={t('dashboard.settings.account.last_name_placeholder')}
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
						/>
					</div>
				</div>
				<DashboardButton
					className="mt-5 w-fit rounded-full"
					disabled={saving}
					onClick={() => void handleSaveProfile()}
				>
					{saving ? t('dashboard.settings.account.saving_dots') : t('dashboard.settings.account.save_changes')}
				</DashboardButton>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.account.account_security')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1.5">
						<p className="font-semibold text-[#4B4E58] text-[16px]">{t('dashboard.settings.account.email_label')}</p>
						<p className="text-[#1C1F22] text-sm">{email}</p>
					</div>
					{emailVerificationSent ? (
						<p className="text-sm text-emerald-600 font-medium">
							{t('dashboard.settings.account.verification_sent', { email: newEmail })}
						</p>
					) : editingEmail ? (
						<div className="flex items-center gap-2">
							<Input
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								placeholder={t('dashboard.settings.account.email_change_placeholder')}
								className="w-full sm:w-[220px] bg-gray-100"
							/>
							<DashboardButton
								className="rounded-full"
								disabled={saving}
								onClick={() => void handleChangeEmail()}
							>
								{saving ? t('dashboard.settings.account.saving_dots') : t('dashboard.settings.account.change_email')}
							</DashboardButton>
							<DashboardButton
								className="rounded-full"
								variant="secondary"
								disabled={saving}
								onClick={() => setEditingEmail(false)}
							>
								{t('common.cancel')}
							</DashboardButton>
						</div>
					) : (
						<DashboardButton
							className="rounded-full"
							variant="secondary"
							onClick={() => {
								setNewEmail(email);
								setEditingEmail(true);
								setEmailVerificationSent(false);
							}}
						>
							{t('dashboard.settings.account.change_email')}
						</DashboardButton>
					)}
				</div>
				<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1.5">
						<p className="font-semibold text-[#4B4E58] text-[16px]">{t('dashboard.settings.account.password_label')}</p>
						<p className="text-sm text-[#757575]">
							{t('dashboard.settings.account.password_hint')}
						</p>
					</div>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.account.support_access')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.account.logout_all')}
						</p>
						<span className="font-normal text-[#757575] text-sm tracking-tight">
							{t('dashboard.settings.account.logout_all_desc')}
						</span>
					</div>
					<DashboardButton
						className="rounded-full"
						variant="secondary"
						onClick={() => void handleLogoutAll()}
					>
						{t('dashboard.settings.account.log_out')}
					</DashboardButton>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					{t('dashboard.settings.account.delete_account')}
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							{t('dashboard.settings.account.delete_account_label')}
						</p>
						<span className="font-normal text-[#757575] text-sm tracking-tight">
							{t('dashboard.settings.account.delete_account_desc')}
						</span>
					</div>
					{confirmDelete ? (
						<div className="flex items-center gap-2">
							<DashboardButton
								className="rounded-full"
								variant="destructive"
								disabled={deleting}
								onClick={() => void handleDeleteAccount()}
							>
								{deleting ? t('dashboard.settings.account.deleting_dots') : t('dashboard.settings.account.confirm_delete')}
							</DashboardButton>
							<DashboardButton
								className="rounded-full"
								variant="secondary"
								disabled={deleting}
								onClick={() => setConfirmDelete(false)}
							>
								{t('common.cancel')}
							</DashboardButton>
						</div>
					) : (
						<DashboardButton
							className="rounded-full"
							variant="destructive"
							onClick={() => setConfirmDelete(true)}
						>
							{t('dashboard.settings.account.delete_account_btn')}
						</DashboardButton>
					)}
				</div>
			</div>
		</div>
	);
}
