import { Store } from "@tanstack/store";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
};

export const authStore = new Store<AuthState>({
  user: null,
  loading: true,
});

export function setUser(user: AuthUser | null) {
  authStore.setState(() => ({
    user,
    loading: false,
  }));
}

export function setLoading(loading: boolean) {
  authStore.setState((state) => ({
    ...state,
    loading,
  }));
}
