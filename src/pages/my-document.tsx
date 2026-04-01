import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import {
  LayoutDashboard,
  CalendarPlus,
  FileText,
  Stethoscope,
  Folder,
  Settings,
  HelpCircle,
  LogOut,
  MessageCircle,
  Leaf,
  ChevronDown,
  IdCard,
  CreditCard,
  Book,
  UploadCloud,
  File,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
  QrCode,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModalHelper from "../components/modal";
import { auth, db } from "../../firebaseConfig";

// MOCKS DE DADOS - Documentos
const mockDocumentos = [];

export default function MyDocuments() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const navigate = useNavigate();

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");

  // Estados para o fluxo de Captura
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  const [captureStep, setCaptureStep] = useState<
    "QR" | "FRENTE" | "VERSO" | "CONCLUIDO"
  >("QR");

  // Estados do Firebase Handoff
  const [sessionId, setSessionId] = useState<string | null>(null);
  const unsubscribeRef = useRef<() => void>();

  // Estado para armazenar as imagens capturadas (em base64)
  const [capturedData, setCapturedData] = useState({
    qr: null as string | null,
    frente: null as string | null,
    verso: null as string | null,
  });

  // Referência para a Webcam (usado como fallback no Desktop)
  const webcamRef = useRef<Webcam>(null);

  // =========================================================================
  // AJUSTE DE REDE LOCAL PARA O QR CODE
  // Se estiver no localhost, usa o seu IP para o celular conseguir acessar.
  // Se usar Vite em vez de Create React App, mude a porta de 3000 para 5173.
  // =========================================================================
  const qrCodeBaseUrl = window.location.origin;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-100 text-green-700";
      case "Em Análise":
        return "bg-yellow-100 text-yellow-700";
      case "Rejeitado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircle size={14} className="mr-1" />;
      case "Em Análise":
        return <Clock size={14} className="mr-1" />;
      case "Rejeitado":
        return <AlertCircle size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // 1. Função para Iniciar o Fluxo Mobile (Gera QR Code e escuta Firebase)
  const startMobileCapture = async () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setIsCaptureModalOpen(true);
    setCaptureStep("QR");

    try {
      // Cria a sessão no Firestore
      await setDoc(doc(db, "captureSessions", newSessionId), {
        status: "waiting",
        frente: null,
        verso: null,
        createdAt: new Date(),
      });

      // Escuta as alterações no documento criado
      const unsubscribe = onSnapshot(
        doc(db, "captureSessions", newSessionId),
        (docSnap) => {
          const data = docSnap.data();
          if (data && data.status === "completed") {
            setCapturedData({
              qr: null,
              frente: data.frente,
              verso: data.verso,
            });
            setCaptureStep("CONCLUIDO");
            if (unsubscribeRef.current) unsubscribeRef.current(); // Para de escutar
          }
        },
      );
      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      console.error("Erro ao iniciar sessão de captura:", error);
    }
  };

  // 2. Função de captura manual (Fallback Desktop)
  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (captureStep === "FRENTE") {
      setCapturedData((prev) => ({ ...prev, frente: imageSrc || null }));
      setCaptureStep("VERSO");
    } else if (captureStep === "VERSO") {
      setCapturedData((prev) => ({ ...prev, verso: imageSrc || null }));
      setCaptureStep("CONCLUIDO");
    }
  }, [captureStep, webcamRef]);

  // Função para pular etapa do QR Code e usar Webcam do Desktop
  const handleSkipStep = () => {
    if (captureStep === "QR") setCaptureStep("FRENTE");
  };

  // 3. Função para fechar modal e limpar Firebase
  const handleCloseModal = async () => {
    // Para de escutar o Firebase se fechar antes
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Deleta a sessão temporária para limpar o banco
    if (sessionId) {
      try {
        await deleteDoc(doc(db, "captureSessions", sessionId));
      } catch (error) {
        console.error("Erro ao deletar sessão do Firebase:", error);
      }
    }

    setIsCaptureModalOpen(false);
    setTimeout(() => {
      setCaptureStep("QR");
      setSessionId(null);
      setCapturedData({ qr: null, frente: null, verso: null });
    }, 300);
  };

  // 4. Função final para enviar os dados para seu Backend/Storage
  const handleFinalize = async () => {
    console.log("Dados capturados prontos para envio:", capturedData);
    // TODO: Adicionar lógica de upload para Cloudinary ou Firebase Storage aqui

    await handleCloseModal();
  };

  const videoConstraints = {
    facingMode: "environment",
  };

  // Limpa o listener ao desmontar o componente
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8f9f8] font-sans text-gray-800">
      {/* Sidebar Padrão Canna Consult */}
      <aside className="w-64 bg-white hidden md:flex flex-col shadow-[1px_0_5px_rgba(0,0,0,0.05)] z-10 sticky top-0 h-screen">
        <div className="h-32 bg-gradient-to-b from-[#34C759] to-[#5add7a] flex items-center justify-center shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm">
            <Leaf size={24} />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/patient-area");
                }}
                className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#34C759] transition-colors"
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
                <FileText size={18} className="mr-3" />
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
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/my-documents");
                }}
                className="flex items-center px-6 py-3 bg-[#f0fdf4] text-[#34C759] border-l-4 border-[#34C759] transition-colors"
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
                  Precisa de ajuda? Entre em contato
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Meus Documentos
            </h1>
            <p className="text-gray-500 text-sm">
              Gerencie e acesse todos os seus documentos médicos e de
              identificação.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg font-bold text-gray-800 mb-6">
                Enviar Documento
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Documento <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-left text-sm text-gray-500 flex items-center justify-between"
                    >
                      {selectedDocumentType || "Selecione o tipo"}
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${isSelectOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isSelectOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1">
                        <button
                          onClick={() => {
                            setSelectedDocumentType("RG");
                            setIsSelectOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <IdCard size={16} className="mr-3 text-gray-500" />
                          RG - Registro Geral
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocumentType("CNH");
                            setIsSelectOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <CreditCard
                            size={16}
                            className="mr-3 text-gray-500"
                          />
                          CNH - Habilitação
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDocumentType("Passaporte");
                            setIsSelectOpen(false);
                          }}
                          className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <Book size={16} className="mr-3 text-gray-500" />
                          Passaporte
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo <span className="text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-[#f0fdf4] hover:border-[#34C759] transition-colors cursor-pointer group h-32">
                      <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#34C759] group-hover:text-white transition-colors">
                        <UploadCloud size={20} />
                      </div>
                      <p className="text-xs font-medium text-gray-700">
                        Fazer Upload
                      </p>
                    </div>

                    <div
                      onClick={startMobileCapture}
                      className="border-2 border-[#34C759] bg-[#f0fdf4] rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-[#e1fce9] transition-colors cursor-pointer group h-32"
                    >
                      <div className="w-10 h-10 bg-[#34C759] text-white rounded-full flex items-center justify-center mb-2">
                        <Camera size={20} />
                      </div>
                      <p className="text-xs font-medium text-[#2eaa4d]">
                        Usar Câmera
                      </p>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-[#34C759] text-white font-medium py-2.5 rounded-lg hover:bg-[#2eaa4d] transition-colors shadow-sm">
                  Enviar Documento
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">
                  Documentos Enviados
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  {mockDocumentos.length} arquivos
                </span>
              </div>
              <div className="text-center py-10 text-gray-500 text-sm">
                Nenhum documento enviado ainda.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE CAPTURA DE DOCUMENTO */}
      {isCaptureModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">
                Captura de Documento
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-6 w-full justify-center">
                <span
                  className={`h-2 w-1/3 rounded-full transition-colors ${captureStep === "QR" || captureStep === "FRENTE" || captureStep === "VERSO" || captureStep === "CONCLUIDO" ? "bg-[#34C759]" : "bg-gray-200"}`}
                ></span>
                <span
                  className={`h-2 w-1/3 rounded-full transition-colors ${captureStep === "FRENTE" || captureStep === "VERSO" || captureStep === "CONCLUIDO" ? "bg-[#34C759]" : "bg-gray-200"}`}
                ></span>
                <span
                  className={`h-2 w-1/3 rounded-full transition-colors ${captureStep === "VERSO" || captureStep === "CONCLUIDO" ? "bg-[#34C759]" : "bg-gray-200"}`}
                ></span>
              </div>

              <div className="text-center mb-6 h-14">
                {captureStep === "QR" && (
                  <>
                    <h4 className="font-bold text-gray-800 flex items-center justify-center gap-2">
                      <QrCode size={20} /> Escaneie com o Celular
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Use a câmera do seu smartphone para melhor qualidade.
                    </p>
                  </>
                )}
                {captureStep === "FRENTE" && (
                  <>
                    <h4 className="font-bold text-gray-800 flex items-center justify-center gap-2">
                      <IdCard size={20} /> Foto da Frente
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Certifique-se de que a imagem está nítida.
                    </p>
                  </>
                )}
                {captureStep === "VERSO" && (
                  <>
                    <h4 className="font-bold text-gray-800 flex items-center justify-center gap-2">
                      <CreditCard size={20} /> Foto do Verso
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Capture o verso mostrando todos os dados.
                    </p>
                  </>
                )}
                {captureStep === "CONCLUIDO" && (
                  <>
                    <h4 className="font-bold text-gray-800">Tudo Pronto!</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      As imagens foram recebidas com sucesso.
                    </p>
                  </>
                )}
              </div>

              {/* Utilizando a variável qrCodeBaseUrl aqui! */}
              {captureStep === "QR" ? (
                <div className="w-full bg-gray-50 aspect-[4/3] rounded-xl flex flex-col items-center justify-center p-6 mb-6 shadow-inner border border-gray-200">
                  {sessionId && (
                    <>
                      <QRCodeSVG
                        value={`${qrCodeBaseUrl}/mobile-capture/${sessionId}`}
                        size={180}
                        level="H"
                        includeMargin={true}
                      />
                      <p className="mt-4 text-sm text-center text-gray-500 font-medium">
                        Aponte a câmera do seu celular para este código <br />
                        para enviar seus documentos.
                      </p>
                    </>
                  )}
                </div>
              ) : captureStep !== "CONCLUIDO" ? (
                <div className="w-full aspect-[4/3] bg-black rounded-xl flex items-center justify-center relative overflow-hidden mb-6 shadow-inner">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-4 border-2 border-white/60 rounded-lg border-dashed pointer-events-none"></div>
                </div>
              ) : (
                <div className="w-full grid grid-cols-2 gap-3 mb-6">
                  {capturedData.frente && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={capturedData.frente}
                        alt="Frente"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">
                        Frente
                      </div>
                    </div>
                  )}
                  {capturedData.verso && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={capturedData.verso}
                        alt="Verso"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs text-center py-1">
                        Verso
                      </div>
                    </div>
                  )}
                </div>
              )}

              {captureStep !== "QR" && (
                <button
                  onClick={
                    captureStep === "CONCLUIDO" ? handleFinalize : handleCapture
                  }
                  className="w-full bg-[#34C759] text-white font-bold py-3 rounded-xl hover:bg-[#2eaa4d] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {captureStep === "CONCLUIDO" ? (
                    <>
                      <CheckCircle size={20} /> Finalizar e Anexar
                    </>
                  ) : (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      Capturar Imagem
                    </>
                  )}
                </button>
              )}

              {captureStep === "QR" && (
                <button
                  onClick={handleSkipStep}
                  className="mt-4 text-sm font-medium text-gray-500 hover:text-[#34C759] transition-colors underline underline-offset-2"
                >
                  Estou no celular ou quero usar a webcam
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {isHelpModalOpen && (
        <ModalHelper setIsHelpModalOpen={setIsHelpModalOpen} />
      )}

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#34C759] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#2eaa4d] transition-colors z-50">
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
