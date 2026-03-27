// import { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// console.log(process.env.VITE_GEMINI_API_KEY, "API KEY");

// // Inicializa a API com a sua chave (ajuste process.env ou import.meta.env dependendo do seu bundler)
// const apiKey = process.env.VITE_GEMINI_API_KEY; // Use process.env.REACT_APP_GEMINI_API_KEY se for CRA
// const genAI = new GoogleGenerativeAI(apiKey);

// export default function ChatScreen() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     // 1. Adiciona a mensagem do usuário na tela
//     const userMessage = input;
//     setInput("");
//     setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
//     setIsLoading(true);

//     try {
//       // 2. Prepara o modelo (gemini-1.5-flash é o mais rápido e recomendado para chat geral)
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       // 3. Formata o histórico do React para o formato que a API do Gemini entende
//       const chatHistory = messages.map((msg) => ({
//         role: msg.role === "user" ? "user" : "model",
//         parts: [{ text: msg.text }],
//       }));

//       // 4. Inicia o chat passando o histórico
//       const chat = model.startChat({
//         history: chatHistory,
//       });

//       // 5. Envia a nova mensagem e aguarda a resposta
//       const result = await chat.sendMessage(userMessage);
//       const responseText = result.response.text();

//       // 6. Adiciona a resposta do Gemini na tela
//       setMessages((prev) => [...prev, { role: "model", text: responseText }]);
//     } catch (error) {
//       console.error("Erro ao chamar a API do Gemini:", error);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "model",
//           text: "Desculpe, ocorreu um erro ao processar sua mensagem.",
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-2xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[80vh]">
//         {/* Cabeçalho */}
//         <div className="bg-blue-600 p-4 text-white">
//           <h1 className="text-xl font-bold">Chat com Gemini</h1>
//         </div>

//         {/* Área de Mensagens */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           {messages.length === 0 ? (
//             <p className="text-center text-gray-500 mt-10">
//               Mande um "Olá" para começar!
//             </p>
//           ) : (
//             messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[75%] p-3 rounded-lg ${
//                     msg.role === "user"
//                       ? "bg-blue-600 text-white rounded-tr-none"
//                       : "bg-gray-200 text-gray-800 rounded-tl-none"
//                   }`}
//                 >
//                   {/* renderização básica de texto; para markdown, seria ideal usar react-markdown */}
//                   <p className="whitespace-pre-wrap">{msg.text}</p>
//                 </div>
//               </div>
//             ))
//           )}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none animate-pulse">
//                 Digitando...
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Input e Botão de Envio */}
//         <form
//           onSubmit={handleSendMessage}
//           className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Digite sua mensagem..."
//             disabled={isLoading}
//             className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
//           />
//           <button
//             type="submit"
//             disabled={isLoading || !input.trim()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
//           >
//             Enviar
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
