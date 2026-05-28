import { createFileRoute, useRouter } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DashboardButton } from '@/components/dashboard/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ApiError, getMe, logout, removeAvatar, updateMe, uploadAvatarBlob } from '@/lib/api';
import { fileToWebpBlob } from '@/lib/image';
import {
	getInitials,
	joinFullName,
	splitFullName,
} from '@/lib/user-display';
import { Route as DashboardRoute } from '../../dashboard';

export const Route = createFileRoute('/dashboard/settings/')({
	component: SettingsPage,
});

function SettingsPage() {
	const router = useRouter();
	const { user: contextUser } = DashboardRoute.useRouteContext();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState(contextUser.email);
	const [avatar, setAvatar] = useState<string | null | undefined>(
		contextUser.avatar,
	);
	const [saving, setSaving] = useState(false);
	const [avatarLoading, setAvatarLoading] = useState(false);

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
			toast.error('Please enter at least a first name.');
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
			toast.success('Profile updated.');
		} catch (e) {
			toast.error(
				e instanceof ApiError ? e.message : 'Could not save.',
			);
		} finally {
			setSaving(false);
		}
	}

	async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error('Image is too large (max 2MB).');
			return;
		}

		setAvatarLoading(true);
		try {
			const webp = await fileToWebpBlob(file);
			const fresh = await uploadAvatarBlob(webp);
			setAvatar(fresh.avatar);
			await router.invalidate();
			toast.success('Profile photo updated.');
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : 'Could not update photo.',
			);
		} finally {
			setAvatarLoading(false);
			e.target.value = '';
		}
	}

	async function handleRemoveAvatar() {
		setAvatarLoading(true);
		try {
			await removeAvatar();
			setAvatar(null);
			await router.invalidate();
			toast.success('Photo removed.');
		} catch (err) {
			toast.error(
				err instanceof ApiError ? err.message : 'Could not remove photo.',
			);
		} finally {
			setAvatarLoading(false);
		}
	}

	async function handleLogoutAll() {
		try {
			await logout();
			await router.navigate({ to: '/' });
		} catch {
			toast.error('Could not sign out.');
		}
	}

	const initials = getInitials({
		...contextUser,
		name: joinFullName(firstName, lastName) || contextUser.name,
	});

	return (
		<div className="flex w-full flex-col">
			<div className="flex h-full w-full flex-col border-t px-fluid-container py-fluid-md lg:border-l lg:border-t-0">
				<h3 className="text-fluid-lg font-semibold text-[#4B4E58]">My Profile</h3>
				<Separator className="mt-3.5" />
				<div className="flex flex-col gap-5">
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
											{avatarLoading ? 'Uploading…' : 'Change Image'}
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
					<div className="grid w-full grid-cols-1 gap-3.5 md:grid-cols-2">
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
						className="w-fit rounded-full"
						disabled={saving}
						onClick={() => void handleSaveProfile()}
					>
						{saving ? 'Saving…' : 'Save changes'}
					</DashboardButton>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-fluid-container py-fluid-md lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-fluid-lg">
					Account security
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex w-full flex-col gap-3.5">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-[#4B4E58] text-[16px]">Email</p>
						<Input disabled value={email} className="w-full max-w-[390px] bg-gray-50" />
						<p className="text-[#757575] text-sm">
							Sign in with magic link or Google — email changes coming soon.
						</p>
					</div>
				</div>
			</div>

			<div className="flex h-full w-full flex-col border-t px-fluid-container py-fluid-md lg:border-l lg:border-t-0">
				<h3 className="font-semibold text-[#4B4E58] text-fluid-lg">
					Support Access
				</h3>
				<Separator className="mt-3.5" />
				<div className="mt-5 flex w-full flex-col gap-5">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
			</div>
		</div>
	);
}
