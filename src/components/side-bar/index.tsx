import {
  CalendarPlus,
  FileText,
  Folder,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  LogOut,
  MessageCircle,
  Settings,
  Stethoscope,
} from "lucide-react";
import { auth } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function SideBar({ setIsHelpModalOpen }) {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.05)] z-10 sticky top-0 h-screen">
      {/* Top Header / Logo Area */}
      <div className="h-32 bg-gradient-to-b from-[#34C759] to-[#5add7a] flex items-center justify-center shrink-0">
        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
          <Leaf size={24} />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {/* Active Item - Dashboard */}
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/patient-area");
              }}
              className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span className="text-sm font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/new-consult");
              }}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
            >
              <CalendarPlus size={18} className="mr-3" />
              <span className="text-sm font-medium">Nova Consulta</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/my-recipes");
              }}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
            >
              <Folder size={18} className="mr-3" />
              <span className="text-sm font-medium">Meus Laudos</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/my-consultations");
              }}
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
            >
              <Stethoscope size={18} className="mr-3" />
              <span className="text-sm font-medium">Minhas Consultas</span>
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/my-documents");
              }}
              href="#"
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
            >
              <Folder size={18} className="mr-3" />
              <span className="text-sm font-medium">Meus Documentos</span>
            </a>
          </li>
          <li className="pt-4">
            <a
              onClick={(e) => {
                e.preventDefault();
                navigate("/config");
              }}
              href="#"
              className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
            >
              <Settings size={18} className="mr-3" />
              <span className="text-sm font-medium">Configurações</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 border-t border-gray-100 shrink-0">
        <ul className="space-y-1">
          <li>
            <a
              onClick={() => setIsHelpModalOpen(true)}
              href="#"
              className="flex items-center px-6 py-2 text-gray-500 hover:text-[#34C759] transition-colors"
            >
              <HelpCircle size={16} className="mr-3" />
              <span className="text-xs font-medium">
                Precisa de ajuda? Entre em...
              </span>
            </a>
          </li>
          <li>
            <a
              href="https://chat.whatsapp.com/EcVWTOXS4yE8EwWPqqCprY?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-2 text-gray-500 hover:text-[#34C759] transition-colors"
            >
              <MessageCircle size={16} className="mr-3" />
              <span className="text-xs font-medium">
                Acesse nossa comunidade
              </span>
            </a>
          </li>
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                auth.signOut();

                navigate("/login");
              }}
              href="#"
              className="flex items-center px-6 py-2 text-gray-500 hover:text-red-500 transition-colors mt-2"
            >
              <LogOut size={16} className="mr-3" />
              <span className="text-xs font-medium">Sair</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
