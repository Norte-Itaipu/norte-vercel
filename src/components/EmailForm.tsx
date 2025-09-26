import { useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_17pim6j";
const TEMPLATE_ID = "template_56p3bp9";
const PUBLIC_KEY = "vPZHC_U5OSUUSSys2";

export default function EmailForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          time: time,
          message: formData.message,
          reply_to: formData.email,
        },
        PUBLIC_KEY
      )
      .then(
        () => {
          setStatus("Email enviado com sucesso!");
          setSuccess(true);
        },
        () => setStatus("Erro ao enviar o email. Tente novamente mais tarde.")
      );
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="flex justify-center items-center text-black">
        <span><strong>Formulário de contato</strong></span>
      </div>

      {!success ? (
        <form onSubmit={sendEmail} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Seu nome"
            required
            className="border p-2"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            className="border p-2"
            value={formData.email}
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Sua mensagem"
            required
            className="border p-2"
            value={formData.message}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Enviar
          </button>
          {status && !success && <p>{status}</p>}
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
          <svg
            className="w-16 h-16 text-green-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p className="mt-4 text-lg font-semibold text-green-600">{status}</p>
          <button
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => {
              setSuccess(false);
              setFormData({ name: "", email: "", message: "" });
              setStatus(null);
            }}
          >
            Enviar outra mensagem
          </button>
        </div>
      )}
    </div>
  );
}
