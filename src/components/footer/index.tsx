import React from "react";
import { motion } from "framer-motion";

// Variáveis de animação para o efeito em cascata
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Tempo entre a aparição de cada elemento
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const Footer = () => {
  return (
    // Fundo alterado para bg-gray-950 para dar contraste e um visual mais premium
    <footer className="bg-gray-950 border-t border-gray-800 py-16 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }} // Ativa quando o footer entrar na tela
        className="max-w-4xl mx-auto flex flex-col items-center text-center"
      >
        {/* Logo Canna Consult (Versão Footer) */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-[#34C759] text-base font-bold text-white shadow-[0_0_15px_rgba(52,199,89,0.3)] transition-shadow hover:shadow-[0_0_25px_rgba(52,199,89,0.5)]"
          >
            CC
          </motion.div>
        </motion.div>

        {/* Redes Sociais e Contato */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-6 mb-8"
        >
          <motion.a
            whileHover={{ y: -3 }}
            href="#"
            className="text-gray-400 hover:text-[#34C759] transition-colors"
            aria-label="Instagram"
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </motion.a>
          <motion.a
            whileHover={{ y: -3 }}
            href="#"
            className="text-gray-400 hover:text-[#34C759] transition-colors"
            aria-label="E-mail"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </motion.a>
        </motion.div>

        {/* Informações da Empresa (Cores ajustadas para fundo escuro) */}
        <motion.div variants={itemVariants} className="space-y-3 mb-8">
          <p className="text-sm text-gray-400 font-medium tracking-tight">
            CANNA CONSULT LTDA — CNPJ: 46.024.658/0001-34
          </p>
          <p className="text-sm text-gray-400 font-medium tracking-tight">
            © 2026 Canna Consult. Todos os direitos reservados.
          </p>
        </motion.div>

        {/* Disclaimer / Aviso Legal */}
        <motion.p
          variants={itemVariants}
          className="text-xs md:text-sm text-gray-500 italic max-w-3xl leading-relaxed mb-10"
        >
          A prescrição de cannabis medicinal segue todas as normas legais
          vigentes no Brasil. Cada tratamento depende de avaliação médica
          individual e rigorosa.
        </motion.p>

        {/* Links de Rodapé */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-400 font-medium"
        >
          <a
            href="#"
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Política de Privacidade
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Termos de Uso
          </a>
          <a
            href="#"
            className="hover:text-white transition-colors underline-offset-4 hover:underline"
          >
            Diretrizes da Comunidade
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
