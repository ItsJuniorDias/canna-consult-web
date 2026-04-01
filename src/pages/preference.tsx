import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Leaf,
  Droplet,
  Package,
  Smile,
  Heart,
  Minus,
  Plus,
  Loader2, // Importando o ícone de loading
} from "lucide-react";
import { motion } from "framer-motion";

// IMPORTAÇÕES DO FIREBASE (Ajuste o caminho conforme seu projeto)
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const productPreferences = [
  { id: "flores", label: "Flores", icon: <Leaf size={28} /> },
  { id: "oleos", label: "Óleos", icon: <Droplet size={28} /> },
  { id: "extracoes", label: "Extrações", icon: <Package size={28} /> },
  { id: "gummies", label: "Gummies", icon: <Smile size={28} /> },
  { id: "pomadas", label: "Pomadas", icon: <Heart size={28} /> },
];

export default function Preference() {
  const navigate = useNavigate();

  // Estados
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [duration, setDuration] = useState(3);
  const [investment, setInvestment] = useState(1000);
  const [isLoading, setIsLoading] = useState(false); // Estado de loading

  // Handlers
  const toggleProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const decreaseDuration = () => setDuration((prev) => Math.max(1, prev - 1));
  const increaseDuration = () => setDuration((prev) => prev + 1);

  const handleSliderChange = (e) => {
    setInvestment(Number(e.target.value));
  };

  // Função para salvar no Firebase e finalizar o fluxo
  const handleFinish = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Nenhum usuário logado encontrado.");
      return;
    }

    setIsLoading(true);

    try {
      const patientRef = doc(db, "patients", user.uid);

      // Salvamos as preferências e adicionamos uma flag de onboarding concluído
      await setDoc(
        patientRef,
        {
          preferences: {
            products: selectedProducts,
            durationInMonths: duration,
            monthlyInvestment: investment,
          },
          onboardingCompleted: true, // Flag útil para saber que o usuário terminou o fluxo
          updatedAt: new Date(),
        },
        { merge: true },
      );

      // Redireciona para a tela inicial do paciente (Ajuste a rota conforme necessário)
      navigate("/checkout");
    } catch (error) {
      console.error("Erro ao salvar preferências:", error);
      alert("Ocorreu um erro ao finalizar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cálculo para pintar o background do slider de verde dinamicamente
  const sliderPercentage = (investment / 5000) * 100;

  const easeCurve = [0.22, 1, 0.36, 1];

  return (
    <div className="min-h-screen bg-[#FDF9F3] text-gray-900 font-sans flex items-center justify-center p-6 sm:p-10 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: easeCurve }}
        className="w-full max-w-5xl flex flex-col bg-white/40 md:p-12 p-6 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm border border-white/60"
      >
        {/* Header */}
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
            Passo 5 de 5
          </span>
          <div className="w-[88px]" />
        </motion.header>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: easeCurve }}
          className="mb-10 max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl leading-tight font-bold tracking-tight mb-4 text-gray-900">
            Preferências
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Selecione os produtos que você tem preferência para uso.
          </p>
        </motion.div>

        {/* Formulário (Grid Principal) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lado Esquerdo: Cards de Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: easeCurve }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {productPreferences.map((product) => {
              const isSelected = selectedProducts.includes(product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  disabled={isLoading}
                  className={`flex flex-col items-center justify-center p-6 rounded-[24px] transition-all duration-300 ease-out border-2 aspect-square ${
                    isSelected
                      ? "bg-white border-[#34C759] shadow-md -translate-y-1"
                      : "bg-white/70 border-transparent hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-gray-200"
                  } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <div
                    className={`mb-4 transition-colors duration-300 ${
                      isSelected ? "text-[#34C759]" : "text-gray-400"
                    }`}
                  >
                    {product.icon}
                  </div>
                  <span
                    className={`font-semibold text-[15px] ${
                      isSelected ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {product.label}
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Lado Direito: Duração e Investimento */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: easeCurve }}
            className="flex flex-col gap-8"
          >
            {/* Bloco 1: Duração */}
            <div className="bg-white/70 rounded-[28px] p-6 shadow-sm border border-white/60">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Expectativa de duração
              </h2>
              <div className="flex items-center gap-6">
                <button
                  onClick={decreaseDuration}
                  disabled={isLoading}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                    isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-95"
                  }`}
                >
                  <Minus size={20} />
                </button>
                <span
                  className={`text-xl font-semibold w-24 text-center ${isLoading ? "text-gray-400" : "text-gray-900"}`}
                >
                  {duration} {duration === 1 ? "mês" : "meses"}
                </span>
                <button
                  onClick={increaseDuration}
                  disabled={isLoading}
                  className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${
                    isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800 active:scale-95"
                  }`}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Bloco 2: Investimento */}
            <div className="bg-white/70 rounded-[28px] p-6 shadow-sm border border-white/60 flex flex-col justify-center flex-1">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-gray-900">
                  Investimento mensal
                </h2>
                <span className="text-sm font-medium text-gray-400">
                  (R$ 0 - R$ 5.000)
                </span>
              </div>

              {/* Slider Customizado */}
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={investment}
                onChange={handleSliderChange}
                disabled={isLoading}
                className={`w-full h-2 rounded-full appearance-none outline-none mb-8 ${isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                style={{
                  background: `linear-gradient(to right, #34C759 ${sliderPercentage}%, #E5E7EB ${sliderPercentage}%)`,
                }}
              />

              <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 28px;
                  height: 28px;
                  background: white;
                  border-radius: 50%;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
                  cursor: pointer;
                  border: 1px solid #e5e7eb;
                }
              `}</style>

              <div
                className={`text-3xl font-bold ${isLoading ? "text-gray-400" : "text-gray-900"}`}
              >
                R$ {investment.toLocaleString("pt-BR")}
                <span className="text-lg font-medium text-gray-400 ml-1">
                  /mês
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: easeCurve }}
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
            onClick={handleFinish}
            disabled={isLoading}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
              isLoading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#34C759] hover:bg-[#2eb350] text-white shadow-lg shadow-[#34C759]/30 active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <>
                Finalizando...
                <Loader2 size={20} className="animate-spin text-white" />
              </>
            ) : (
              "Finalizar"
            )}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
