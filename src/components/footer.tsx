import { Link } from "@tanstack/react-router";
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
            ComprehendMe
          </span>
        </div>
        <p className="text-[#1C1F22] font-normal text-[16px]">
          © 2025 CogniAI. Todos os direitos reservados
        </p>
        <div className="flex gap-3 items-center">
          <a href="https://github.com" target="_blank" rel="noopener">
            <BsDiscord className="w-4 h-4 text-[#1C1F22] object-contain" />
          </a>
          <a href="https://x.com" target="_blank" rel="noopener">
            <BsTwitterX className="w-4 h-4 text-[#1C1F22] object-contain" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener">
            <BsYoutube className="w-4 h-4 text-[#1C1F22] object-contain" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener">
            <BsInstagram className="w-4 h-4 text-[#1C1F22] object-contain" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener">
            <BsLinkedin className="w-4 h-4 text-[#1C1F22] object-contain" />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-[54px]">
        <ul className="flex flex-col gap-3">
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Benefits</Link>
          </li>
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Pricing</Link>
          </li>
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Our mission</Link>
          </li>
        </ul>
        <ul className="flex flex-col gap-3">
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Privacy Policy</Link>
          </li>
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Terms of use</Link>
          </li>
          <li className="text-[#1C1F22] font-normal text-[16px]">
            <Link to="/">Cookies policy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
