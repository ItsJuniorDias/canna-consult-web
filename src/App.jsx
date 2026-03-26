import DefineObjetive from "./pages/define-objetive";
import HistoryHealth from "./pages/history-health";
import Home from "./pages/home";
import InfoPhisical from "./pages/info-phisical";
import Login from "./pages/login";
import MentalHealth from "./pages/mental-health";
import Preference from "./pages/preference";

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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
