import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
			toast.error("Please enter at least a first name.");
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
			toast.success("Profile updated.");
		} catch (e) {
			toast.error(e instanceof ApiError ? e.message : "Could not save.");
		} finally {
			setSaving(false);
		}
	}

	async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Image is too large (max 2MB).");
			return;
		}

		setAvatarLoading(true);
		try {
			const webp = await fileToWebpBlob(file);
			const fresh = await uploadAvatarBlob(webp);
			setAvatar(fresh.avatar);
			await router.invalidate();
			toast.success("Profile photo updated.");
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : "Could not update photo.",
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
			toast.success("Photo removed.");
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : "Could not remove photo.",
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
			toast.success(result.message || "Verification email sent.");
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : "Could not request email change.",
			);
		} finally {
			setSaving(false);
		}
	}

	async function handleDeleteAccount() {
		setDeleting(true);
		try {
			await deleteAccount();
			toast.success("Account deleted.");
			await router.navigate({ to: "/" });
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : "Could not delete account.",
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
			toast.error("Could not sign out.");
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
					My Profile
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-[18px]">
					<p className="font-semibold text-[#4B4E58] text-[16px]">
						Profile photo
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
										{avatarLoading ? "Uploading…" : "Change Image"}
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
									Remove Image
								</DashboardButton>
							</div>
							<p className="font-medium text-[#757575] text-sm">
								PNG, JPG or WebP up to 2MB
							</p>
						</div>
					</div>
				</div>
				<div className="mt-5 grid w-full grid-cols-1 gap-3.5 md:grid-cols-2">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							First name
						</p>
						<Input
							className="w-full bg-gray-100"
							placeholder="Jane"
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							Last name
						</p>
						<Input
							className="w-full bg-gray-100"
							placeholder="Doe"
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
					{saving ? "Saving…" : "Save changes"}
				</DashboardButton>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					Account security
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1.5">
						<p className="font-semibold text-[#4B4E58] text-[16px]">Email</p>
						<p className="text-[#1C1F22] text-sm">{email}</p>
					</div>
					{emailVerificationSent ? (
						<p className="text-sm text-emerald-600 font-medium">
							Verification email sent to {newEmail}. Check your inbox.
						</p>
					) : editingEmail ? (
						<div className="flex items-center gap-2">
							<Input
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								placeholder="new@email.com"
								className="w-full sm:w-[220px] bg-gray-100"
							/>
							<DashboardButton
								className="rounded-full"
								disabled={saving}
								onClick={() => void handleChangeEmail()}
							>
								{saving ? "Saving…" : "Save"}
							</DashboardButton>
							<DashboardButton
								className="rounded-full"
								variant="secondary"
								disabled={saving}
								onClick={() => setEditingEmail(false)}
							>
								Cancel
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
							Change email
						</DashboardButton>
					)}
				</div>
				<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1.5">
						<p className="font-semibold text-[#4B4E58] text-[16px]">Password</p>
						<p className="text-sm text-[#757575]">
							You sign in with a magic link or Google — no password needed.
						</p>
					</div>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					Support Access
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							Log out of all devices
						</p>
						<span className="font-normal text-[#757575] text-sm tracking-tight">
							Sign out on this device.
						</span>
					</div>
					<DashboardButton
						className="rounded-full"
						variant="secondary"
						onClick={() => void handleLogoutAll()}
					>
						Log out
					</DashboardButton>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-4 py-5 sm:px-6 sm:py-6 lg:border-l lg:border-t-0 lg:px-8 lg:py-8">
				<h3 className="font-semibold text-[#4B4E58] text-[18px]">
					Delete my account
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col">
						<p className="font-semibold text-[#4B4E58] text-[16px]">
							Permanently delete account
						</p>
						<span className="font-normal text-[#757575] text-sm tracking-tight">
							Permanently delete the account and remove all associated data.
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
								{deleting ? "Deleting…" : "Confirm delete"}
							</DashboardButton>
							<DashboardButton
								className="rounded-full"
								variant="secondary"
								disabled={deleting}
								onClick={() => setConfirmDelete(false)}
							>
								Cancel
							</DashboardButton>
						</div>
					) : (
						<DashboardButton
							className="rounded-full"
							variant="destructive"
							onClick={() => setConfirmDelete(true)}
						>
							Delete account
						</DashboardButton>
					)}
				</div>
			</div>
		</div>
	);
}
