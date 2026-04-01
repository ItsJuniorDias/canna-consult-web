import React, { useState, useEffect } from "react";
import {
  Leaf,
  LayoutDashboard,
  CalendarPlus,
  Stethoscope,
  Folder,
  Settings,
  HelpCircle,
  MessageCircle,
  LogOut,
  Search,
  Download,
  Loader2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Importado useLocation
import ModalHelper from "../components/modal";
import { auth, db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function MyLaudos() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [laudosList, setLaudosList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation(); // Pegando a rota atual

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        // const user = auth.currentUser;

        // Buscando Laudos na coleção "laudos"
        const laudosRef = collection(db, "laudos");
        const laudosSnapshot = await getDocs(laudosRef);
        const laudosData = laudosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLaudosList(laudosData);
      } catch (error) {
        console.error("Erro ao buscar dados do Firestore:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Lógica de filtro atualizada para buscar por médico ou paciente
  const filteredData = laudosList.filter(
    (item) =>
      item.medico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paciente?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Função para definir o estilo do link dependendo se ele é a rota ativa ou não
  const getLinkStyle = (path) => {
    return location.pathname === path
      ? "flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
      : "flex items-center px-6 py-3 text-gray-600 border-l-4 border-transparent hover:bg-gray-50 hover:text-[#34C759] transition-colors";
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.05)] z-10 sticky top-0 h-screen">
        <div className="h-32 bg-gradient-to-b from-[#34C759] to-[#5add7a] flex items-center justify-center shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Leaf size={24} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/patient-area");
                }}
                href="#"
                className={getLinkStyle("/patient-area")}
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
                className={getLinkStyle("/new-consult")}
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
                className={getLinkStyle("/my-recipes")}
              >
                <Folder size={18} className="mr-3" />
                <span className="text-sm font-medium">Meus Laudos</span>
              </a>
            </li>
            <li>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-consultations");
                }}
                href="#"
                className={getLinkStyle("/my-consultations")}
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
                className={getLinkStyle("/my-documents")}
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
                className={getLinkStyle("/config")}
              >
                <Settings size={18} className="mr-3" />
                <span className="text-sm font-medium">Configurações</span>
              </a>
            </li>
          </ul>
        </nav>

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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Meus Laudos
            </h1>
            <p className="text-gray-500 text-sm">
              Aqui você encontra seus laudos médicos disponíveis.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[450px] flex flex-col">
            <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-bold text-gray-800">
                Lista de Laudos ({laudosList.length})
              </h2>

              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por médico ou paciente"
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-all"
                />
              </div>
            </div>

            {/* Renderização Condicional: Loading / Lista / Vazio */}
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Loader2
                  size={40}
                  className="text-[#34C759] animate-spin mb-4"
                />
                <p className="text-gray-500 font-medium text-sm">
                  Buscando laudos...
                </p>
              </div>
            ) : filteredData.length > 0 ? (
              <div className="p-6 grid grid-cols-1 gap-4">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#34C759] transition-colors group bg-white shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <div className="w-12 h-12 bg-[#f0fdf4] text-[#34C759] rounded-xl flex items-center justify-center group-hover:bg-[#34C759] group-hover:text-white transition-colors shrink-0">
                        <Folder size={24} />
                      </div>
                      <div>
                        {/* Utilizando os dados reais: paciente e medico */}
                        <h3 className="text-base font-bold text-gray-800">
                          Laudo - Paciente: {item.paciente}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Dr(a). {item.medico} ({item.crm}) • Emitido em{" "}
                          {item.dataCriacao}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          item.status === "Finalizado"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status || "Disponível"}
                      </span>
                      {/* O botão agora é um link apontando para urlAssinado */}
                      {item.urlAssinado ? (
                        <a
                          href={item.urlAssinado}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center p-2 text-gray-400 hover:text-[#34C759] hover:bg-green-50 rounded-lg transition-colors"
                          title="Baixar Laudo"
                        >
                          <Download size={20} />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="flex items-center justify-center p-2 text-gray-200 cursor-not-allowed rounded-lg"
                          title="Arquivo não disponível"
                        >
                          <Download size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 bg-[#34C759] rounded-2xl flex items-center justify-center mb-5 opacity-90 shadow-sm">
                  <Folder size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <p className="text-gray-500 font-medium text-sm">
                  {searchTerm !== ""
                    ? `Nenhum laudo encontrado para "${searchTerm}".`
                    : `Nenhum laudo cadastrado.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {isHelpModalOpen && (
        <ModalHelper setIsHelpModalOpen={setIsHelpModalOpen} />
      )}

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2eaa4d] transition-colors">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
