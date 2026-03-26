import React from "react";
import { motion } from "framer-motion";

const AboutDoctor = () => {
  return (
    <section className="bg-[#FDF9F3] py-24 px-6 md:px-12 lg:px-24 font-sans">
      {/* Container Principal Animado - Fade Up ao entrar na tela */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }} // Dispara a animação um pouco antes de entrar 100% na tela
        className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24"
      >
        {/* Coluna de Texto (Esquerda) - Desliza da esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="lg:w-1/2 flex flex-col order-2 lg:order-1"
        >
          {/* Título - Fade Up com atraso */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-semibold text-gray-900 mb-8 tracking-tight"
          >
            Sobre o <span className="text-[#34C759]">médico responsável</span>
          </motion.h2>

          {/* Parágrafos - Fade Up com atraso sequencial */}
          <div className="space-y-6 text-lg text-gray-600 font-medium leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Murilo Alves Navarro é médico, com quase 10 anos de formação e
              ampla experiência em gestão hospitalar, telemedicina e atendimento
              em larga escala. Ao longo da carreira, atuou na coordenação de
              hospitais, desenvolveu projetos em saúde digital e sempre manteve
              o foco em ampliar o acesso à saúde de forma prática e humana.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Desde junho de 2021, prescreve cannabis medicinal de forma
              contínua, acompanhando mais de 3.000 pacientes ativos, o que lhe
              proporcionou um entendimento profundo das reais necessidades de
              quem busca esse tipo de tratamento.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              É fundador da Canna Consult e da Doctor192, empresas criadas para
              unir medicina, tecnologia e experiência clínica real. Seu trabalho
              é pautado em ética, legalidade, acompanhamento próximo e
              construção de soluções que realmente funcionam na prática.
            </motion.p>
          </div>

          {/* Badge CRM (Opcional) - Fade Up com atraso final */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 self-start"
          >
            <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">
              CRM/SP 123456
            </span>
          </motion.div>
        </motion.div>

        {/* Coluna da Imagem (Direita) - Desliza da direita */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="lg:w-1/2 order-1 lg:order-2 w-full"
        >
          {/* Container com máscara arredondada e sombra suave */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-w-md mx-auto lg:max-w-none">
            {/* Imagem do Médico */}
            <img
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1000&auto=format&fit=crop"
              alt="Retrato do Dr. Murilo Alves Navarro"
              className="w-full h-full object-cover object-center"
            />

            {/* Gradiente de overlay sutil na base da imagem */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutDoctor;
