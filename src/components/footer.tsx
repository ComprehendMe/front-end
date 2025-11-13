import {
  BsDiscord,
  BsTwitterX,
  BsYoutube,
  BsInstagram,
  BsLinkedin,
} from "react-icons/bs";

export default function Footer() {
  return (
    <footer className="flex justify-between px-20 py-16">
      <div className="flex flex-col gap-6">
        <div className="flex gap-2 items-center">
          <img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-[16px] text-blue-800">
            CogniAI
          </span>
        </div>
        <span className="text-gray-400 font-normal text-[16px]">
          © 2025 CogniAI. Todos os direitos reservados
        </span>
        <div className="flex gap-3 items-center">
          <a href="https://github.com" target="_blank" rel="noopener">
            <BsDiscord className="w-4 h-4 text-[#757575] object-contain" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener">
            <BsTwitterX className="w-4 h-4 text-[#757575] object-contain" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener">
            <BsYoutube className="w-4 h-4 text-[#757575] object-contain" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener">
            <BsInstagram className="w-4 h-4 text-[#757575] object-contain" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener">
            <BsLinkedin className="w-4 h-4 text-[#757575] object-contain" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[54px]">
        <div className="flex flex-col gap-3">
          <span className="text-gray-400 font-normal text-[16px]">
            Beneficios
          </span>
          <span className="text-gray-400 font-normal text-[16px]">Preços</span>
          <span className="text-gray-400 font-normal text-[16px]">
            Nossa missão
          </span>
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
