import React, { useState } from "react";
import api from "../../service/axios";

export default function ConsultaCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  // Integração com o backend do Stripe
  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Endpoint da sua API que cria a sessão do Stripe Checkout
      const response = await api.post("/api/checkout_sessions", {
        priceId: "price_1TFYHERB4hnPW0iSEfHXhuni", // Substitua pelo seu Price ID
      });

      const data = response.data;

      console.log("Resposta do backend:", data);

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const detalhesConsulta = [
    { icone: <ClockIcon />, texto: "Duração média de 15 a 25 minutos" },
    { icone: <ReturnIcon />, texto: "Direito a 1 retorno em até 15 dias" },
    {
      icone: <DocumentIcon />,
      texto: "Receita, pedidos de exames e atestado digitais",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF9F3] flex flex-col items-center justify-center p-6 font-sans text-gray-900">
      <div className="w-full max-w-md">
        {/* Título da Página */}
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center text-gray-900">
          Confirmar Agendamento
        </h1>

        {/* Card Principal */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_40px_rgb(52,199,89,0.08)] border border-gray-100 relative overflow-hidden">
          {/* Perfil do Médico */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-[#FDF9F3]">
              {/* Substitua o src pela foto real do médico */}
              <img
                src="https://ui-avatars.com/api/?name=Dr+Silva&background=34C759&color=fff&size=128"
                alt="Foto do Médico"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Dr. Nome do Médico
              </h2>
              <p className="text-sm text-gray-500">
                Psiquiatria • CRM 12345/SP
              </p>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* Preço da Consulta */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">
              Valor da Consulta
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-medium text-gray-400">R$</span>
              <span className="text-5xl font-bold tracking-tight text-gray-900">
                129
              </span>
              <span className="text-2xl font-bold text-gray-900">,90</span>
            </div>
          </div>

          {/* O que está incluso */}
          <div className="bg-[#FDF9F3] rounded-2xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              O que está incluso:
            </h3>
            <ul className="space-y-4">
              {detalhesConsulta.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  {item.icone}
                  <span className="text-sm text-gray-600 leading-tight pt-0.5">
                    {item.texto}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Call to Action */}
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-[#34C759] text-white font-semibold text-lg py-4 rounded-full hover:bg-[#2eaa4e] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-[#34C759]/30 flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <SpinnerIcon /> Redirecionando...
              </span>
            ) : (
              "Pagar e Confirmar"
            )}
          </button>
        </div>

        {/* Footer / Trust Badges */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <div className="flex justify-center items-center gap-2 mb-3">
            <LockIcon />
            <span>Pagamento 100% seguro via Stripe</span>
          </div>
          <p>
            Ao confirmar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-gray-600">
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-gray-600">
              Política de Cancelamento
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Ícones Otimizados (Heroicons adaptados) ---

function ClockIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#34C759] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#34C759] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#34C759] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#34C759] flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
