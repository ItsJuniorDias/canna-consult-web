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
  Search,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";
import { auth } from "../../firebaseConfig";

// MOCKS DE DADOS
const mockReceitas = [
  {
    id: 1,
    title: "Receita - Óleo CBD 10% Full Spectrum",
    doctor: "Dr. Carlos Eduardo",
    date: "31/03/2026",
    status: "Válida",
  },
  {
    id: 2,
    title: "Receita - Gomas THC/CBD 1:1",
    doctor: "Dra. Ana Flávia",
    date: "15/02/2026",
    status: "Expirada",
  },
];

const mockLaudos = [
  {
    id: 1,
    title: "Laudo Médico - Acompanhamento Trimestral",
    doctor: "Dr. Carlos Eduardo",
    date: "31/03/2026",
    status: "Ativo",
  },
  {
    id: 2,
    title: "Laudo Médico Inicial",
    doctor: "Dra. Ana Flávia",
    date: "10/11/2025",
    status: "Arquivado",
  },
];

export default function MyRecipes() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("receitas"); // 'receitas' | 'laudos'
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Define qual lista exibir com base na aba ativa
  const currentData = activeTab === "receitas" ? mockReceitas : mockLaudos;

  // Lógica de filtro para a barra de busca
  const filteredData = currentData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/patient-area");
                }}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/new-consult");
                }}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <CalendarPlus size={18} className="mr-3" />
                <span className="text-sm font-medium">Nova Consulta</span>
              </a>
            </li>
            {/* Active Item */}
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-recipes");
                }}
                href="#"
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
              >
                <FileText size={18} className="mr-3" />
                <span className="text-sm font-medium">
                  Minhas Receitas/Laudos
                </span>
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-consultations");
                }}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Stethoscope size={18} className="mr-3" />
                <span className="text-sm font-medium">Minhas Consultas</span>
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-documents");
                }}
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
                  Precisa de ajuda? Entre em...
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
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Minhas Receitas/Laudos
            </h1>
            <p className="text-gray-500 text-sm">
              Aqui você encontra suas receitas e laudos médicos disponíveis.
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100/70 p-1.5 rounded-lg flex items-center">
            <button
              onClick={() => {
                setActiveTab("receitas");
                setSearchTerm("");
              }}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === "receitas"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Minhas Receitas ({mockReceitas.length})
            </button>
            <button
              onClick={() => {
                setActiveTab("laudos");
                setSearchTerm("");
              }}
              className={`flex-1 py-2.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === "laudos"
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Meus Laudos ({mockLaudos.length})
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            {/* Top Toolbar */}
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                {activeTab === "receitas" ? "Minhas Receitas" : "Meus Laudos"}
              </h2>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Buscar por ${
                    activeTab === "receitas" ? "receita" : "laudo"
                  }`}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-all"
                />
              </div>
            </div>

            {/* List Body or Empty State */}
            {filteredData.length > 0 ? (
              <div className="p-6 grid grid-cols-1 gap-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#34C759] transition-colors group bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-[#f0fdf4] text-[#34C759] rounded-xl flex items-center justify-center group-hover:bg-[#34C759] group-hover:text-white transition-colors shrink-0">
                        {activeTab === "receitas" ? (
                          <FileText size={24} />
                        ) : (
                          <Folder size={24} />
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.doctor} • Emitido em {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          item.status === "Válida" || item.status === "Ativo"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status}
                      </span>
                      <button className="flex items-center justify-center p-2 text-gray-400 hover:text-[#34C759] hover:bg-green-50 rounded-lg transition-colors">
                        <Download size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-[#34C759] rounded-2xl flex items-center justify-center mb-5 opacity-90 shadow-sm">
                  {activeTab === "receitas" ? (
                    <FileText
                      size={40}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  ) : (
                    <Folder
                      size={40}
                      className="text-white"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  {searchTerm !== ""
                    ? `Nenhum(a) ${
                        activeTab === "receitas" ? "receita" : "laudo"
                      } encontrado(a) para "${searchTerm}".`
                    : `Nenhum(a) ${
                        activeTab === "receitas"
                          ? "receita cadastrada"
                          : "laudo cadastrado"
                      }.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {isHelpModalOpen && (
        <ModalHelper setIsHelpModalOpen={setIsHelpModalOpen} />
      )}

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2eaa4d] transition-colors">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
