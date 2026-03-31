import React, { useState } from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  FileText,
  Stethoscope,
  Folder,
  Settings,
  HelpCircle,
  LogOut,
  MessageCircle,
  Leaf,
  ChevronDown,
  IdCard,
  CreditCard,
  Book,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";
import { set } from "zod";

export default function MyDocuments() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const navigate = useNavigate();
  // Estado para controlar a abertura do menu de seleção do documento
  const [isSelectOpen, setIsSelectOpen] = useState(true);

  const [selectedDocumentType, setSelectedDocumentType] = useState("");

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
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/patient-area");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/new-consult");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <CalendarPlus size={18} className="mr-3" />
                <span className="text-sm font-medium">Nova Consulta</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-recipes");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <FileText size={18} className="mr-3" />
                <span className="text-sm font-medium">
                  Minhas Receitas/Laudos
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-consultations");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Stethoscope size={18} className="mr-3" />
                <span className="text-sm font-medium">Minhas Consultas</span>
              </a>
            </li>
            {/* Active Item - Meus Documentos */}
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-documents");
                }}
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
                href="#"
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
                href="#"
                className="flex items-center px-6 py-2 text-gray-500 hover:text-red-500 transition-colors mt-2"
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Meus Documentos
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie e acesse todos os seus documentos médicos
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-lg font-bold text-gray-800 mb-6">
              Enviar Documento
            </h2>

            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento <span className="text-red-500">*</span>
              </label>

              {/* Custom Select Box */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSelectOpen(!isSelectOpen)}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-left text-sm text-gray-500 flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                >
                  {selectedDocumentType || "Selecione o tipo de documento"}
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isSelectOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        setSelectedDocumentType("RG");
                        setIsSelectOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-gray-50/50"
                    >
                      <IdCard size={16} className="mr-3 text-gray-500" />
                      RG - Registro Geral
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocumentType("CNH");
                        setIsSelectOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <CreditCard size={16} className="mr-3 text-gray-500" />
                      CNH - Carteira Nacional de Habilitação
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocumentType("Passaporte");
                        setIsSelectOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                      <Book size={16} className="mr-3 text-gray-500" />
                      Passaporte
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {isHelpModalOpen && (
        <ModalHelper setIsHelpModalOpen={setIsHelpModalOpen} />
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2eaa4d] transition-colors z-50">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
