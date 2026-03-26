import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Variáveis de animação para manter o padrão suave da Apple
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FDF9F3] py-24 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Título da Seção animado no scroll */}
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-4xl md:text-5xl font-semibold text-gray-900 mb-16 tracking-tight"
        >
          Funciona na prática
        </motion.h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Coluna Esquerda */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Card 01 - Avaliação Inicial */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }} // Efeito sutil de levantar ao passar o mouse
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group transition-shadow hover:shadow-md"
            >
              <div className="relative z-10">
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                  1
                </span>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                  Avaliação inicial
                </h3>
                <p className="text-gray-500 text-lg leading-relaxed font-medium">
                  O paciente preenche o formulário e é direcionado ao WhatsApp
                  para orientações iniciais.
                </p>
              </div>

              {/* Ícone sutil no fundo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute -right-10 -bottom-10 w-64 h-64 text-[#FDF9F3] transform group-hover:scale-105 transition-transform duration-700 ease-out"
              >
                <path
                  fillRule="evenodd"
                  d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>

            {/* Card 03 - Avaliação Médica */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="bg-gray-900 text-white p-10 md:p-12 rounded-[2.5rem] shadow-lg flex-grow flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                  3
                </span>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  Avaliação médica especializada
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 font-medium">
                  Com as informações estruturadas, o médico analisa o caso e
                  define a melhor conduta terapêutica. O paciente pode optar
                  por:
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-md cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.8)]"></div>
                  <span className="text-base font-medium">
                    Atendimento rápido e sem vídeo
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 bg-white/10 px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-md cursor-pointer"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.8)]"></div>
                  <span className="text-base font-medium">
                    Consulta completa por vídeo
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Card 05 - Compra Assistida */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex-grow"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                5
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                Compra assistida e entrega legal
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                Auxiliamos na aquisição do produto e garantimos que o tratamento
                chegue diretamente à casa do paciente, de forma legalizada.
              </p>
            </motion.div>
          </div>

          {/* Coluna Direita */}
          <div className="flex flex-col gap-6 md:gap-8">
            {/* Card 02 - Triagem Inteligente */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex-grow"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                2
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-8 tracking-tight">
                Triagem inteligente com IA própria
              </h3>

              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  "Sintomas",
                  "Histórico de saúde",
                  "Uso prévio de cannabis ou outros medicamentos",
                  "Rotina e expectativas",
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#FDF9F3] border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-[#34C759]"
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
                    {tag}
                  </motion.span>
                ))}
              </div>

              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                Tudo de forma clara, segura e organizada.
              </p>
            </motion.div>

            {/* Card 04 - Prescrição */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 flex-grow"
            >
              <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                4
              </span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                Prescrição e orientação
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-6 font-medium">
                Após a avaliação, o paciente recebe:
              </p>

              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  "Receita médica digital válida",
                  "Laudo médico",
                  "Orientações de uso",
                  "Ajustes de doses",
                  "Planejamento de acompanhamento",
                ].map((tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-[#FDF9F3] border border-gray-200 text-gray-700 px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-[#34C759]"
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
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Card 06 - Acompanhamento Contínuo */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="bg-gray-900 text-white p-10 md:p-12 rounded-[2.5rem] shadow-lg flex-grow flex flex-col justify-between"
            >
              <div>
                <span className="inline-flex items-center justify-center w-12 h-12 bg-[#34C759] text-white font-bold rounded-full mb-8 text-lg shadow-sm">
                  6
                </span>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">
                  Acompanhamento contínuo
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 font-medium">
                  O cuidado não termina na receita. A Canna Consult acompanha a
                  evolução do paciente, facilita renovações e orienta ajustes,
                  sempre respeitando a individualidade de cada tratamento.
                </p>
              </div>

              {/* Botão de Ação com Hover */}
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto self-start mt-4 bg-[#34C759] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-[#2eb350] transition-colors shadow-[0_0_15px_rgba(52,199,89,0.3)] flex items-center justify-center gap-2"
              >
                INICIAR AVALIAÇÃO AGORA
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
