import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

// IMPORTAÇÕES DO FIREBASE (Ajuste o caminho conforme seu projeto)
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default function ChatScreen() {
  const navigate = useNavigate();

  // Estados do Chat
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "model",
      text: "Olá! Sou o Doutor João Marcos Santos da Silva. Bem-vindo à nossa de consulta. Para iniciarmos a nossa triagem, o que te traz ao consultório hoje e há quanto tempo você tem esses sintomas?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Estados para gerenciar as preferências e carregamento inicial
  const [isInitializing, setIsInitializing] = useState(true);
  const [dynamicSystemInstruction, setDynamicSystemInstruction] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Efeito para buscar as preferências do usuário ao montar o componente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Busca as preferências no Firestore
          const prefRef = doc(db, "preferences", user.uid);
          const prefSnap = await getDoc(prefRef);

          let preferencesText =
            "O paciente não definiu preferências específicas. Avalie a melhor via de administração.";

          if (prefSnap.exists()) {
            const data = prefSnap.data();
            const produtosSelecionados =
              data.products && data.products.length > 0
                ? data.products.join(", ")
                : "nenhuma preferência específica";

            preferencesText = `
              PREFERÊNCIAS OBRIGATÓRIAS DO PACIENTE:
              - Produtos/Vias de administração escolhidas: ${produtosSelecionados}.
              - Investimento mensal planejado: R$ ${data.monthlyInvestment}.
              - Duração esperada do tratamento: ${data.durationInMonths} meses.
              
              REGRA CRÍTICA DE PRESCRIÇÃO: Você DEVE prescrever EXCLUSIVAMENTE os produtos escolhidos pelo paciente (${produtosSelecionados}). Não prescreva óleos se ele escolheu apenas flores, por exemplo. Adapte a dosagem ao orçamento mensal informado.
            `;
          }

          // Monta a instrução do sistema com as preferências injetadas
          const instruction = `
            Você é o Doutor, um médico especialista em medicina canabinoide atuando no Brasil.
            Seu objetivo é conduzir uma de consulta médica.
            
            ${preferencesText}

            Você DEVE seguir exatamente estes passos, fazendo as perguntas de um passo de cada vez e aguardando a resposta do usuário antes de ir para o próximo:
            
            Passo 1 (Sintomas): Pergunte os sintomas principais e há quanto tempo o paciente sente isso.
            Passo 2 (Histórico): Pergunte sobre tratamentos atuais, medicamentos convencionais que utiliza e se há histórico de transtornos psiquiátricos na família.
            Passo 3 (Experiência): Pergunte se o paciente já teve experiência prévia com cannabis medicinal ou recreativa.
            Passo 4 (Prescrição): Com base nas respostas e nas PREFERÊNCIAS DO PACIENTE listadas acima, simule e explique um plano de tratamento restrito ao que o paciente escolheu. Explique brevemente o processo de autorização da Anvisa e pergunte se o paciente entendeu.
            Passo 5 (Escrever Laudo): Com base em TODAS as informações fornecidas, redija um "Laudo Médico para Uso de Cannabis Medicinal" completo e formal, resumo clínico, sem a identificação do paciente, CID (sugerido) e a prescrição recomendada (RESTRITA ÀS PREFERÊNCIAS). Formate lindamente usando Markdown. AO FINAL DO LAUDO, inclua obrigatoriamente a tag [FIM_DA_CONSULTA].

            Regras Gerais:
            - Médico Responsável: Dr. João Marcos Santos da Silva, CRM-MT 14316 - Especialidade Psiquiatria.
            - Na primeira mensagem (Passo 1), lembre que você é uma IA e não substitui um médico.
            - Seja empático e profissional.
            - Não é um documento simulado, pois será assinado por um médico de verdade, então não deixe nada explícito que possa indicar que é uma simulação.
            - Nunca faça todas as perguntas de uma vez, sempre uma pergunta por vez, aguardando a resposta do paciente.
            - Deixe bem claro que foi feita uma anamnese/triagem, pois a consulta oficial fica a cargo do médico.
          `;

          setDynamicSystemInstruction(instruction);
        } catch (error) {
          console.error("Erro ao buscar preferências:", error);
        } finally {
          setIsInitializing(false);
        }
      } else {
        // Usuário não logado (Redirecionar ou lidar com o erro)
        console.warn("Usuário não autenticado.");
        setIsInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isInitializing) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      // Usa a instrução dinâmica gerada após a busca no Firestore
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: dynamicSystemInstruction,
      });

      const chatHistory = messages.map((msg) => ({
        role: msg.role !== "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      const chat = model.startChat({
        history: chatHistory,
      });

      const result = await chat.sendMessage(userMessage);
      const responseText = result.response.text();

      let cleanText = responseText;
      let isFinished = false;

      if (responseText.includes("[FIM_DA_CONSULTA]")) {
        isFinished = true;
        cleanText = responseText.replace("[FIM_DA_CONSULTA]", "").trim();
      }

      setMessages((prev) => [...prev, { role: "model", text: cleanText }]);

      if (isFinished) {
        localStorage.setItem("laudoGerado", cleanText);
        setTimeout(() => {
          navigate("/pdf-download");
        }, 3500);
      }
    } catch (error) {
      console.error("Erro ao chamar a API:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Desculpe, ocorreu um erro na conexão com o consultório virtual.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Tela de Loading enquanto busca as preferências
  if (isInitializing) {
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#FDF9F3]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#34C759] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">
            Preparando seu prontuário...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#FDF9F3] font-sans">
      <header className="flex-none bg-[#FDF9F3]/80 backdrop-blur-md border-b border-gray-200/60 pt-6 pb-4 px-4 text-center sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
          Consultório Virtual
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-[#34C759] text-white rounded-2xl rounded-br-sm"
                  : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              ) : (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-400 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none bg-[#FDF9F3] p-4 pb-6">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 bg-white rounded-3xl pl-4 pr-1.5 py-1.5 shadow-sm border border-gray-200 focus-within:border-[#34C759] focus-within:ring-1 focus-within:ring-[#34C759]/20 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Descreva seus sintomas..."
            disabled={isLoading || isInitializing}
            rows={1}
            className="flex-1 max-h-32 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none resize-none py-2 disabled:opacity-50"
            style={{ minHeight: "40px" }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isInitializing}
            className="flex-none w-8 h-8 flex items-center justify-center bg-[#34C759] text-white rounded-full hover:bg-[#2eaa4c] disabled:opacity-50 transition-colors mb-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
