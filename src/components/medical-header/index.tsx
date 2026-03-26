import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 1. Variáveis de animação para o efeito cascata
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Velocidade entre as animações dos filhos
      delayChildren: 0.2, // Espera um pouquinho antes de começar
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function MedicalCannabisHero() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDF9F3] flex flex-col justify-center items-center font-sans overflow-hidden">
      <div className="w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-12 px-6 md:px-12 lg:px-24 py-16 md:py-24">
        {/* Lado Esquerdo - Transformado em motion.div com variants */}
        <motion.div
          className="flex flex-col justify-center text-center md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-950"
          >
            Seu portal de saúde e bem-estar,
          </motion.h1>

          <motion.div variants={itemVariants} className="mt-4 md:mt-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight inline-block p-2 rounded bg-[#C1DBC9]/50 text-[#425244]">
              focado no potencial da cannabis.
            </h1>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-700 leading-relaxed mt-10 md:mt-12 max-w-2xl mx-auto md:mx-0"
          >
            Consultas especializadas, telemedicina e suporte contínuo. Nossa
            clínica digital é dedicada a explorar o potencial terapêutico da{" "}
            <strong className="font-semibold text-gray-900">
              cannabis medicinal
            </strong>{" "}
            para quem busca alívio da dor crônica, insônia, ansiedade ou deseja
            otimizar seu desempenho físico. Sempre com orientação médica ética e
            dentro dos parâmetros legais.
          </motion.p>

          {/* Botões de Ação com hover e tap */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row flex-wrap gap-4 mt-12 md:mt-16 justify-center md:justify-start"
          >
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#34C759] text-[#FDF9F3] px-10 py-4 rounded-lg font-extrabold text-lg hover:bg-[#2eb350] transition flex items-center justify-center gap-2"
            >
              COMEÇAR MINHA JORNADA
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border-2 border-[#34C759] text-[#34C759] px-10 py-4 rounded-lg font-extrabold text-lg hover:bg-[#34C759]/10 transition flex items-center justify-center gap-2"
              onClick={() => navigate("/login")}
            >
              ÁREA DO PACIENTE
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Lado Direito - Imagem com entrada suave e flutuação contínua */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center md:justify-end px-6 md:px-0"
        >
          <motion.img
            // 2. Animação infinita de respiração/flutuação
            animate={{ y: [-15, 10, -15] }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: "easeInOut",
            }}
            src="https://images.unsplash.com/photo-1637091998767-e6a9d5e80271?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Single, fresh medical cannabis leaf"
            className="w-full h-auto object-contain max-w-lg md:max-w-xl lg:max-w-2xl rounded-xl shadow-lg md:shadow-none"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default MedicalCannabisHero;
