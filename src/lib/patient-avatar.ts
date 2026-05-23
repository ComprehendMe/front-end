const PATIENT_AVATAR_MAP: Record<string, string> = {
  "Emma Richardson": "/patients/Emma Richardson.png",
  "Lucas Mendes": "/patients/Lucas Mendes.png",
  "Sofia Andersson": "/patients/Sofia Andersson.png",
  "James Carter": "/patients/James Carter.png",
};

const FALLBACK_AVATAR = "https://github.com/shadcn.png";

export function getPatientAvatar(patientName: string): string {
  return PATIENT_AVATAR_MAP[patientName] ?? FALLBACK_AVATAR;
}
