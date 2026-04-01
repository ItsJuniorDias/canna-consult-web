import React, { useState, useEffect } from "react";
import axios from "axios";
import api from "../../service/axios";

// Importações do Firebase (Ajuste o caminho do seu arquivo firebase.js)
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  // --- Estados do Usuário (Firebase) ---
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const navigate = useNavigate();

  // --- Estados de Pagamento ---
  const [paymentMethod, setPaymentMethod] = useState("credit_card"); // 'credit_card' ou 'pix'

  // Estados Cartão
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Estados PIX (Receberá o objeto: { orderId, qrCodeUrl, qrCode })
  const [pixData, setPixData] = useState(null);

  // Estados de UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const PAGARME_PUBLIC_KEY = "pk_or73YD4FLCPQADbn";

  // --- Busca os dados do usuário no Firestore ao montar o componente ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.error("Documento do usuário não encontrado no Firestore!");
            setMessage({
              text: "Dados do usuário não encontrados.",
              type: "error",
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados no Firestore:", error);
          setMessage({ text: "Erro ao carregar seus dados.", type: "error" });
        }
      } else {
        setUserData(null);
      }
      setIsLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Efeito para checar o status do PIX a cada 5 segundos ---
  useEffect(() => {
    let intervalId;

    const checkPaymentStatus = async () => {
      try {
        const response = await api.get(
          `/api/checkout/status/${pixData.orderId}`,
        );

        if (response.data && response.data.status === "paid") {
          setMessage({
            text: "✅ PIX confirmado! Redirecionando para a consulta...",
            type: "success",
          });
          clearInterval(intervalId);

          setTimeout(() => {
            navigate("/chat");
          }, 1500);
        }
      } catch (error) {
        console.error("Erro ao verificar status do PIX:", error);
      }
    };

    if (pixData && pixData.orderId) {
      intervalId = setInterval(checkPaymentStatus, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pixData, navigate]);

  // --- Lida com o processo de Checkout ---
  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!userData) {
      setMessage({
        text: "Não foi possível carregar os dados do seu perfil.",
        type: "error",
      });
      return;
    }

    setIsProcessing(true);
    setMessage({ text: "Processando seu pedido...", type: "info" });

    try {
      const customerData = {
        name: userData.nomeCompleto,
        email: userData.email,
        document: userData.cpf ? String(userData.cpf).replace(/\D/g, "") : "",
        type: "individual",
        phones: {
          mobile_phone: {
            country_code: "55",
            area_code: userData.telefone
              ? String(userData.telefone).substring(0, 2)
              : "",
            number: userData.telefone
              ? String(userData.telefone).substring(2)
              : "",
          },
        },
      };

      const itemsData = [
        {
          amount: 12990,
          description: "Consulta Medicinal - 15 minutos",
          quantity: 1,
          code: "PROD123",
        },
      ];

      if (paymentMethod === "credit_card") {
        const tokenResponse = await axios.post(
          `https://api.pagar.me/core/v5/tokens?appId=${PAGARME_PUBLIC_KEY}`,
          {
            type: "card",
            card: {
              number: cardNumber.replace(/\s/g, ""),
              holder_name: cardName,
              exp_month: parseInt(expMonth),
              exp_year: parseInt(expYear),
              cvv: cardCvv,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const tokenData = tokenResponse.data;

        const response = await api.post("/api/checkout/cartao", {
          cardToken: tokenData.id,
          installments: 1,
          customer: customerData,
          items: itemsData,
        });

        const result = response.data;

        if (result.success) {
          setMessage({ text: "🎉 Cartão aprovado!", type: "success" });
          navigate("/chat");
        }
      } else {
        const response = await api.post("/api/checkout/pix", {
          customer: customerData,
          items: itemsData,
        });

        const result = response.data;

        if (result.qrCode) {
          setPixData(result);
          setMessage({
            text: "PIX gerado com sucesso! Aguardando pagamento...",
            type: "info",
          });
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocorreu um erro no processamento.";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData.qrCode);
    setMessage({
      text: "Código Copia e Cola copiado para a área de transferência!",
      type: "success",
    });
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-500 font-medium animate-pulse text-lg">
          Carregando ambiente seguro...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
      {/* 1. ADICIONADO min-h-[600px] NO CONTAINER PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden transition-all min-h-[600px]">
        {/* Lado Esquerdo - Imagem e Descrição do Produto */}
        {/* 2. MUDADO PARA flex flex-col PARA ALINHAR O CONTEÚDO CORRETAMENTE */}
        <div className="hidden md:flex flex-col md:w-1/2 relative bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1637091998767-e6a9d5e80271?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ilustração de Checkout"
            className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-0"></div>

          {/* 3. MUDADO DE absolute inset-0 PARA relative z-10 h-full */}
          <div className="relative z-10 p-10 flex flex-col justify-end h-full text-white">
            <span className="bg-[#34C759] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider w-max mb-4">
              Agendamento
            </span>
            <h2 className="text-3xl font-bold mb-4">Consulta & Diagnóstico</h2>
            <div className="flex items-center gap-4 mb-6 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20">
              <img
                src="https://res.cloudinary.com/dqvujibkn/image/upload/v1774995510/220930_Med19Ufac_Studio_7507.jpg_rylikg.jpg"
                alt="Dr. João Marcos Santos da Silva"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#34C759] shadow-lg shrink-0"
              />
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">
                  Dr. João Marcos Santos da Silva
                </h3>
                <p className="text-[#34C759] text-sm font-semibold mt-1">
                  Psiquiatria • CRM-MT 14316
                </p>
              </div>
            </div>
            <p className="text-gray-200 text-sm leading-relaxed mb-6">
              Avaliação completa com nossos especialistas. Inclui análise
              detalhada do seu histórico, exames físicos preliminares e a
              elaboração de um plano de tratamento totalmente personalizado.
            </p>
            <ul className="flex flex-col gap-3 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-[#34C759] text-lg">✔</span> Duração
                estimada de 15 minutos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#34C759] text-lg">✔</span> Retorno
                garantido em até 15 dias
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#34C759] text-lg">✔</span> Atendimento
                presencial ou online
              </li>
            </ul>
            <div className="pt-6 border-t border-white/20 flex justify-between items-center mt-auto">
              <span className="text-lg text-gray-300">Total a pagar</span>
              <span className="text-3xl font-bold">R$ 129,90</span>
            </div>
          </div>
        </div>

        {/* Lado Direito - Formulário */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Finalizar Compra
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Escolha como deseja pagar.
          </p>

          {/* Seleção de Método */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => {
                setPaymentMethod("credit_card");
                setPixData(null);
              }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                paymentMethod === "credit_card"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
              }`}
            >
              💳 Cartão
            </button>
            <button
              onClick={() => setPaymentMethod("pix")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                paymentMethod === "pix"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500"
              }`}
            >
              💎 PIX
            </button>
          </div>

          {!pixData ? (
            <form onSubmit={handleCheckout} className="flex flex-col gap-5">
              {paymentMethod === "credit_card" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOAO DA SILVA"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#34C759] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#34C759] outline-none transition-all"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Validade
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="MM"
                          required
                          value={expMonth}
                          onChange={(e) => setExpMonth(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 text-center focus:ring-2 focus:ring-[#34C759] outline-none transition-all"
                        />
                        <input
                          type="text"
                          placeholder="AAAA"
                          required
                          value={expYear}
                          onChange={(e) => setExpYear(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-200 text-center focus:ring-2 focus:ring-[#34C759] outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-200 text-center focus:ring-2 focus:ring-[#34C759] outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 text-center bg-gray-50 rounded-xl border border-gray-100 flex-1 flex flex-col justify-center">
                  <p className="text-gray-600 text-sm px-4">
                    O código PIX tem validade de{" "}
                    <span className="font-bold">1 hora</span>. O pagamento é
                    aprovado instantaneamente.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 py-4 bg-[#34C759] hover:bg-[#2eb350] text-white rounded-xl font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                {isProcessing
                  ? "Processando..."
                  : `Pagar com ${paymentMethod === "pix" ? "PIX" : "Cartão"}`}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center animate-fadeIn">
              <p className="text-xs text-gray-400 uppercase font-bold mb-4">
                Pedido: <span className="text-gray-600">{pixData.orderId}</span>
              </p>

              <div className="mb-4 text-sm font-semibold text-[#34C759] animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
                Aguardando pagamento...
              </div>

              <div className="bg-white p-4 border-2 border-dashed border-[#34C759] rounded-xl mb-4">
                <img
                  src={pixData.qrCodeUrl}
                  alt="QR Code PIX"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="w-full mb-6">
                <p className="text-xs text-gray-500 font-mono break-all bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-24 overflow-y-auto">
                  {pixData.qrCode}
                </p>
              </div>

              <button
                onClick={handleCopyPix}
                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-[#34C759] font-bold rounded-xl transition-all border border-gray-200 shadow-sm"
              >
                📋 Copiar código "Copia e Cola"
              </button>
            </div>
          )}

          {message.text && (
            <div
              className={`mt-6 p-4 rounded-xl text-sm text-center font-medium transition-all ${
                message.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : message.type === "info"
                    ? "bg-blue-50 text-blue-700 border border-blue-100"
                    : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
