import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Strings from "../util/Strings";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      id="inicio"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1A35] shadow-lg"
          : "bg-gradient-to-b from-[#0A1A35] to-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Barra de navegação superior */}
        <div className="hidden md:flex justify-end items-center py-2 text-xs text-blue-100 space-x-4">
          <Link href="/login" className="hover:text-white transition-colors">
            Acesso Restrito
          </Link>
          <span className="text-blue-300">|</span>
          <button
            className="hover:text-white transition-colors bg-transparent border-none p-0 m-0 cursor-pointer"
            onClick={() => {
              const footer = document.getElementById("contato");
              if (footer) {
                footer.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Contato
          </button>
        </div>

        {/* Navegação principal */}
        <nav className="flex justify-between items-center py-4">
          {/* Logo e nome do projeto */}
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
              {Strings.nucleoReferenciaTitle}
            </span>
          </Link>

          {/* Links de navegação desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label={Strings.sobreProjetoLink} />
            <NavLink href="/metrics" label={Strings.metricasLink} />
            <NavLink href="/noticias" label={Strings.noticiasLink} />
            <NavLink href="/predict" label={Strings.predicaoLink} />
            {/* <NavLink href="/dados" label="Dados em Tempo Real" /> */}

            <div className="relative w-8 h-8 ml-4">
              <Image
                src="/images/satelite-icon.png"
                alt="Ícone de Satélite"
                fill
                className="object-contain hover:rotate-12 transition-transform"
              />
            </div>
          </div>

          {/* Menu mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Menu de navegação"
          >
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white mb-1.5 transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transition-all ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            ></span>
          </button>
        </nav>
      </div>

      {/* Menu mobile expandido */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-80 bg-[#0A1A35] text-white z-50 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out shadow-2xl`}
      >
        <div className="flex justify-between items-center p-6 border-b border-blue-900">
          <span className="text-xl font-bold">Menu</span>
          <button
            className="text-3xl text-blue-200 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>

        <nav className="flex flex-col py-6 px-6 space-y-6">
          <MobileNavLink
            href="/"
            label={Strings.sobreProjetoLink}
            onClick={() => setMenuOpen(false)}
          />
          <MobileNavLink
            href="/metrics"
            label={Strings.metricasLink}
            onClick={() => setMenuOpen(false)}
          />
          <MobileNavLink
            href="/noticias"
            label={Strings.noticiasLink}
            onClick={() => setMenuOpen(false)}
          />
          <MobileNavLink
            href="/dados"
            label=""
            onClick={() => setMenuOpen(false)}
          />

          <div className="pt-6 mt-6 border-t border-blue-900 space-y-4">
            <MobileNavLink
              href="/login"
              label="Acesso Restrito"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              href="/contato"
              label="Contato"
              onClick={() => setMenuOpen(false)}
            />
          </div>
        </nav>
      </div>

      {/* Overlay do menu mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className="relative text-blue-100 hover:text-white transition-colors group">
        {label}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
      </a>
    </Link>
  );
}

function MobileNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        className="block py-3 px-4 text-lg hover:bg-blue-900/50 rounded-lg transition-colors"
        onClick={onClick}
      >
        {label}
      </a>
    </Link>
  );
}
