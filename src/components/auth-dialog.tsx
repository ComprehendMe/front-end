import { useId, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Google } from "./ui/svgs/google";
import { Input } from "./ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address." }),
});

export default function AuthDialog() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();

  const toggleMode = () => setMode(mode === "login" ? "register" : "login");
  const togglePassword = () => setShowPassword(!showPassword);

  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {}

  return (
    <Dialog modal={true}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 text-white">Começar</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[450px] gap-6">
        <DialogHeader className=" items-center">
          <DialogTitle className="text-[24px] font-semibold">
            Bem vindo ao CogniAI
          </DialogTitle>
        </DialogHeader>
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <div className="flex w-full flex-col gap-4 text-center">
              <Button variant="outline" size="lg">
                <Google className="w-6 h-6" />
                <span className="font-normal">Continuar com Google</span>
              </Button>
              <span>ou</span>
              {mode === "login" ? (
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="E-mail"
                          className="py-2.5 px-5 h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="E-mail"
                            className="py-2.5 px-5 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="E-mail"
                            className="py-2.5 px-5 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="E-mail"
                            className="py-2.5 px-5 h-10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <Button size="lg" type="submit">
                Continuar com e-mail
              </Button>
            </div>
          </form>
        </Form>
        {mode === "login" ? (
          <DialogFooter className="justify-center">
            <Button variant="link" onClick={toggleMode}>
              Criar conta
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="justify-between items-center">
            <Button variant="ghost" size="lg" onClick={toggleMode}>
              <ChevronLeft className="w-6 h-6" />
              <span>Voltar</span>
            </Button>
            <Button size="lg" type="submit">
              Registrar-se
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
