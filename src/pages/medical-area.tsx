import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig"; // Ajuste o caminho
import { signOut } from "firebase/auth";
import html2pdf from "html2pdf.js"; // Importando a biblioteca de PDF
import { marked } from "marked"; // Para converter markdown em HTML limpo. npm install marked

export default function MedicalArea() {
  const navigate = useNavigate();
  const [laudos, setLaudos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ==========================================
  // BUSCA DE DADOS (FIREBASE REAL)
  // ==========================================
  useEffect(() => {
    const fetchLaudos = async () => {
      try {
        const laudosRef = collection(db, "laudos");
        // Buscando os laudos ordenados do mais recente para o mais antigo
        const q = query(laudosRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        const laudosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLaudos(laudosData);
      } catch (error) {
        console.error("Erro ao buscar laudos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaudos();
  }, []);

  // ==========================================
  // HANDLERS E GERAÇÃO DE PDF
  // ==========================================

  // Função para decodificar Base64 de volta para String UTF-8 (mantendo acentos)
  const decodeBase64 = (base64) => {
    try {
      const binString = atob(base64);
      const bytes = new Uint8Array(binString.length);
      for (let i = 0; i < binString.length; i++) {
        bytes[i] = binString.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (e) {
      console.error("Erro ao decodificar Base64", e);
      return "Erro ao carregar o conteúdo do laudo.";
    }
  };

  const handleDownloadPDF = async (laudo) => {
    if (!laudo.conteudoLaudo) {
      alert("Conteúdo do laudo não encontrado no banco de dados.");
      return;
    }

    try {
      // 1. Decodifica o Base64 para a string Markdown original
      const markdownString = decodeBase64(laudo.conteudoLaudo);

      // 2. Converte o Markdown para HTML usando a biblioteca 'marked'
      const htmlContent = marked.parse(markdownString);

      // 3. Monta o HTML completo que vai para o PDF (adicionando cabeçalho e estilização básica)
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; color: #333; line-height: 1.6;">
          <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="text-transform: uppercase; font-size: 22px; margin: 0;">Laudo Médico - Cannabis Medicinal</h1>
            <p style="color: #666; margin-top: 5px;">Dr. ${laudo.medico || "João Marcos Santos da Silva"} - ${laudo.crm || "CRM-MT 14316"}</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border: 1px solid #ddd; border-radius: 5px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Dados do Paciente</h3>
            <p><strong>Nome:</strong> ${laudo.paciente}</p>
            <p><strong>CPF:</strong> ${laudo.cpf}</p>
            <p><strong>Data de Emissão:</strong> ${laudo.dataCriacao.split("-").reverse().join("/")}</p>
          </div>

          <div style="font-size: 14px;">
            ${htmlContent}
          </div>

          <div style="margin-top: 60px; text-align: center; border-top: 1px solid #333; padding-top: 20px;">
            <p><strong>${laudo.medico || "João Marcos Santos da Silva"}</strong></p>
            <p style="font-size: 12px; color: #666;">${laudo.crm || "CRM-MT 14316"}</p>
            <p style="font-size: 10px; color: #999; margin-top: 10px;">Assinado Digitalmente</p>
          </div>
        </div>
      `;

      // 4. Configurações do html2pdf
      const opt = {
        margin: 0,
        filename: `Laudo_${laudo.paciente.replace(/\s+/g, "_")}_${laudo.dataCriacao}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      // 5. Gera e faz o download do PDF
      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redireciona para o login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // ==========================================
  // COMPONENTE VISUAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDF9F3] font-sans">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            Canna Consult <span className="text-[#34C759]">| Médico</span>
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors flex items-center space-x-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span>Sair</span>
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Laudos Gerados</h2>
            <p className="text-gray-500 text-sm mt-1">
              Gerencie e baixe os laudos das avaliações dos pacientes.
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Buscar paciente ou CPF..."
              className="px-4 py-2 w-full md:w-72 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent text-sm bg-white"
            />
          </div>
        </div>

        {/* CARD DA TABELA */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#34C759] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Buscando laudos no sistema...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4 font-medium">Paciente</th>
                    <th className="px-6 py-4 font-medium">CPF</th>
                    <th className="px-6 py-4 font-medium">Data</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                  {laudos.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        Nenhum laudo encontrado no momento.
                      </td>
                    </tr>
                  ) : (
                    laudos.map((laudo) => (
                      <tr
                        key={laudo.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {laudo.paciente}
                        </td>
                        <td className="px-6 py-4 text-gray-500">{laudo.cpf}</td>
                        <td className="px-6 py-4">
                          {laudo.dataCriacao
                            ? laudo.dataCriacao.split("-").reverse().join("/")
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              laudo.status === "Finalizado"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {laudo.status || "Finalizado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDownloadPDF(laudo)}
                            disabled={!laudo.conteudoLaudo} // Desabilita se não tiver o laudo no banco
                            className={`inline-flex items-center justify-center space-x-1 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                              laudo.conteudoLaudo
                                ? "bg-[#34C759] hover:bg-[#28A745] text-white shadow-sm"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                              />
                            </svg>
                            <span>Gerar e Baixar PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
