import React from "react";
import AboutDoctor from "../components/about-doctor";
import Footer from "../components/footer";
import Header from "../components/header";
import HowItWorks from "../components/how-its-works";
import MedicalCannabisHero from "../components/medical-header";
import WhyChooseUs from "../components/why-choose-us";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Adicionei uma tag <main> para semântica.
        O pt-16 (padding-top) evita que o Hero fique escondido atrás do header fixo no carregamento inicial da página.
      */}
      <main className="pt-16">
        {/* Assumindo que o Hero é o topo da página */}
        <MedicalCannabisHero />

        {/* Mapeando os IDs que definimos no Header */}
        <section id="recursos">
          <HowItWorks />
        </section>

        <section id="tratamentos">
          {/* Se você tiver um componente específico de tratamentos, ele entraria aqui. 
              Vou usar o WhyChooseUs como exemplo para preencher o espaço. */}
          <WhyChooseUs />
        </section>

        <section id="medicos">
          <AboutDoctor />
        </section>
      </main>

      <section id="contato">
        <Footer />
      </section>
    </div>
  );
}

export default App;
