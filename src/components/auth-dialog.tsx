import { useState } from "react";

export default function AuthDialog() {
  const [mode, setMode] = useState<"signuo" | "login">("signup")
}