import { motion } from "framer-motion";

const headerLinks = ["Recursos", "Tratamentos", "Médicos", "Sobre", "Contato"];

const Header = () => {
  return (
    // Fundo translúcido claro (estilo barra de navegação do macOS/iOS)
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 z-50 w-full border-b border-gray-200/50 bg-[#FDF9F3] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo Canna Consult */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          {/* Ícone com o verde iOS */}
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#34C759] text-xs font-bold text-white shadow-sm">
            CC
          </div>
          <span className="text-xl font-medium tracking-tight text-gray-900">
            Canna <span className="font-semibold text-[#34C759]">Consult</span>
          </span>
        </motion.div>

        {/* Navegação - Escondida em mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          {headerLinks.map((link, index) => (
            <motion.a
              key={link}
              href="#"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
              whileHover={{ y: -1 }} // Movimento muito sutil, típico da Apple
            >
              {link}
            </motion.a>
          ))}
        </nav>

        {/* Ação Principal - Botão verde iOS */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <a
            href="#"
            className="rounded-md bg-[#34C759] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#2eb350] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:ring-offset-2"
          >
            Iniciar Avaliação
          </a>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
