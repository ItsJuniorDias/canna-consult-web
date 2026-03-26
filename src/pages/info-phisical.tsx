import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { motion } from "framer-motion";

export default function InfoPhysical() {
  const navigate = useNavigate();

  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    altura: "",
    peso: "",
    sexo: null, // 'masculino', 'feminino', ou 'outros'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Permite apenas números e vírgula/ponto para os inputs físicos
    const sanitizedValue = value.replace(/[^0-9.,]/g, "");
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleGenderSelect = (gender) => {
    setFormData((prev) => ({ ...prev, sexo: gender }));
  };

  const easeCurve = [0.22, 1, 0.36, 1];

  // Verifica se todos os campos estão preenchidos para liberar o avanço
  const isFormComplete =
    formData.altura !== "" && formData.peso !== "" && formData.sexo !== null;

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
            className="flex items-center gap-2 px-4 py-2 -ml-4 hover:bg-gray-200/50 rounded-full transition-colors text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium text-sm">Voltar</span>
          </button>
          <span className="text-sm font-semibold text-gray-500 tracking-wide bg-gray-200/50 px-4 py-1.5 rounded-full">
            Passo 4 de 5
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coluna Esquerda: Informações Físicas */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: easeCurve }}
            className="bg-white/70 rounded-[28px] p-6 md:p-8 shadow-sm border border-white/60"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informações Físicas
            </h2>

            <div className="flex gap-4">
              {/* Input Altura */}
              <div className="flex-1">
                <label className="block text-[15px] font-medium text-gray-800 mb-2">
                  Altura
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="altura"
                    value={formData.altura}
                    onChange={handleInputChange}
                    placeholder="1,80"
                    className="w-full bg-gray-100/80 text-gray-900 text-lg rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:bg-white transition-all placeholder-gray-400"
                  />
                  <span className="absolute right-5 text-gray-500 font-medium">
                    m
                  </span>
                </div>
              </div>

              {/* Input Peso */}
              <div className="flex-1">
                <label className="block text-[15px] font-medium text-gray-800 mb-2">
                  Peso
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="peso"
                    value={formData.peso}
                    onChange={handleInputChange}
                    placeholder="70"
                    className="w-full bg-gray-100/80 text-gray-900 text-lg rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:bg-white transition-all placeholder-gray-400"
                  />
                  <span className="absolute right-5 text-gray-500 font-medium">
                    kg
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna Direita: Sexo */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: easeCurve }}
            className="bg-white/70 rounded-[28px] p-6 md:p-8 shadow-sm border border-white/60"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sexo</h2>

            <div className="flex flex-col divide-y divide-gray-200/60">
              {[
                { id: "masculino", label: "Masculino" },
                { id: "feminino", label: "Feminino" },
                { id: "outros", label: "Outros" },
              ].map((option) => {
                const isSelected = formData.sexo === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleGenderSelect(option.id)}
                    className="flex items-center gap-4 py-4 w-full text-left group transition-colors"
                  >
                    <div
                      className={`p-2 rounded-full transition-colors ${isSelected ? "bg-[#34C759]/10 text-[#34C759]" : "bg-transparent text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"}`}
                    >
                      <User size={20} />
                    </div>
                    <span
                      className={`text-[17px] font-medium transition-colors ${isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}
                    >
                      {option.label}
                    </span>

                    {/* Indicador visual de seleção (opcional, estilo checkmark invisible) */}
                    {isSelected && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-[#34C759]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Actions Animadas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: easeCurve }}
          className="mt-12 pt-8 flex items-center justify-between sm:justify-end gap-4 border-t border-gray-200/60"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all duration-300 active:scale-[0.98]"
          >
            Voltar
          </button>

          <button
            onClick={() => navigate("/preference")}
            disabled={!isFormComplete}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              isFormComplete
                ? "bg-[#34C759] hover:bg-[#2eb350] text-white shadow-lg shadow-[#34C759]/30 active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Avançar
            <ArrowRight
              size={20}
              className={isFormComplete ? "text-white" : "text-gray-400"}
            />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
