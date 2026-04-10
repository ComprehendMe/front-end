import { useStore } from "@tanstack/react-store";
import { authStore } from "@/store/auth";

export function useAuth() {
  return useStore(authStore, (state) => state);
}
