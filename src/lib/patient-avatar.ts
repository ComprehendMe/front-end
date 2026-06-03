const PATIENT_AVATAR_MAP: Record<string, string> = {
  "Emma Richardson": "/patients/Emma Richardson.webp",
  "Lucas Mendes": "/patients/Lucas Mendes.webp",
  "Sofia Andersson": "/patients/Sofia Andersson.webp",
  "James Carter": "/patients/James Carter.webp",
};

const FALLBACK_AVATAR = "https://github.com/shadcn.png";

export function getPatientAvatar(patientName: string): string {
  return PATIENT_AVATAR_MAP[patientName] ?? FALLBACK_AVATAR;
}
