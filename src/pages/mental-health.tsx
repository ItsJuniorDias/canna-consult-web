import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// IMPORTAÇÕES DO FIREBASE (Ajuste o caminho conforme seu projeto)
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const mentalHealthOptions = [
  { id: "tristeza", label: "Sente muita tristeza" },
  { id: "foco", label: "Perde o foco facilmente" },
  { id: "memoria", label: "Tem problemas de memória" },
  { id: "irritado", label: "Fica facilmente irritado ou triste" },
  { id: "estresse", label: "Possui problema com estresse" },
  { id: "panico", label: "Já teve episódios de pânico?" },
];

export default function MentalHealth() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Estado de loading

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Função para salvar no Firebase e avançar
  const handleNext = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nenhum usuário logado encontrado.");
      return;
    }

    setIsLoading(true);

    try {
      const patientRef = doc(db, "patients", user.uid);

      // Salvamos o array de seleções em 'mentalHealth'
      // usando merge: true para preservar os passos 1 e 2
      await setDoc(
        patientRef,
        {
          mentalHealth: selectedIds,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      navigate("/info-phisical");
    } catch (error) {
      console.error("Erro ao salvar dados de saúde mental:", error);
      alert("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Variáveis de animação para manter o código limpo
  const easeCurve = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-gray-900 font-sans flex items-center justify-center p-6 sm:p-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: easeCurve }}
        className="w-full max-w-5xl flex flex-col bg-white/40 md:p-12 p-6 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm border border-white/60"
      >
        {/* Header Animado */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}
          className="flex items-center justify-between mb-10"
        >
          <button
            onClick={() => navigate(-1)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 -ml-4 rounded-full transition-colors ${
              isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
            }`}
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium text-sm">Voltar</span>
          </button>
          <span className="text-sm font-semibold text-gray-500 tracking-wide bg-gray-200/50 px-4 py-1.5 rounded-full">
            Passo 3 de 5
          </span>
          <div className="w-[88px]" />
        </motion.header>

        {/* Textos Principais */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: easeCurve }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl leading-tight font-bold tracking-tight mb-4 text-gray-900">
            Defina seu objetivo
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Nossa inteligência artificial irá te auxiliar com algumas perguntas
            para personalizar sua experiência médica.
          </p>
        </motion.div>

        {/* Seção de Formulário (Card Branco) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: easeCurve }}
          className="bg-white/70 rounded-[28px] p-6 md:p-8 shadow-sm border border-white/60"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Saúde Mental
            </h2>
            <p className="text-gray-500 text-[15px]">
              Selecione todas as opções que se aplicam a você.
            </p>
          </div>

          {/* Lista de Opções (Chips/Tags) */}
          <div className="flex flex-wrap gap-3 md:gap-4">
            {mentalHealthOptions.map((option) => {
              const isSelected = selectedIds.includes(option.id);

              return (
                <button
                  key={option.id}
                  onClick={() => toggleSelection(option.id)}
                  disabled={isLoading}
                  className={`px-6 py-3.5 rounded-full text-[15px] font-medium transition-all duration-300 ease-out border-2 active:scale-[0.98] ${
                    isSelected
                      ? "bg-white border-[#34C759] text-[#34C759] shadow-sm"
                      : "bg-gray-100/80 border-transparent text-gray-700 hover:bg-white hover:shadow-sm hover:border-gray-200"
                  } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Actions Animadas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: easeCurve }}
          className="mt-12 pt-8 flex items-center justify-between sm:justify-end gap-4 border-t border-gray-200/60"
        >
          <button
            onClick={() => navigate(-1)}
            disabled={isLoading}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-[0.98]"
            }`}
          >
            Voltar
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#34C759] hover:bg-[#2eb350] text-white shadow-lg shadow-[#34C759]/30 active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                Salvando...
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </>
            ) : (
              <>
                Avançar
                <ArrowRight size={20} className="text-white" />
              </>
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
