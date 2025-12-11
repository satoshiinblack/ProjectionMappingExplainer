import React from 'react';
import { ProjectorIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-cyan-400">
            <ProjectorIcon size={32} />
          </div>
          <h1 className="text-xl font-bold tracking-wider uppercase text-white">
            Projection<span className="text-cyan-400">Lab</span>
          </h1>
        </div>
        <nav>
          <a 
            href="https://en.wikipedia.org/wiki/Projection_mapping" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Learn More →
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;