import React from "react";
import Station3DViewer from "./Station3DViewer";

export default function InteractiveShowcaseSection() {
  return (
    <section
      id="showcase"
      aria-labelledby="showcase-heading"
      className="relative py-32 px-4 bg-gray-900 overflow-hidden"
    >
      {/* Background Parallax Layer */}
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585320806055-6c7c00e6206d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center bg-no-repeat opacity-20 bg-fixed"
        aria-hidden="true"
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-left">
          <h2
            id="showcase-heading"
            className="text-4xl font-bold text-white mb-6 tracking-tight drop-shadow-md"
          >
            Experience the Future of Growing
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Take a 3D tour of the Garden Station. Watch the robotic arm in action, see the integrated AI vision sensors, and explore how every component works in perfect harmony to maximize your yield.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg">
              Explore 3D Model
            </button>
            <button className="px-8 py-3 bg-transparent text-white font-medium rounded-lg border-2 border-white/30 hover:bg-white/10 transition-colors">
              Watch Video
            </button>
          </div>
        </div>

        {/* Interactive 3D Showcase Container */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl">
            <Station3DViewer showControls={true} className="rounded-2xl" />
            <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-gray-900/60 to-transparent" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
