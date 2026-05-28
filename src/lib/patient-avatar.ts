const PATIENT_AVATAR_MAP: Record<string, string> = {
  "Emma Richardson":
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Emma%20Richardson",
  "Lucas Mendes":
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Lucas%20Mendes",
  "Sofia Andersson":
    "https://api.dicebear.com/9.x/adventurer/svg?seed=Sofia%20Andersson",
  "James Carter":
    "https://api.dicebear.com/9.x/adventurer/svg?seed=James%20Carter",
};

function buildAvatarUrl(name: string): string {
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
    name
  )}`;
}

export function getPatientAvatar(patientName: string): string {
  return PATIENT_AVATAR_MAP[patientName] ?? buildAvatarUrl(patientName);
}
