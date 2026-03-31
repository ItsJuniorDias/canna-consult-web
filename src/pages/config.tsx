import React from "react";
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
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";

export default function Config() {
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);

  const navigate = useNavigate();

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
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-documents");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Folder size={18} className="mr-3" />
                <span className="text-sm font-medium">Meus Documentos</span>
              </a>
            </li>
            {/* Active Item - Configurações */}
            <li className="pt-4">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Configurações
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie seus dados pessoais
            </p>
          </div>

          {/* Settings Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
            {/* Profile Data Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Dados do Perfil
              </h2>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nome Completo <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Alexandre de paula dias junior"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="its_alejunior1997@icloud.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    defaultValue="449.556.578-85"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Telefone <span className="text-gray-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="(17) 99111-5745"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Data de Nascimento <span className="text-gray-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="20/08/1997"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 pr-10 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    defaultValue="15025-090"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    type="text"
                    placeholder="Seu endereço..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Alterar Senha
              </h2>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    defaultValue="******"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    defaultValue="******"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="bg-[#34C759] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2eaa4d] transition-colors shadow-sm"
                  >
                    Atualizar senha
                  </button>
                </div>
              </form>
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
