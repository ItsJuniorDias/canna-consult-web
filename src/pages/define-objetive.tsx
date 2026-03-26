import React, { useState } from "react";
import {
  ArrowLeft,
  Moon,
  Wind,
  Target,
  Smile,
  Activity,
  Thermometer,
  Zap,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const objectives = [
  {
    id: "sono",
    title: "Melhora do Sono",
    description: "Ajuda para dormir melhor",
    icon: <Moon size={24} className="text-gray-600" />,
  },
  {
    id: "calma",
    title: "Mais Calma",
    description: "Controle da agitação diária",
    icon: <Wind size={24} className="text-gray-600" />,
  },
  {
    id: "foco",
    title: "Aumento do Foco",
    description: "Melhorar a concentração",
    icon: <Target size={24} className="text-gray-600" />,
  },
  {
    id: "estresse",
    title: "Menos Estresse",
    description: "Reduzir o estresse diário",
    icon: <Smile size={24} className="text-gray-600" />,
  },
  {
    id: "ansiedade",
    title: "Ansiedade",
    description: "Alívio dos sintomas",
    icon: <Activity size={24} className="text-gray-600" />,
  },
  {
    id: "dor",
    title: "Dor Crônica",
    description: "Reduzir dores persistentes",
    icon: <Thermometer size={24} className="text-gray-600" />,
  },
  {
    id: "tdah",
    title: "TDAH",
    description: "Atenção e foco para TDAH",
    icon: <Zap size={24} className="text-gray-600" />,
  },
  {
    id: "outro",
    title: "Outro",
    description: "Especificar outro motivo",
    icon: <Plus size={24} className="text-gray-600" />,
  },
];

export default function DefineObjective() {
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const hasSelection = selectedIds.length > 0;

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-gray-900 font-sans flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-5xl flex flex-col bg-white/40 md:p-12 p-6 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm border border-white/60">
        {/* Header - Mais espaçado para web */}
        <header className="flex items-center justify-between mb-12">
          <button className="flex items-center gap-2 px-4 py-2 -ml-4 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium text-sm">Voltar</span>
          </button>
          <span className="text-sm font-semibold text-gray-500 tracking-wide bg-gray-200/50 px-4 py-1.5 rounded-full">
            Passo 1 de 5
          </span>
          <div className="w-[88px]" /> {/* Spacer para equilibrar o layout */}
        </header>

        {/* Textos Principais - Maior impacto visual em telas grandes */}
        <div className="mb-12 max-w-2xl">
          <h1 className="text-4xl md:text-5xl leading-tight font-bold tracking-tight mb-4 text-gray-900">
            Defina seu objetivo
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Você pode escolher mais de uma opção. Nossa IA personalizará sua
            experiência para entregar os melhores resultados.
          </p>
        </div>

        {/* Seção de Cards - Grid Responsivo (1, 2, 3 ou 4 colunas) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {objectives.map((obj) => {
            const isSelected = selectedIds.includes(obj.id);

            return (
              <button
                key={obj.id}
                onClick={() => toggleSelection(obj.id)}
                className={`group flex flex-col text-left p-6 rounded-[28px] transition-all duration-300 ease-out border-2 min-h-[180px] ${
                  isSelected
                    ? "bg-white border-[#34C759] shadow-md -translate-y-1"
                    : "bg-white/70 border-transparent hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-gray-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-300 ${
                    isSelected
                      ? "bg-[#34C759] text-white"
                      : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
                  }`}
                >
                  {React.cloneElement(obj.icon, {
                    className: isSelected ? "text-white" : "",
                  })}
                </div>
                <div className="mt-auto">
                  <h3 className="font-semibold text-[17px] leading-snug mb-2 text-gray-900">
                    {obj.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 leading-relaxed">
                    {obj.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Area - Botão alinhado à direita para desktop */}
        <div className="mt-16 pt-8 border-t border-gray-200/60 flex justify-end">
          <button
            onClick={() => navigate("/history-health")}
            disabled={!hasSelection}
            className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              hasSelection
                ? "bg-[#34C759] hover:bg-[#2eb350] text-white shadow-lg shadow-[#34C759]/30 transform active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Avançar
            <ArrowRight
              size={20}
              className={hasSelection ? "text-white" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
