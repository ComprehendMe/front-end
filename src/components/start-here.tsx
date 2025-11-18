import { BsGoogle } from "react-icons/bs";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

export default function StartHere() {
  return (
    <Dialog modal={true}>
      <form>
        <DialogTrigger asChild>
          <Button className="rounded-full px-6 text-white">Começar</Button>
        </DialogTrigger>
        <DialogContent showCloseButton className="sm:max-w-[450px] gap-6">
          <DialogHeader className=" items-center">
            <DialogTitle className="text-[24px] font-semibold">
              Bem vindo ao CogniAI
            </DialogTitle>
          </DialogHeader>
          <div className="flex w-full flex-col gap-4 text-center">
            <Button variant="outline" size="lg">
              <BsGoogle />
              <span>Continuar com Google</span>
            </Button>
            <span>ou</span>
            <Input placeholder="E-mail" className="py-2.5 px-5 h-10" />
            <Button size="lg">Continuar com e-mail</Button>
          </div>
          <DialogFooter className="justify-center">
            <Button variant="link">Criar conta</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
