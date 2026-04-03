import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  CalendarPlus,
  FileText,
  Stethoscope,
  Folder,
  Settings,
  HelpCircle,
  LogOut,
  Info,
  MessageCircle,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore"; // <-- Adicionados doc e getDoc

export default function PatientArea() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const navigate = useNavigate();

  // Estados para os dados dinâmicos
  const [userName, setUserName] = useState("Paciente"); // Valor inicial padrão
  const [laudos, setLaudos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado de autenticação do usuário
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Busca os dados do usuário na coleção 'users'
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            // Define o nome usando o campo nomeCompleto do Firestore
            setUserName(userData.nomeCompleto || "Paciente");
          } else {
            console.warn(
              "Documento do usuário não encontrado na coleção 'users'.",
            );
          }

          // 2. Busca os laudos específicos deste usuário logado no Firestore
          const q = query(
            collection(db, "laudos"),
            where("userId", "==", user.uid),
          );

          const querySnapshot = await getDocs(q);
          const laudosData = [];

          querySnapshot.forEach((doc) => {
            laudosData.push({ id: doc.id, ...doc.data() });
          });

          console.log("Laudos encontrados para o usuário:", laudosData);

          setLaudos(laudosData);
        } catch (error) {
          console.error("Erro ao buscar dados no Firestore:", error);
        }
      } else {
        // Se não houver usuário logado, redireciona para o login
        navigate("/login");
      }
      setLoading(false);
    });

    // Limpeza do listener
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9f8]">
        Carregando...
      </div>
    );
  }

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
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/patient-area");
                }}
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
                <span className="text-sm font-medium">Meus Laudos</span>
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
                  navigate("/login");
                }}
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
          {/* Greeting Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Olá, {userName}
            </h1>
            <p className="text-gray-500 text-sm">Seja bem vindo de volta.</p>
          </div>

          {/* Alert Banner */}
          <div className="bg-[#f9fbf8] border-l-4 border-[#34C759] border-y border-r border-y-[#eef3ea] border-r-[#eef3ea] rounded-xl p-6 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-[#e8efe3] rounded-full text-[#34C759] shrink-0">
              <Folder size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[#34C759] mb-1">
                Estamos quase lá!
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Para garantir a segurança do seu tratamento e agilizar a emissão
                das suas receitas, precisamos do envio do seu documento de
                identificação. É rápido e fácil!
              </p>
              <button
                onClick={() => navigate("/my-documents")}
                className="text-sm font-semibold text-[#34C759] hover:text-[#2eaa4d] flex items-center gap-1 transition-colors"
              >
                Enviar meus documentos agora <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Grid Cards - Alterado para 1 coluna */}
          <div className="grid grid-cols-1 gap-6">
            {/* Receitas/Laudos Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Meus Laudos</h2>
                <button
                  onClick={() => navigate("/my-recipes")}
                  className="text-sm text-[#34C759] hover:text-[#2eaa4d] font-semibold transition-colors"
                >
                  Ver todos
                </button>
              </div>

              {laudos?.length > 0 ? (
                <div className="flex-1 flex flex-col gap-3">
                  {laudos.map((item) => (
                    <div
                      key={item?.userId}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-[#34C759] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[#f0fdf4] text-[#34C759] rounded-lg group-hover:bg-[#34C759] group-hover:text-white transition-colors">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-800">
                            {item?.paciente || "Laudo Médico"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {item?.medico || "Médico"} •{" "}
                            {item?.dataCriacao || "Sem data"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.status === "Ativa"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.status || "Ativo"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <Info size={28} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">
                    Nenhum laudo encontrado.
                  </p>
                </div>
              )}
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
