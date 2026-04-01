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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/define-objective" element={<DefineObjetive />} />
          <Route path="/history-health" element={<HistoryHealth />} />
          <Route path="/mental-health" element={<MentalHealth />} />
          <Route path="/info-phisical" element={<InfoPhisical />} />
          <Route path="/preference" element={<Preference />} />
          <Route path="/chat" element={<ChatScreen />} />
          <Route path="/paywall" element={<Paywall />} />
          <Route path="/pdf-download" element={<PDFDownload />} />
          <Route path="/patient-area" element={<PatientArea />} />
          <Route path="/new-consult" element={<NewConsult />} />
          <Route path="/my-recipes" element={<MyReceipts />} />
          <Route path="/my-consultations" element={<MyConsultations />} />
          <Route path="/my-documents" element={<MyDocuments />} />
          <Route path="/config" element={<Config />} />
          <Route path="/medical-area" element={<MedicalArea />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route
            path="/mobile-capture/:sessionId"
            element={<MobileCapture />}
          />{" "}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
