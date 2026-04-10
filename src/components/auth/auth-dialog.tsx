import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { api } from "@/lib/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

const EmailSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
});

type EmailFormValues = z.infer<typeof EmailSchema>;

type ApiError = {
  message?: string;
};

export default function AuthDialog() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(EmailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }: EmailFormValues) => {
    setLoading(true);
    try {
      try {
        await api("/sessions/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: { email },
        });

        setSent(true);
        setSentToEmail(email);
        return;
      } catch (signupError) {
        const parsedError = signupError as ApiError;

        if (parsedError.message !== "Email already taken") {
          toast.error(parsedError.message ?? "Failed to send magic link.");
          return;
        }
      }

      await api("/sessions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { email },
      });

      setSent(true);
      setSentToEmail(email);
    } catch (loginError) {
      const parsedError = loginError as ApiError;
      toast.error(parsedError.message ?? "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button className="rounded-full px-6 text-white">To start</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[450px] gap-6">
        <DialogHeader className="items-center">
          <DialogTitle className="text-[24px] font-medium text-[#1C1F22]">
            Welcome to CogniAI
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="text-center space-y-2">
            <p className="text-[18px] font-semibold text-[#1C1F22]">
              Verifica o teu email
            </p>
            <DialogDescription className="text-[16px] text-[#1C1F22]">
              Enviamos um magic link para <span className="font-medium">{sentToEmail}</span>.
            </DialogDescription>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex w-full flex-col gap-[19px] text-center">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          placeholder="E-mail"
                          className="py-2.5 px-5 h-[45px] text-[16px] font-normal text-[#1C1F22]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  size="lg"
                  type="submit"
                  className="rounded-full h-[45px]"
                  disabled={loading}
                >
                  {loading ? "A enviar..." : "Continue with email"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
