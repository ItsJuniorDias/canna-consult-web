import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { auth, db } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function PDFDownload() {
  const [laudo, setLaudo] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // 1. Recupera o laudo
    const laudoSalvo = localStorage.getItem("laudoGerado");
    if (laudoSalvo) {
      setLaudo(laudoSalvo);
    } else {
      setLaudo("Nenhum laudo clínico encontrado. Retorne à consulta.");
    }

    // 2. Busca dados do usuário
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("Erro ao buscar dados do Firestore:", error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Função assíncrona para salvar no Firebase e depois chamar a impressão
  const handlePrint = async () => {
    const currentUser = auth.currentUser;

    // Tenta salvar no Firebase antes de abrir a tela de impressão
    if (currentUser && userData && laudo) {
      try {
        // Converte o laudo (UTF-8) para Base64 de forma segura
        const laudoBase64 = btoa(
          new Uint8Array(new TextEncoder().encode(laudo)).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const laudosRef = collection(db, "laudos");

        // Estrutura do documento que será salvo no Firebase
        await addDoc(laudosRef, {
          userId: currentUser.uid,
          paciente: userData.nomeCompleto || "Não informado",
          cpf: userData.cpf || "Não informado",
          conteudoLaudo: laudoBase64, // <-- Salvando em Base64
          dataCriacao: new Date().toISOString().split("T")[0],
          timestamp: new Date().toISOString(),
          status: "Pendente",
          medico: "João Marcos Santos da Silva",
          crm: "CRM-MT 14316",
          telefone: userData.telefone || "Não informado",
        });

        console.log("Laudo salvo em Base64 na coleção 'laudos' com sucesso!");
      } catch (error) {
        console.error("Erro ao salvar laudo no Firebase:", error);
        alert(
          "Aviso: Houve um erro ao salvar o laudo no sistema, mas você ainda pode imprimir.",
        );
      }
    }

    // Abre a janela de impressão nativa do navegador
    window.print();

    // Redireciona para a área do paciente após a impressão
    navigate("/patient-area");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <p className="text-gray-500 animate-pulse text-lg">
          Carregando dados do paciente...
        </p>
      </div>
    );
  }

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return (
    <div className="min-h-screen bg-[#FDF9F3] print:bg-white flex flex-col items-center py-10 print:py-0 px-4 print:px-0 font-sans text-gray-900">
      {/* Controles da Tela (Escondido na impressão) */}
      <div className="max-w-4xl w-full flex flex-col items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-center text-gray-900">
          Seu Laudo está Pronto
        </h1>
        <p className="text-lg text-gray-600 mb-6 text-center">
          Revise as informações abaixo. Para salvar como PDF, clique no botão e
          escolha o destino "Salvar como PDF".
        </p>

        <button
          onClick={handlePrint}
          disabled={
            !laudo ||
            laudo === "Nenhum laudo clínico encontrado. Retorne à consulta."
          }
          className="px-8 py-3 bg-[#34C759] text-white font-medium rounded-full hover:bg-[#2eaa4c] disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
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
              d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0v3.396c0 .896.61 1.648 1.48 1.815a40.244 40.244 0 0 1 7.54 0c.87-.167 1.48-.92 1.48-1.815V7.036ZM8.25 3h7.5m-7.5 0a2.25 2.25 0 0 0-2.25 2.25v1.5m7.5-0a2.25 2.25 0 0 1 2.25 2.25v1.5m-7.5-0h7.5"
            />
          </svg>
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* A Folha de Documento */}
      <div className="w-full max-w-[210mm] bg-white shadow-2xl border border-gray-300 print:shadow-none print:border-none print:max-w-none print:w-full overflow-hidden">
        <div className="bg-white text-gray-900 mx-auto px-10 py-12 print:px-0 print:py-0">
          {/* Cabeçalho */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6 text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wide">
              Laudo Médico para Uso de Cannabis Medicinal
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Doutor: João Marcos Santos da Silva - CRM-MT 14316
            </p>
          </div>

          {/* Dados do Paciente */}
          <div className="border border-gray-300 rounded-md p-4 mb-8 bg-gray-50/50 print:bg-transparent print:border-gray-800">
            <h2 className="text-[16px] font-bold uppercase mb-3 border-b border-gray-200 print:border-gray-800 pb-1">
              Dados do Paciente
            </h2>
            <div className="grid grid-cols-2 gap-y-2 text-[14px]">
              <div className="col-span-2 sm:col-span-1">
                <span className="font-semibold">Nome Completo:</span>{" "}
                {userData?.nomeCompleto || "Não informado"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-semibold">CPF:</span>{" "}
                {userData?.cpf || "Não informado"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-semibold">E-mail:</span>{" "}
                {userData?.email || "Não informado"}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="font-semibold">Data de Nascimento:</span>{" "}
                {userData?.dataNascimento ||
                  userData?.birthDate ||
                  "Não informado"}
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Endereço:</span>{" "}
                {userData?.endereco || userData?.address || "Não informado"}
              </div>
            </div>
          </div>

          {/* Conteúdo Gerado pela IA */}
          <div className="prose prose-sm max-w-none text-gray-800 marker:text-gray-800 prose-headings:font-bold prose-headings:text-gray-900 prose-headings:border-b prose-headings:border-gray-200 prose-headings:pb-1 prose-h1:text-xl prose-h2:text-lg mb-12 print:text-black">
            <ReactMarkdown>{laudo}</ReactMarkdown>
          </div>

          {/* Assinatura */}
          <div className="mt-16 pt-6 border-t border-gray-800 flex flex-col items-center justify-center text-center print:break-inside-avoid">
            <div className="w-64 border-b-2 border-gray-800 mb-2"></div>
            <p className="font-bold text-[15px]">João Marcos Santos da Silva</p>
            <p className="text-[13px] text-gray-600 print:text-gray-800">
              CRM-MT 14316 - Especialidade Psiquiatria
            </p>
            <p className="text-[13px] text-gray-600 print:text-gray-800 mt-2">
              Data de Emissão: {dataHoje}
            </p>
            <div className="mt-4 flex flex-col items-center">
              <p className="text-[10px] text-gray-500 mb-1">
                Assinado Digitalmente
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
