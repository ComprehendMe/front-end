import z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { BsGoogle } from "react-icons/bs";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const RegisterFormSchema = z.object({
  name: z.string().min(3, "Minimo de 3 characteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email({ message: "Porfavor, insira um email válido." }),
  password: z
    .string()
    .min(8, { message: "Uma senha deve ter no mínimo 8 caracteres." })
    .max(20, { message: "Uma senha deve ter no máximo 20 caracteres." })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Sua senha deve ter um caractere maiúsculo",
    })
    .refine((password) => /[a-z]/.test(password), {
      message: "Sua senha deve ter um caractere minusculo",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Sua senha deve ter um caractere numérico",
    })
    .refine((password) => /[!@#$%^&*]/.test(password), {
      message: "Sua senha deve ter um caractere especial",
    }),
});

export default function RegisterModal({
  register,
  setLogin,
  setRegister,
}: {
  register: boolean;
  setRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();
  const registerForm = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(data: z.infer<typeof RegisterFormSchema>) {}

  return (
    <Dialog modal={true} open={register} onOpenChange={setRegister}>
      <DialogContent showCloseButton className="sm:max-w-[450px] gap-6">
        <DialogHeader className=" items-center">
          <DialogTitle className="text-[24px] font-semibold">
            Bem vindo ao CogniAI
          </DialogTitle>
        </DialogHeader>
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="flex gap-4 flex-col"
          >
            <div className="flex w-full flex-col gap-4 text-center">
              <Button variant="outline" size="lg">
                <BsGoogle />
                <span className="font-normal">Continuar com Google</span>
              </Button>
              <span>ou</span>
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nome"
                        className="py-2.5 px-5 h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
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
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id={id}
                          type={isVisible ? "text" : "password"}
                          placeholder="Senha"
                          className="py-2.5 px-5 h-10"
                          {...field}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setIsVisible((prevState) => !prevState)
                          }
                          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                        >
                          {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                          <span className="sr-only">
                            {isVisible ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="justify-between items-center">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setRegister(false);
                  setLogin(true);
                }}
              >
                <span>Voltar</span>
              </Button>
              <Button size="lg" type="submit">
                Registrar-se
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
