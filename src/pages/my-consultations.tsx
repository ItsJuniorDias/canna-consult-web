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
  Calendar,
  Clock,
  Video,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";

// MOCKS DE DADOS - Consultas
const mockConsultas = [
  {
    id: 1,
    doctor: "Dra. Ana Flávia",
    specialty: "Clínica Médica",
    date: "10/04/2026",
    time: "14:30",
    status: "Agendada",
    type: "Online",
  },
  {
    id: 2,
    doctor: "Dr. Carlos Eduardo",
    specialty: "Neurologia",
    date: "25/03/2026",
    time: "09:00",
    status: "Realizada",
    type: "Online",
  },
  {
    id: 3,
    doctor: "Dra. Juliana Silva",
    specialty: "Psiquiatria",
    date: "10/01/2026",
    time: "11:00",
    status: "Cancelada",
    type: "Presencial",
  },
];

export default function MyConsultations() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Lógica de filtro para a barra de busca
  const filteredConsultas = mockConsultas.filter(
    (consulta) =>
      consulta.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consulta.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
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
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-recipes");
                }}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <FileText size={18} className="mr-3" />
                <span className="text-sm font-medium">
                  Minhas Receitas/Laudos
                </span>
              </a>
            </li>
            {/* Active Item */}
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-consultations");
                }}
                href="#"
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
              Minhas Consultas
            </h1>
            <p className="text-gray-500 text-sm">
              Acompanhe seu histórico e próximas consultas agendadas.
            </p>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            {/* Top Toolbar */}
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Histórico de Agendamentos
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
                  placeholder="Buscar médico ou especialidade"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-all"
                />
              </div>
            </div>

            {/* List Body or Empty State */}
            {filteredConsultas.length > 0 ? (
              <div className="p-6 grid grid-cols-1 gap-4">
                {filteredConsultas.map((consulta) => (
                  <div
                    key={consulta.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-[#34C759] transition-colors group bg-white shadow-sm hover:shadow-md"
                  >
                    {/* Info Médico e Tipo */}
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="w-12 h-12 bg-[#f0fdf4] text-[#34C759] rounded-xl flex items-center justify-center group-hover:bg-[#34C759] group-hover:text-white transition-colors shrink-0">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-800">
                          {consulta.doctor}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {consulta.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Data, Hora e Local */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-0 text-sm text-gray-600">
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{consulta.date}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                        <Clock size={16} className="text-gray-400" />
                        <span>{consulta.time}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5">
                        {consulta.type === "Online" ? (
                          <Video size={16} className="text-blue-500" />
                        ) : (
                          <MapPin size={16} className="text-orange-500" />
                        )}
                        <span className="font-medium text-gray-700">
                          {consulta.type}
                        </span>
                      </div>
                    </div>

                    {/* Status e Ação */}
                    <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                          consulta.status === "Agendada"
                            ? "bg-blue-100 text-blue-700"
                            : consulta.status === "Realizada"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {consulta.status}
                      </span>

                      {consulta.status === "Agendada" ? (
                        <button className="text-sm bg-[#34C759] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#2eaa4d] transition-colors shadow-sm">
                          Acessar Sala
                        </button>
                      ) : (
                        <button className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 hover:text-gray-800 transition-colors">
                          Ver Detalhes
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-[#34C759] rounded-2xl flex items-center justify-center mb-5 opacity-90 shadow-sm">
                  <Stethoscope
                    size={40}
                    className="text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  {searchTerm !== ""
                    ? `Nenhuma consulta encontrada para "${searchTerm}".`
                    : "Você ainda não possui consultas cadastradas."}
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
