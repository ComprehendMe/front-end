import { useState } from "react";
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
import { ChevronDownIcon, ChevronLeft } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const steps = [1, 2];

export default function AuthDialog() {
  const [mode, setMode] = useState<"login" | "register" | "steps">("login");
  const [date, setDate] = useState<Date>();
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
            <DialogHeader className="py-5 px-10">
              <DialogTitle>You’re almost there!</DialogTitle>
              <DialogDescription>
                {currentStep + 1} of {steps.length + 1} completed
              </DialogDescription>
              <Stepper
                value={currentStep}
                onValueChange={setCurrentStep}
                className="mt-5"
              >
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
            {currentStep === 1 && (
              <div className="py-3.5 px-10 space-y-5">
                <div className="space-y-3">
                  <h3 className="font-medium text-[16px]">
                    What is your date of birth?
                  </h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!date}
                        className="data-[empty=true]:text-[#4B4E58] w-full h-[45px] px-5 bg-[#0978AA]/10 justify-between text-left font-normal"
                      >
                        {date ? (
                          format(date, "PPP")
                        ) : (
                          <span>June 1st, 1998</span>
                        )}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        defaultMonth={date}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-3">
                  <h3 className="font-medium text-[16px]">
                    Where do you study?
                  </h3>
                  <Input
                    placeholder="Select you college"
                    className="bg-[#0978AA]/10"
                  />
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="py-3.5 px-10 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-medium text-[16px]">
                    How did you hear about us?
                  </h3>
                  <p className="text-[#4B4E58] font-normal text-sm">
                    Pick one option - It will help us improve
                  </p>
                </div>
                <RadioGroup defaultValue="friends" className="gap-3.5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="friends" id="friends" />
                    <Label
                      className="text-[#1C1F22] text-[16px] font-normal"
                      htmlFor="friends"
                    >
                      Friends
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="university-school"
                      id="university-school"
                    />
                    <Label
                      className="text-[#1C1F22] text-[16px] font-normal"
                      htmlFor="university-school"
                    >
                      University/School
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem
                      value="recommendation"
                      id="recommendation"
                    />
                    <Label
                      className="text-[#1C1F22] text-[16px] font-normal"
                      htmlFor="recommendation"
                    >
                      Recommendation
                    </Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="others" id="others" />
                    <Label
                      className="text-[#1C1F22] text-[16px] font-normal"
                      htmlFor="others"
                    >
                      Others
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
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
