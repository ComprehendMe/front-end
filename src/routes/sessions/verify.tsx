import { api } from "@/lib/api";
import type { AuthUser } from "@/store/auth";
import { setUser } from "@/store/auth";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/sessions/verify")({
  validateSearch: (search: Record<string, unknown>) => ({
    token: search.token as string | undefined,
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Token em falta");
        return;
      }

      try {
        const verifyResponse = await fetch(`/api/sessions/verify?token=${encodeURIComponent(token)}`, {
          credentials: "include",
        });

        if (!verifyResponse.ok) {
          throw new Error("Invalid link");
        }

        const user = await api<AuthUser>("/users/@me");
        if (!user) {
          throw new Error("Missing user after verify");
        }

        setUser(user);
        await navigate({ to: "/dashboard" });
      } catch {
        setStatus("error");
        setErrorMessage("Link inválido ou expirado.");
      }
    };

    void verify();
  }, [navigate, token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        A verificar o teu link...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      {errorMessage}
    </div>
  );
}
