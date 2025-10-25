import React from 'react';
import Spline from '@splinetool/react-spline';

export default function HeroSection() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">jkon</h1>
            <p className="mt-2 text-white/80 max-w-xl">Colorful sound pad with instant FX and voice recorder. Tap to play. Create and download your voice as MP3.</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 font-semibold shadow-lg hover:shadow-xl active:scale-[0.98] transition transform">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <img src="https://via.placeholder.com/50?text=3" alt="screen3" className="w-[50px] h-[50px] rounded-md ring-1 ring-white/20 shadow" />
          </div>
        </div>
      </div>
    </section>
  );
}
