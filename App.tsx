import React from 'react';
import Header from './components/Header';
import InteractiveDemo from './components/InteractiveDemo';
import ExplanationSection from './components/ExplanationSection';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-24">
        {/* Hero / Demo Section */}
        <section className="flex flex-col items-center justify-center space-y-8">
          <div className="text-center max-w-2xl space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              把光影變成魔法
            </h2>
            <p className="text-slate-400 text-lg">
              Projection Mapping（光雕投影）是一種將不規則物體（如建築、雕像）變成顯示表面的投影技術。試試下方的互動演示，了解它是如何工作的。
            </p>
          </div>
          
          <InteractiveDemo />
        </section>

        {/* Detailed Explanation */}
        <ExplanationSection />
      </main>

      <Footer />
    </div>
  );
};

export default App;