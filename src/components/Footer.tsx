import React from "react";
import EmailForm from "./EmailForm";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contato" className="bg-white text-black py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logos Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative h-36 w-48">
              <Image
                src="/images/logo_sh.jpg"
                alt="Logo do Projeto NORTE"
                layout="fill"
                objectFit="contain"
                className="rounded"
                priority={false}
              />
            </div>
            <div className="relative h-64 w-64">
              <Image
                src="/images/itaipu-mais-que-energia.jpg"
                alt="Logo Itaipu Binacional"
                layout="fill"
                objectFit="contain"
                priority={false}
              />
            </div>
          </div>

          {/* Contact/Email Section */}
          <div className="w-full md:w-1/2">
            <EmailForm />
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center sm:text-left">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Projeto NORTE. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}