import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-slate-800 bg-slate-900">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          Designed with React & Tailwind CSS.
        </p>
        <p className="text-slate-600 text-xs mt-2">
          © {new Date().getFullYear()} Projection Mapping Demo. For educational purposes.
        </p>
      </div>
    </footer>
  );
};

export default Footer;