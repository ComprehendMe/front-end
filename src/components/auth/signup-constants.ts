export const COLLEGE_OPTIONS = [
	'Harvard University',
	'Stanford University',
	'University of Oxford',
	'University of Cambridge',
	'MIT',
	'Yale University',
	'University of Lisbon',
	'University of Porto',
	'Other',
] as const;

export const REFERRAL_OPTIONS = [
	{ value: 'friends', label: 'Friends' },
	{ value: 'university', label: 'University/School' },
	{ value: 'recommendation', label: 'Recommendation' },
	{ value: 'others', label: 'Others' },
] as const;

export type SignupDraft = {
	name: string;
	email: string;
	dateOfBirth: string;
	college: string;
	referralSource: string;
};

export const emptySignupDraft = (): SignupDraft => ({
	name: '',
	email: '',
	dateOfBirth: '',
	college: '',
	referralSource: 'friends',
});
