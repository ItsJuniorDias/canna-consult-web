import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Confirme se este caminho está correto no seu projeto

// Importação das páginas
import ChatScreen from "./pages/chat";
import DefineObjetive from "./pages/define-objetive";
import HistoryHealth from "./pages/history-health";
import Home from "./pages/home";
import InfoPhisical from "./pages/info-phisical";
import Login from "./pages/login";
import MentalHealth from "./pages/mental-health";
import Paywall from "./pages/paywall";
import Preference from "./pages/preference";
import PDFDownload from "./pages/pdf-download";
import PatientArea from "./pages/patient-area";
import NewConsult from "./pages/new-consult";
import MyReceipts from "./pages/my-recipes";
import MyConsultations from "./pages/my-consultations";
import MyDocuments from "./pages/my-document";
import Config from "./pages/config";
import MedicalArea from "./pages/medical-area";
import Checkout from "./pages/checkout";
import MobileCapture from "./pages/mobile-capture";

// Componente de Rota Protegida
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // O onAuthStateChanged observa ativamente o status de login do usuário
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);

      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      // Após o Firebase responder, tiramos a tela de loading
      setLoading(false);
    });

    // Limpeza do listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

  // Exibe um carregamento enquanto verifica com o servidor do Firebase
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Carregando...</span>
      </div>
    );
  }

  // Se estiver autenticado, renderiza a rota filha. Se não, redireciona para o login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Routes>
          {/* --- ROTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/define-objective" element={<DefineObjetive />} />
          <Route path="/history-health" element={<HistoryHealth />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/info-phisical" element={<InfoPhisical />} />
          <Route path="/preference" element={<Preference />} />
          <Route path="/paywall" element={<Paywall />} />

          <Route path="/new-consult" element={<NewConsult />} />
          <Route path="/my-recipes" element={<MyReceipts />} />
          <Route path="/my-consultations" element={<MyConsultations />} />
          <Route path="/my-documents" element={<MyDocuments />} />
          <Route path="/config" element={<Config />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/mobile-capture/:sessionId"
            element={<MobileCapture />}
          />

          {/* --- ROTAS PROTEGIDAS --- */}
          <Route element={<ProtectedRoute />}>
            <Route path="/patient-area" element={<PatientArea />} />
            <Route path="/medical-area" element={<MedicalArea />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route path="/pdf-download" element={<PDFDownload />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
