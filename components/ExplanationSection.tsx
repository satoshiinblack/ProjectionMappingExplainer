import React from 'react';
import { CubeIcon, ScanIcon, LayersIcon } from './Icons';

const ExplanationSection: React.FC = () => {
  const steps = [
    {
      icon: <LayersIcon size={40} className="text-cyan-400" />,
      title: "1. 導入素材 (Import Media)",
      description: "開啟 MadMapper，將Unity傳送的Spout畫面、設計好的影片、圖片或即時生成的 Shader 拖入右側的素材庫 (Media Library)。這些影像將作為投影的「貼圖」。"
    },
    {
      icon: <CubeIcon size={40} className="text-purple-400" />,
      title: "2. 建立表面 (Create Surfaces)",
      description: "在工作區點擊新增「Quad (四邊形)」或「Mask (遮罩)」。這些數位幾何圖層代表了現實空間中要被投影的物體表面。"
    },
    {
      icon: <ScanIcon size={40} className="text-pink-400" />,
      title: "3. 空間對位 (Spatial Mapping)",
      description: "將投影輸出全螢幕。使用滑鼠拖曳 Surface 的頂點 (Vertices)，使其與實體物體的角落精確重合。針對曲面物體，開啟 Mesh Warping 進行網格變形校正。"
    }
  ];

  return (
    <section className="space-y-12">
      <div className="text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">實戰教學：MadMapper 操作流程</h3>
        <p className="text-slate-400 max-w-3xl mx-auto">
          MadMapper 是業界最流行的光雕投影軟體之一。它將複雜的投影對位簡化為直覺的拖拉操作，讓藝術家能快速將影像貼合到任何物體上。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-colors group">
            <div className="mb-4 bg-slate-900 w-16 h-16 rounded-lg flex items-center justify-center border border-slate-700 group-hover:border-cyan-500/50 transition-colors shadow-lg">
              {step.icon}
            </div>
            <h4 className="text-xl font-bold text-slate-100 mb-3">{step.title}</h4>
            <p className="text-slate-400 leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Warping Section */}
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
              <span className="bg-cyan-500/20 p-1 rounded text-sm">A</span> 為什麼需要 Warping (變形)？
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              投影機投出的是標準矩形影像。但當影像投射到有角度或彎曲的表面時，畫面會被物理拉伸變形（Keystone Effect）。
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Warping 就是在電腦中<span className="text-cyan-400 font-bold">預先反向扭曲</span>影像，以抵消物理表面的變形，讓觀眾看到正常的畫面。
            </p>
          </div>
          
          <div className="w-full aspect-video bg-black rounded-lg relative overflow-hidden border border-slate-600 shadow-inner group cursor-pointer">
             <div className="absolute inset-0 flex items-center justify-center">
                {/* Visual guideline */}
                <div className="absolute w-32 h-32 border-2 border-dashed border-slate-600 opacity-50"></div>
                {/* The "Image" */}
                <div className="absolute w-32 h-32 bg-cyan-500/20 border-2 border-cyan-400 transform -skew-x-12 rotate-6 group-hover:skew-x-0 group-hover:rotate-0 transition-transform duration-700 flex items-center justify-center">
                   <span className="text-cyan-200 font-mono text-xs text-center p-2">Software<br/>Distortion</span>
                </div>
             </div>
             <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-black/50 px-2 rounded">Hover to Fix</div>
          </div>
        </div>

        {/* Masking Section */}
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-between">
          <div className="space-y-4 mb-8">
            <h4 className="text-xl font-bold text-pink-300 flex items-center gap-2">
              <span className="bg-pink-500/20 p-1 rounded text-sm">B</span> 什麼是 Masking (遮罩)？
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              投影機的光線原本是矩形的。如果不處理，多餘的光線會「溢出」到物體背後的牆壁或地板上，導致穿幫。
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Masking 就是在軟體中用黑色色塊將<span className="text-pink-400 font-bold">不需要投影的區域遮住</span>，像虛擬剪刀一樣裁剪光線，讓影像只顯現在物體輪廓內。
            </p>
          </div>

          <div className="w-full aspect-video bg-slate-900 rounded-lg relative overflow-hidden border border-slate-600 shadow-inner group cursor-pointer">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* The Physical Object (Circle) */}
              <div className="w-32 h-32 rounded-full bg-slate-700 border border-slate-600 z-10 flex items-center justify-center text-xs text-slate-400">
                Object
              </div>
              
              {/* The Projection (Square) */}
              <div className="absolute w-40 h-40 bg-pink-500/40 mix-blend-screen z-20 flex items-center justify-center transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:rounded-full group-hover:bg-pink-500/60">
                <span className="text-white font-bold drop-shadow-md text-sm opacity-0 group-hover:opacity-100 transition-opacity">Masked</span>
              </div>

              {/* Spill indicator (Text showing spill) */}
              <div className="absolute top-4 right-4 text-[10px] text-pink-500/80 font-mono group-hover:opacity-0 transition-opacity">
                ⚠️ Light Spill
              </div>
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 bg-black/50 px-2 rounded">Hover to Mask</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplanationSection;