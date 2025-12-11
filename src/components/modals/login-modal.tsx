import { BsGoogle } from "react-icons/bs";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Google } from "../ui/svgs/google";

const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address." }),
});

export default function LoginModal({
  setRegister,
  login,
  setLogin,
}: {
  setRegister: (value: boolean) => void;
  login: boolean;
  setLogin: (value: boolean) => void;
}) {
  const loginForm = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof LoginFormSchema>) {}

  return (
    <Dialog open={login} onOpenChange={setLogin} modal={true}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full px-6 text-white"
          onClick={() => setLogin(true)}
        >
          Começar
        </Button>
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
              <Button size="lg" type="submit">
                Continuar com e-mail
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter className="justify-center">
          <Button
            variant="link"
            onClick={() => {
              setLogin(false);
              setRegister(true);
            }}
          >
            Criar conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
