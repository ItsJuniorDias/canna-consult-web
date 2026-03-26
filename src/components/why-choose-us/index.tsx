import React from "react";
import { motion } from "framer-motion";

const reasons = [
  "Uma das plataformas mais seguras do país",
  "Mais de 3.000 pacientes acompanhados",
  "Médicos experientes em cannabis medicinal",
  "Tecnologia própria com IA treinada em casos reais",
  "Atendimento rápido, humano e sem burocracia",
  "Processo claro do início ao acompanhamento",
];

// Variáveis de animação para a lista em cascata
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Tempo entre a animação de cada item
      delayChildren: 0.4, // Espera o card principal começar para iniciar a lista
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const WhyChooseUs = () => {
  return (
    // Fundo off-white mantendo a consistência do site
    <section className="bg-[#FDF9F3] py-24 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Container Principal Animado */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }} // Dispara a animação um pouco antes de entrar 100% na tela
          className="bg-gray-950 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl"
        >
          {/* Efeito de brilho sutil no fundo (Ambient Light) */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#34C759] rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#34C759] rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Coluna da Esquerda: Título e Logo */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#34C759] text-sm font-bold text-white shadow-sm">
                  CC
                </div>
                <span className="text-xl font-medium tracking-tight text-white">
                  Canna Consult
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
                Por que <br className="hidden lg:block" /> escolher a <br />
                <span className="text-[#34C759]">Canna Consult?</span>
              </h2>
            </motion.div>

            {/* Coluna da Direita: Lista de Benefícios (Animada com Stagger) */}
            <motion.div
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-7 flex flex-col gap-4"
            >
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 transition-colors duration-300 hover:border-white/20"
                >
                  {/* Ícone de Check na cor Primária */}
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-[#34C759]/20 text-[#34C759]">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-lg md:text-xl text-gray-200 font-medium tracking-tight">
                    {reason}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Call to Action (Caixa Inferior com Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-16 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10"
          >
            <p className="text-xl md:text-2xl font-medium text-white max-w-2xl leading-relaxed tracking-tight">
              Aqui, tecnologia e medicina caminham juntas para facilitar o
              cuidado.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap w-full md:w-auto bg-[#34C759] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-[#2eb350] transition-colors shadow-[0_0_20px_rgba(52,199,89,0.3)] hover:shadow-[0_0_25px_rgba(52,199,89,0.5)] flex items-center justify-center gap-2 flex-shrink-0"
            >
              INICIAR AVALIAÇÃO
              <motion.svg
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 0.6,
                }}
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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
