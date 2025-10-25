import React from 'react';
import HeroSection from './components/HeroSection';
import SoundPad from './components/SoundPad';
import RecorderPanel from './components/RecorderPanel';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-amber-900 text-white relative">
      <HeroSection />
      <main className="relative z-10 container mx-auto px-4 pb-24">
        <SoundPad />
        <RecorderPanel />
      </main>
    </div>
  );
}
