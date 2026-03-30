import React, { use } from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  FileText,
  Stethoscope,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut,
  Info,
  MessageCircle,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PatientArea() {
  const navigate = useNavigate(); // 2. Instancie o hook de navegação

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.05)] z-10">
        {/* Top Header / Logo Area */}
        <div className="h-32 bg-gradient-to-b from-[#34C759] to-[#5add7a] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Leaf size={24} />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {/* Item Ativo com a nova cor */}
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 bg-[#eefcf1] text-[#34C759] rounded-md font-medium transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <CalendarPlus size={20} />
            Nova Consulta
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <FileText size={20} />
            Minhas Receitas/Laudos
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <Stethoscope size={20} />
            Minhas Consultas
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <FolderOpen size={20} />
            Meus Documentos
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <Settings size={20} />
            Configurações
          </a>
        </nav>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <HelpCircle size={18} />
            Precisa de ajuda? Entre e...
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#34C759] rounded-md transition-colors"
          >
            <MessageCircle size={18} />
            Acesse nossa comunidade
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-500 rounded-md transition-colors mt-4"
          >
            <LogOut size={18} />
            Sair
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 relative">
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Olá, Alexandre de paula dias junior
          </h1>
          <p className="text-gray-500">Seja bem vindo de volta.</p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Receitas Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-lg font-semibold text-gray-800">
                Minhas Receitas
              </h2>
              <a
                href="#"
                className="text-sm text-[#34C759] hover:text-[#2ca549] font-medium transition-colors"
              >
                Ver receitas
              </a>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Info size={24} className="text-gray-300" />
              </div>
              <p className="text-sm">Nenhuma receita encontrada.</p>
            </div>
          </div>

          {/* Consultas Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-lg font-semibold text-gray-800">
                Minhas Consultas
              </h2>
              <a
                href="#"
                className="text-sm text-[#34C759] hover:text-[#2ca549] font-medium transition-colors"
              >
                Ver todos
              </a>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Info size={24} className="text-gray-300" />
              </div>
              <p className="text-sm">Nenhuma consulta encontrada.</p>
            </div>
          </div>
        </div>

        {/* Floating Action Button (Chat) */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] hover:bg-[#2ca549] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#34c759]/30 transition-all hover:scale-105 z-50">
          <MessageCircle size={28} />
        </button>
      </main>
    </div>
  );
}
