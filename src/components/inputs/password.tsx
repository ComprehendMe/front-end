import { useId, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function PasswordInput() {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  return (
    <div className="w-full">
      <div className="flex items-center relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder="Senha"
          className="py-2.5 px-5 h-10"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible((prevState) => !prevState)}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
        >
          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          <span className="sr-only">
            {isVisible ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
    </div>
  );
}
