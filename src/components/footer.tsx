export default function Footer() {
  return (
    <footer className="flex justify-between px-20 py-16">
      <div className="flex flex-col border gap-6">
        <div className="flex gap-2 items-center">
          <img src="/public/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-[16px] text-blue-800">
            CogniAI
          </span>
        </div>
        <span className="text-gray-400 font-normal text-[16px]">
          © 2025 CogniAI. Todos os direitos reservados
        </span>
      </div>
      <div className="grid grid-cols-2 border gap-[54px]">
        <div className="flex flex-col gap-3">
          <span className="text-gray-400 font-normal text-[16px]">
              Beneficios
          </span>
          <span className="text-gray-400 font-normal text-[16px]">Preços</span>
          <span className="text-gray-400 font-normal text-[16px]">Nossa missão</span>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-gray-400 font-normal text-[16px]">
            Politica de privacidade
          </span>
          <span className="text-gray-400 font-normal text-[16px]">
            Termos de uso
          </span>
          <span className="text-gray-400 font-normal text-[16px]">
            Politica de cookies
          </span>
        </div>
      </div>
    </footer>
  );
}
