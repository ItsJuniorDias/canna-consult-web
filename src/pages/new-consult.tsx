import React, { useState } from "react";
import {
  Leaf,
  LayoutDashboard,
  CalendarPlus,
  FileText,
  Stethoscope,
  Folder,
  Settings,
  HelpCircle,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";
import { auth } from "../../firebaseConfig";
import api from "../../service/axios";

export default function NewConsult() {
  const [isLoading, setIsLoading] = useState(false);

  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const navigate = useNavigate(); // 2. Instancie o hook de navegação

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      navigate("/checkout"); // Redireciona para a página de checkout
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.05)] z-10 sticky top-0 h-screen">
        {/* Top Header / Logo Area */}
        <div className="h-32 bg-gradient-to-b from-[#34C759] to-[#5add7a] flex items-center justify-center shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Leaf size={24} />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <a
                onClick={() => navigate("/patient-area")} // 3. Use o hook para navegar
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>
            {/* Active Item */}
            <li>
              <a
                onClick={() => navigate("/new-consult")} // 3. Use o hook para navegar
                href="#"
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
              >
                <CalendarPlus size={18} className="mr-3" />
                <span className="text-sm font-medium">Nova Consulta</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/my-recipes")} // 3. Use o hook para navegar
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <FileText size={18} className="mr-3" />
                <span className="text-sm font-medium">Meus Laudos</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/my-consultations")} // 3. Use o hook para navegar
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Stethoscope size={18} className="mr-3" />
                <span className="text-sm font-medium">Minhas Consultas</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/my-documents")} // 3
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Folder size={18} className="mr-3" />
                <span className="text-sm font-medium">Meus Documentos</span>
              </a>
            </li>
            <li className="pt-4">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/config");
                }}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Settings size={18} className="mr-3" />
                <span className="text-sm font-medium">Configurações</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div className="py-4 border-t border-gray-100 shrink-0">
          <ul className="space-y-1">
            <li>
              <a
                onClick={() => setIsHelpModalOpen(true)}
                href="#"
                className="flex items-center px-6 py-2 text-gray-500 hover:text-[#34C759] transition-colors"
              >
                <HelpCircle size={16} className="mr-3" />
                <span className="text-xs font-medium">
                  Precisa de ajuda? Entre em contato
                </span>
              </a>
            </li>
            <li>
              <a
                href="https://chat.whatsapp.com/EcVWTOXS4yE8EwWPqqCprY?mode=gi_t"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-6 py-2 text-gray-500 hover:text-[#34C759] transition-colors"
              >
                <MessageCircle size={16} className="mr-3" />
                <span className="text-xs font-medium">
                  Acesse nossa comunidade
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  auth.signOut();

                  navigate("/login");
                }}
                href="#"
                className="flex items-center px-6 py-2 text-gray-500 hover:text-[#34C759] transition-colors mt-2"
              >
                <LogOut size={16} className="mr-3" />
                <span className="text-xs font-medium">Sair</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Nova Consulta
            </h1>
            <p className="text-gray-500 text-sm">
              Escolha o melhor atendimento para você
            </p>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px] flex flex-col items-center">
            <div className="text-center mb-10">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Escolha sua consulta
              </h2>
              <p className="text-gray-500 text-sm">
                Selecione o plano ideal para suas necessidades
              </p>
            </div>

            {/* Pricing Card */}
            <div className="relative w-full max-w-sm border border-gray-200 rounded-2xl p-8 pt-10 text-center shadow-sm hover:shadow-md transition-shadow bg-white">
              {/* Badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#555555] text-white px-4 py-1 rounded-full text-xs font-semibold tracking-wide">
                Ideal para começar
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Acesso Essencial
              </h3>
              <p className="text-xs text-gray-500 mb-6 px-4">
                Ideal para começar sua jornada com cannabis medicinal de forma
                segura e legal
              </p>

              <div className="mb-6">
                <span className="block text-sm text-gray-400 line-through mb-1">
                  R$ 249,90
                </span>
                <span className="block text-3xl font-extrabold text-[#34C759] mb-1">
                  R$ 129,99
                </span>
                <span className="block text-xs font-bold text-[#34C759]">
                  Economia de R$ 119,91
                </span>
              </div>

              <div className="text-left mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-4 text-center">
                  Inclui:
                </p>
                <ul className="space-y-3 text-xs text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Consulta médica especializada em 24h</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Receita digital com validade legal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Acesso a produtos certificados por parceiros</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">-</span>
                    <span>Suporte prioritário via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full font-medium py-3 rounded-lg transition-colors shadow-sm flex justify-center items-center ${
                  isLoading
                    ? "bg-[#80e59a] cursor-not-allowed text-white"
                    : "bg-[#34C759] text-white hover:bg-[#2eaa4d]"
                }`}
              >
                {isLoading ? (
                  <>
                    {/* Ícone de Loading SVG (opcional, mas recomendado) */}
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Gerando pagamento...
                  </>
                ) : (
                  "Iniciar Agora"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {isHelpModalOpen && (
        <ModalHelper setIsHelpModalOpen={setIsHelpModalOpen} />
      )}

      {/* Floating Action Button (Optional, mimicking the bottom right icon) */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2eaa4d] transition-colors">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
