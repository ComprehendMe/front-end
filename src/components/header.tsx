import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky px-[32px] py-[13px] top-0 rounded-2xl shadow-xl bg-white">
      <nav className="flex justify-between items-center border">
        <div className="flex items-center gap-[10px]">
          <img src="/logo.svg" alt="logo" />
          <h1 className="text-[16px] font-semibold text-primary">CogniAI</h1>
        </div>
        <div className="flex items-center gap-3">
          <button type="button">test</button>
          <button type="button">test</button>
          <button type="button">test</button>
        </div>
        <div className="flex items-center gap-[10px]">
          <Button className="rounded-full px-[24px]">Começar</Button>
        </div>
      </nav>
    </header>
  )
}