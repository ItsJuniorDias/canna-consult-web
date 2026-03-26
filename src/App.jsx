import AboutDoctor from "./components/about-doctor";
import Footer from "./components/footer";
import Header from "./components/header";
import HowItWorks from "./components/how-its-works";
import MedicalCannabisHero from "./components/medical-header";
import WhyChooseUs from "./components/why-choose-us";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MedicalCannabisHero />
      <HowItWorks />
      <WhyChooseUs />
      <AboutDoctor />
      <Footer />
    </div>
  );
}

export default App;
