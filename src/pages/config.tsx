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
  MessageCircle,
  Leaf,
  Calendar,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";

// IMPORTAÇÕES DO FIREBASE (Ajuste o caminho de acordo com a sua estrutura)
import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Config() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const navigate = useNavigate();

  // Estados
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    cpf: "",
    phone: "",
    birthDate: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    city: "",
    country: "Brasil", // Valor padrão conforme o print
  });

  // Busca os dados do usuário ao carregar a tela
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setFormData({
              fullName: data.nomeCompleto || "",
              email: user.email || data.email || "",
              cpf: data.cpf || "",
              phone: data.telefone || "",
              birthDate: data.dataNascimento || "",
              cep: data.cep || "",
              address: data.endereco || "",
              number: data.numero || "",
              complement: data.complemento || "",
              city: data.cidade || "",
              country: data.pais || "Brasil",
            });
          } else {
            // Se o documento ainda não existir, preenche com o básico do Auth
            setFormData((prev) => ({
              ...prev,
              fullName: user.displayName || "",
              email: user.email || "",
            }));
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Atualiza o estado conforme o usuário digita
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Salva os dados no Firestore
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSaving(true);
    setShowSuccess(false);

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      // Usamos setDoc com merge: true para atualizar ou criar o documento caso não exista
      await setDoc(userDocRef, formData, { merge: true });

      // Mostra mensagem de sucesso temporária
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Ocorreu um erro ao salvar suas alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
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
                onClick={() => navigate("/patient-area")}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <LayoutDashboard size={18} className="mr-3" />
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/new-consult")}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <CalendarPlus size={18} className="mr-3" />
                <span className="text-sm font-medium">Nova Consulta</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/my-recipes")}
                href="#"
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
                onClick={() => navigate("/my-consultations")}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Stethoscope size={18} className="mr-3" />
                <span className="text-sm font-medium">Minhas Consultas</span>
              </a>
            </li>
            <li>
              <a
                onClick={() => navigate("/my-documents")}
                href="#"
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
              >
                <Folder size={18} className="mr-3" />
                <span className="text-sm font-medium">Meus Documentos</span>
              </a>
            </li>
            <li className="pt-4">
              <a
                onClick={() => navigate("/settings")}
                href="#"
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  auth.signOut();
                }}
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Configurações
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie seus dados pessoais
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
              <Loader2 className="animate-spin text-[#34C759] mb-4" size={40} />
              <p className="text-gray-500 font-medium">
                Carregando seus dados...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
              {/* Profile Data Card */}
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  Dados do Perfil
                </h2>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Nome Completo <span className="text-gray-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-500 bg-gray-50 cursor-not-allowed focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Telefone <span className="text-gray-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Data de Nascimento{" "}
                      <span className="text-gray-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        placeholder="DD/MM/AAAA"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 pr-10 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                        required
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
                      name="cep"
                      value={formData.cep}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  {/* Número e Complemento Lado a Lado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Número
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  {/* Feedback de Sucesso e Botão Salvar */}
                  <div className="pt-4 flex items-center justify-end gap-4">
                    {showSuccess && (
                      <span className="text-sm font-medium text-[#34C759] flex items-center gap-1">
                        <CheckCircle2 size={16} />
                        Alterações salvas!
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-[#34C759] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2eaa4d] transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                    >
                      {isSaving && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      {isSaving ? "Salvando..." : "Salvar alterações"}
                    </button>
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
                      placeholder="******"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#34C759] focus:border-[#34C759] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Confirmar senha
                    </label>
                    <input
                      type="password"
                      placeholder="******"
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
          )}
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
