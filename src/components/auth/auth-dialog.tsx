import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LoginForm from "./forms/login";
import SignUpForm from "./forms/register";

export default function AuthDialog() {
  const [mode, setMode] = useState<"login" | "register" | "steps">("login");
  const toggleMode = () => setMode(mode === "login" ? "register" : "login");

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 text-white">To start</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[450px] gap-6">
        <DialogHeader className=" items-center">
          <DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
            Welcome to CogniAI
          </DialogTitle>
        </DialogHeader>
        {mode === "login" && <LoginForm toggleMode={toggleMode} />}
        {mode === "register" && (
          <SignUpForm setMode={setMode} toggleMode={toggleMode} />
        )}
        {mode === "steps" && <h1>test</h1>}
      </DialogContent>
    </Dialog>
  );
}
