import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { useParams } from "react-router-dom";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; // Ajuste o caminho conforme seu projeto
import { Camera, CheckCircle, IdCard, CreditCard, Leaf } from "lucide-react";

export default function MobileCapture() {
  // Assumindo que o sessionId passado na URL seja o mesmo ID do documento na collection 'document'
  const { sessionId } = useParams();
  const webcamRef = useRef(null);

  console.log(sessionId, "SESSION ID DO PARAMS");

  const [step, setStep] = useState("FRENTE"); // FRENTE, VERSO ou CONCLUIDO
  const [isUploading, setIsUploading] = useState(false);
  const [capturedData, setCapturedData] = useState({
    frente: null,
    verso: null,
  });

  const videoConstraints = {
    facingMode: "environment",
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };

  // Função auxiliar para fazer o upload do base64 para o Cloudinary
  const uploadToCloudinary = async (base64Image) => {
    const formData = new FormData();
    formData.append("file", base64Image);
    formData.append("upload_preset", "expo-upload"); // Lembre-se de colocar seu preset aqui
    formData.append("cloud_name", "dqvujibkn");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dqvujibkn/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Falha no upload para o Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleCapture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (step === "FRENTE") {
      setCapturedData({ ...capturedData, frente: imageSrc });
      setStep("VERSO");
    } else if (step === "VERSO") {
      const newVerso = imageSrc;
      setCapturedData({ ...capturedData, verso: newVerso });
      setStep("CONCLUIDO");
      setIsUploading(true);

      try {
        // 1. Faz o upload das duas imagens para o Cloudinary em paralelo para ganhar tempo

        const responseFront = await uploadToCloudinary(capturedData.frente);

        console.log("Resposta do Cloudinary para a frente:", responseFront);
        const responseBack = await uploadToCloudinary(newVerso);
        console.log("Resposta do Cloudinary para o verso:", responseBack);

        // 2. Atualiza diretamente a collection 'document' com as URLs geradas
        const documentRef = doc(db, "document", sessionId);

        await setDoc(documentRef, {
          userId: auth.currentUser.uid, // Certifique-se de que isso é o que você quer armazenar
          frontImageUrl: responseFront,
          backImageUrl: responseBack,
          status: "COMPLETED", // Atualiza o status para COMPLETED
          createdAt: new Date(), // Atualiza a data de criação para o momento do upload
        });
      } catch (error) {
        console.error("Erro ao enviar os documentos:", error);
        alert("Ocorreu um erro ao processar as imagens. Tente novamente.");
        setStep("VERSO"); // Volta um passo para o usuário tentar novamente
      } finally {
        setIsUploading(false);
      }
    }
  }, [step, capturedData, sessionId]);

  // TELA DE SUCESSO
  if (step === "CONCLUIDO") {
    return (
      <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#f0fdf4] p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-b from-[#34C759] to-[#5add7a] rounded-full flex items-center justify-center text-white shadow-md mb-8">
          <Leaf size={32} />
        </div>

        <CheckCircle size={80} className="text-[#34C759] mb-6" />

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isUploading ? "Processando e Enviando..." : "Tudo Certo!"}
        </h1>
        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
          {isUploading
            ? "Aguarde enquanto enviamos as imagens em alta resolução e sincronizamos com o sistema."
            : "Documentos enviados com sucesso. Você já pode fechar esta tela e voltar para o computador!"}
        </p>

        {isUploading && (
          <div className="flex gap-2">
            <div
              className="w-3 h-3 bg-[#34C759] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#34C759] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-[#34C759] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>
    );
  }

  // TELA DA CÂMERA (O restante continua igual, a interface está ótima)
  return (
    <div className="flex flex-col h-[100dvh] bg-black">
      <div className="bg-white/10 backdrop-blur-md p-6 pb-4 text-center z-10 border-b border-white/10">
        <div className="flex justify-center mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-12 rounded-full transition-colors ${step === "FRENTE" || step === "VERSO" ? "bg-[#34C759]" : "bg-white/30"}`}
            ></span>
            <span
              className={`h-1.5 w-12 rounded-full transition-colors ${step === "VERSO" ? "bg-[#34C759]" : "bg-white/30"}`}
            ></span>
          </div>
        </div>
        <h2 className="text-white text-xl font-bold flex items-center justify-center gap-2 mb-1">
          {step === "FRENTE" ? (
            <IdCard size={24} className="text-[#34C759]" />
          ) : (
            <CreditCard size={24} className="text-[#34C759]" />
          )}
          Foto da {step === "FRENTE" ? "Frente" : "Parte de Trás"}
        </h2>
        <p className="text-white/80 text-sm font-medium">
          Posicione o documento no centro da moldura
        </p>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 pointer-events-none flex items-center justify-center">
          <div className="w-[85%] aspect-[3/4] sm:aspect-[4/3] border-2 border-[#34C759] rounded-xl border-dashed shadow-[0_0_0_4000px_rgba(0,0,0,0.4)] relative">
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#34C759] rounded-tl-xl"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#34C759] rounded-tr-xl"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#34C759] rounded-bl-xl"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#34C759] rounded-br-xl"></div>
          </div>
        </div>
      </div>

      <div className="bg-black pb-12 pt-8 flex justify-center z-10">
        <button
          onClick={handleCapture}
          className="w-20 h-20 bg-white rounded-full border-4 border-gray-600 flex items-center justify-center active:scale-95 transition-all shadow-[0_0_20px_rgba(52,199,89,0.3)]"
        >
          <div className="w-16 h-16 bg-transparent border-2 border-gray-800 rounded-full flex items-center justify-center">
            <Camera size={28} className="text-gray-800" />
          </div>
        </button>
      </div>
    </div>
  );
}
