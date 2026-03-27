import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

// IMPORTAÇÕES DO FIREBASE (Ajuste o caminho conforme seu projeto)
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const questions = [
  { id: "tratamento", label: "Atualmente faz algum tratamento?" },
  { id: "cronica", label: "Possui alguma doença crônica?" },
  { id: "psiquiatrico", label: "Faz uso de remédios psiquiátricos?" },
  { id: "arritmia", label: "Possui arritmia cardíaca?" },
  { id: "psicose", label: "Histórico de psicose, esquizofrenia?" },
  { id: "dorCabeca", label: "Tem dores de cabeça intensas?" },
  { id: "cannabis", label: "Já usou cannabis (maconha)?" },
  { id: "digestivo", label: "Tem problemas digestivos?" },
];

export default function HistoryHealth() {
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({
    tratamento: false,
    cronica: false,
    psiquiatrico: false,
    arritmia: false,
    psicose: false,
    dorCabeca: false,
    cannabis: false,
    digestivo: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleAnswer = (id) => {
    setAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
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

      // Salvamos as respostas dentro de um objeto 'healthHistory'
      // usando merge: true para não apagar os 'objectives' do passo 1
      await setDoc(
        patientRef,
        {
          healthHistory: answers,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      navigate("/mental-health");
    } catch (error) {
      console.error("Erro ao salvar o histórico de saúde:", error);
      alert("Ocorreu um erro ao salvar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-gray-900 font-sans flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-5xl flex flex-col bg-white/40 md:p-12 p-6 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm border border-white/60">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 -ml-4 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium text-sm">Voltar</span>
          </button>
          <span className="text-sm font-semibold text-gray-500 tracking-wide bg-gray-200/50 px-4 py-1.5 rounded-full">
            Passo 2 de 5
          </span>
          <div className="w-[88px]" /> {/* Spacer */}
        </header>

        {/* Título Principal */}
        <div className="mb-8 max-w-2xl">
          <h1 className="text-4xl md:text-5xl leading-tight font-bold tracking-tight mb-4 text-gray-900">
            Histórico de Saúde
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Responda as perguntas abaixo para personalizarmos sua experiência
            com precisão.
          </p>
        </div>

        {/* Seção de Formulário (Card Branco) */}
        <div className="bg-white/70 rounded-[28px] p-6 md:p-8 shadow-sm border border-white/60">
          {/* Lista de Perguntas */}
          <div className="flex flex-col divide-y divide-gray-200/60">
            {questions.map((q) => {
              const isOn = answers[q.id];

              return (
                <div
                  key={q.id}
                  className="py-4 flex items-center justify-between gap-4 group"
                >
                  <span className="text-[17px] text-gray-800 font-medium group-hover:text-gray-900 transition-colors">
                    {q.label}
                  </span>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Texto Sim/Não */}
                    <span
                      className={`text-[15px] font-medium transition-colors w-8 text-right ${
                        isOn ? "text-[#34C759]" : "text-gray-400"
                      }`}
                    >
                      {isOn ? "Sim" : "Não"}
                    </span>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:ring-offset-2 ${
                        isOn ? "bg-[#34C759]" : "bg-gray-200"
                      }`}
                      aria-pressed={isOn}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                          isOn ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions - Botões Voltar e Avançar */}
        <div className="mt-12 pt-8 flex items-center justify-between sm:justify-end gap-4 border-t border-gray-200/60">
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
        </div>
      </div>
    </div>
  );
}
