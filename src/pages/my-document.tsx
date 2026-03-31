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
  UploadCloud,
  File,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";

// MOCKS DE DADOS - Documentos
const mockDocumentos = [
  {
    id: 1,
    name: "cnh_frente_verso.pdf",
    type: "CNH",
    date: "10/04/2026",
    size: "2.4 MB",
    status: "Aprovado",
  },
  {
    id: 2,
    name: "rg_novo_digitalizado.jpg",
    type: "RG",
    date: "25/03/2026",
    size: "1.8 MB",
    status: "Em Análise",
  },
  {
    id: 3,
    name: "passaporte_foto.png",
    type: "Passaporte",
    date: "10/01/2026",
    size: "3.2 MB",
    status: "Rejeitado",
  },
];

export default function MyDocuments() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const navigate = useNavigate();

  // Estado para controlar a abertura do menu de seleção do documento (iniciando fechado)
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");

  // Função auxiliar para renderizar a cor da tag de status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-700";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-700";
      case "Rejeitado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  // Função auxiliar para renderizar o ícone do status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle size={14} className="mr-1" />;
      case "Em Análise":
        return <Clock size={14} className="mr-1" />;
      case "Rejeitado":
        return <AlertCircle size={14} className="mr-1" />;
      default:
        return null;
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
              Gerencie e acesse todos os seus documentos médicos e de
              identificação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Card (Esquerda - 1 Coluna) */}
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Enviar Documento
              </h2>

              <div className="space-y-5">
                <div>
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
                      {selectedDocumentType || "Selecione o tipo"}
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
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
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
                          <CreditCard
                            size={16}
                            className="mr-3 text-gray-500"
                          />
                          CNH - Habilitação
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

                {/* Upload Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-[#f0fdf4] hover:border-[#34C759] transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#34C759] group-hover:text-white transition-colors">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Clique para fazer upload
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF, JPG ou PNG (Max. 5MB)
                    </p>
                  </div>
                </div>

                <button className="w-full bg-[#34C759] text-white font-medium py-2.5 rounded-lg hover:bg-[#2eaa4d] transition-colors shadow-sm">
                  Enviar Documento
                </button>
              </div>
            </div>

            {/* List Card (Direita - 2 Colunas) */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Documentos Enviados
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {mockDocumentos.length} arquivos
                </span>
              </div>

              <div className="space-y-4">
                {mockDocumentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#34C759] hover:shadow-sm transition-all group bg-white"
                  >
                    {/* Info principal do arquivo */}
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-[#f0fdf4] text-[#34C759] rounded-lg flex items-center justify-center shrink-0">
                        <File size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 truncate max-w-[200px] sm:max-w-[250px]">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-semibold text-gray-700">
                            {doc.type}
                          </span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status e Ações */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span
                        className={`flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-full ${getStatusStyle(
                          doc.status,
                        )}`}
                      >
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          title="Baixar Documento"
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          title="Excluir Documento"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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
