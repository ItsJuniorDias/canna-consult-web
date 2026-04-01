import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import html2pdf from "html2pdf.js";
import { marked } from "marked";

export default function MedicalArea() {
  const navigate = useNavigate();
  const [laudos, setLaudos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // NOVO ESTADO: Controla qual laudo já teve o upload concluído e está pronto para abrir o WhatsApp
  const [laudoProntoParaWhats, setLaudoProntoParaWhats] = useState({
    id: null,
    url: "",
  });

  // ==========================================
  // BUSCA DE DADOS
  // ==========================================
  useEffect(() => {
    const fetchLaudos = async () => {
      try {
        const laudosRef = collection(db, "laudos");
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
  // HANDLERS (PDF E WHATSAPP)
  // ==========================================
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
      const markdownString = decodeBase64(laudo.conteudoLaudo);
      const htmlContent = marked.parse(markdownString);

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

      const opt = {
        margin: 0,
        filename: `Laudo_${laudo.paciente.replace(/\s+/g, "_")}_${laudo.dataCriacao}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      alert("Ocorreu um erro ao tentar gerar o PDF.");
    }
  };

  const handleUploadAndSendToWhatsApp = async (event, laudo) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!laudo.telefone) {
      alert("Número de telefone do paciente não encontrado no banco de dados.");
      return;
    }

    setIsUploading(true);

    try {
      // 1. Cria a referência no Firebase Storage
      const fileName = `laudos_assinados/${laudo.id}_${Date.now()}_${file.name}`;
      const storageReference = ref(storage, fileName);

      // 2. Faz o upload do arquivo
      await uploadBytes(storageReference, file);

      // 3. Pega a URL pública
      const downloadURL = await getDownloadURL(storageReference);

      // --- NOVO: ATUALIZAÇÃO NO FIRESTORE ---
      const laudoRef = doc(db, "laudos", laudo.id);
      await updateDoc(laudoRef, {
        status: "Finalizado",
        urlAssinado: downloadURL, // Opcional: salva o link do assinado no banco
        dataAssinatura: new Date().toISOString(),
      });

      // Atualiza o estado local para refletir a mudança na tabela sem precisar dar F5
      setLaudos((prevLaudos) =>
        prevLaudos.map((item) =>
          item.id === laudo.id ? { ...item, status: "Finalizado" } : item,
        ),
      );
      // ---------------------------------------

      // 4. Formata o telefone
      let telefoneFormatado = laudo.telefone.replace(/\D/g, "");
      if (!telefoneFormatado.startsWith("55")) {
        telefoneFormatado = "55" + telefoneFormatado;
      }

      // 5. Monta a mensagem e o link do WhatsApp
      const mensagem = `Olá, ${laudo.paciente}! Aqui está o seu Laudo Médico assinado. Você pode acessá-lo através deste link: ${downloadURL}`;
      const whatsappUrl = `https://wa.me/${telefoneFormatado}?text=${encodeURIComponent(mensagem)}`;

      // 6. Atualiza o estado para liberar o botão
      setLaudoProntoParaWhats({ id: laudo.id, url: whatsappUrl });
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      alert("Ocorreu um erro ao atualizar o status ou enviar o arquivo.");
    } finally {
      setIsUploading(false);
      event.target.value = null;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // ==========================================
  // COMPONENTE VISUAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDF9F3] font-sans">
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
        </div>

        {isUploading && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-700 rounded-full animate-spin mr-3"></div>
            Fazendo upload do arquivo e preparando o link do WhatsApp...
          </div>
        )}

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
                    <th className="px-6 py-4 font-medium text-center">Ações</th>
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
                              laudo.status === "Aprovado"
                                ? "bg-blue-100 text-blue-700"
                                : laudo.status === "Finalizado"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {laudo.status || "Pendente"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {/* BOTÃO GERAR PDF ORIGINAL */}
                            <button
                              onClick={() => handleDownloadPDF(laudo)}
                              disabled={!laudo.conteudoLaudo || isUploading}
                              className={`inline-flex items-center justify-center p-2 rounded-lg text-sm font-bold transition-all ${laudo.conteudoLaudo && !isUploading ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                              title="Baixar PDF Original"
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
                                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                              </svg>
                            </button>

                            {/* CONDICIONAL: BOTÃO DE UPLOAD OU BOTÃO DE ABRIR WHATSAPP */}
                            {laudoProntoParaWhats.id === laudo.id ? (
                              <a
                                href={laudoProntoParaWhats.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  setLaudoProntoParaWhats({ id: null, url: "" })
                                } // Limpa o estado após clicar
                                className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all bg-[#25D366] hover:bg-[#1DA851] text-white shadow-sm animate-pulse"
                                title="Clique para abrir o WhatsApp com o link do laudo"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 mr-2"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                                <span>Abrir WhatsApp</span>
                              </a>
                            ) : (
                              <label
                                className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all ${isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-[#25D366] hover:bg-[#1DA851]"} text-white shadow-sm`}
                                title="Fazer upload do PDF assinado e preparar envio"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className="w-4 h-4 mr-2"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                                <span>Enviar Assinado</span>
                                <input
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  disabled={isUploading}
                                  onChange={(e) =>
                                    handleUploadAndSendToWhatsApp(e, laudo)
                                  }
                                />
                              </label>
                            )}
                          </div>
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
