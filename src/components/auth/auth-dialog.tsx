import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import LoginForm from "./forms/login";
import SignUpForm from "./forms/register";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "../ui/stepper";
import { ChevronLeft } from "lucide-react";

const steps = [1, 2, 3, 4];

export default function AuthDialog() {
  const [mode, setMode] = useState<"login" | "register" | "steps">("login");
  const [currentStep, setCurrentStep] = useState(1);
  const toggleMode = () => setMode(mode === "login" ? "register" : "login");

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 text-white">To start</Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "gap-6",
          mode !== "steps" ? "sm:max-w-[444px]" : "sm:max-w-[450px] p-0",
        )}
      >
        {mode !== "steps" ? (
          <DialogHeader className=" items-center">
            <DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
              Welcome to CogniAI
            </DialogTitle>
          </DialogHeader>
        ) : (
          <div>
            <DialogHeader className="py-3.5 px-10">
              <DialogTitle>You’re almost there!</DialogTitle>
              <DialogDescription>
                {currentStep} of {steps.length} completed
              </DialogDescription>
              <Stepper value={currentStep} onValueChange={setCurrentStep}>
                {steps.map((step) => (
                  <StepperItem key={step} step={step} className="flex-1">
                    <StepperTrigger
                      className="w-full flex-col items-start gap-2"
                      asChild
                    >
                      <StepperIndicator
                        asChild
                        className="h-2 w-full bg-border rounded-none"
                      >
                        <span className="sr-only">{step}</span>
                      </StepperIndicator>
                    </StepperTrigger>
                  </StepperItem>
                ))}
              </Stepper>
            </DialogHeader>
            <Separator />
            <div className="py-3.5 px-10">test</div>
            <DialogFooter className="justify-between items-center px-10 py-6">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
                className="text-[#1C1F22] text-[16px] font-normal"
              >
                <ChevronLeft className="w-6 h-6" />
                <span>To go back</span>
              </Button>
              <Button
                size="lg"
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={currentStep >= steps.length}
                className="rounded-full text-[16px] font-normal"
              >
                Continue
              </Button>
            </DialogFooter>
          </div>
        )}
        {mode === "login" && <LoginForm toggleMode={toggleMode} />}
        {mode === "register" && (
          <SignUpForm setMode={setMode} toggleMode={toggleMode} />
        )}
      </DialogContent>
    </Dialog>
  );
}
