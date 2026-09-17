import { Header } from "./components/shared/Header";
import { Footer } from "./components/shared/Footer";
import { Hero, NewsCard, Services } from "./components/home/Hero";
import { MapSection, Features } from "./components/home/Sections";


function App() {
  return (
    <div className="min-h-screen bg-[#ececec] lg:bg-white">
      <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-white lg:max-w-none">
        <Header />
        <Hero />
        <NewsCard />
        <Services />
        <MapSection />
        <Features />
        <Footer />
      </div>
    </div>
  );
}

export default App;
