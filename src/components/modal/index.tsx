import React from "react";
import { MessageSquare, Send, X } from "lucide-react";

export default function ModalHelper({ setIsHelpModalOpen }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
            <MessageSquare size={20} className="text-[#34C759]" />
            Precisa de ajuda?
          </div>
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 space-y-4">
          <div className="bg-[#f0fdf4] text-gray-700 text-sm p-4 rounded-xl border border-[#34C759]/20 leading-relaxed">
            Digite sua mensagem abaixo e clique em{" "}
            <span className="font-semibold">"Entrar em contato"</span> para
            conversar diretamente com nosso suporte via WhatsApp.
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sua mensagem
            </label>
            <textarea
              rows={4}
              placeholder="Descreva como podemos ajudá-lo..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#34C759] focus:ring-1 focus:ring-[#34C759] transition-all resize-none shadow-sm"
            ></textarea>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 pt-2 flex justify-center gap-3">
          <button
            onClick={() => setIsHelpModalOpen(false)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <X size={16} /> Cancelar
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#34C759] text-white rounded-lg text-sm font-medium hover:bg-[#2eaa4d] transition-colors shadow-sm">
            <Send size={16} /> Entrar em contato
          </button>
        </div>
      </div>
    </div>
  );
}
