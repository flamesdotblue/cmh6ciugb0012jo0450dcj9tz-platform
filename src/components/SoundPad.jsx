import React, { useRef } from 'react';
import { createAudioEngine } from '../lib/audio';

const padStyle = 'flex-1 min-w-[140px] h-24 rounded-xl bg-white/10 backdrop-blur border border-white/15 hover:bg-white/15 active:scale-[0.98] transition shadow-lg';

export default function SoundPad() {
  const engineRef = useRef(null);
  const getEngine = () => {
    if (!engineRef.current) engineRef.current = createAudioEngine();
    return engineRef.current;
  };

  const play = async (type) => {
    const eng = getEngine();
    await eng.ensureReady();
    switch (type) {
      case 'bass':
        eng.playBass();
        break;
      case 'laser':
        eng.playLaser();
        break;
      case 'electroBassHeat':
        eng.playElectroBassHeat();
        break;
      case 'bassDrum':
        eng.playBassDrum();
        break;
      case 'whooshBass':
        eng.playWhooshBass();
        break;
      case 'drumFx':
        eng.playDrumFx();
        break;
      case 'drum':
        eng.playDrumClick();
        break;
      case 'noiseFx':
        eng.playNoiseFx();
        break;
      default:
        break;
    }
  };

  const handleRecorderShortcut = () => {
    const el = document.getElementById('recorder-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const btn = document.getElementById('recorder-toggle');
      if (btn && btn.dataset.state !== 'recording') {
        btn.click();
      }
    }
  };

  return (
    <section className="relative z-10 container mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Sound Pad</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <button onClick={() => play('bass')} className={padStyle}>1. Bass</button>
        <button onClick={() => play('laser')} className={padStyle}>2. Laser FX</button>
        <button onClick={() => play('electroBassHeat')} className={padStyle}>3. Electronic Bass Heat</button>
        <button onClick={handleRecorderShortcut} className={padStyle}>4. Voice Recorder</button>
        <button onClick={() => play('bassDrum')} className={padStyle}>5. Bass Drum</button>
        <button onClick={() => play('whooshBass')} className={padStyle}>6. Whoosh Bass</button>
        <button onClick={() => play('drumFx')} className={padStyle}>7. Drum FX</button>
        <button onClick={() => play('drum')} className={padStyle}>8. Drum</button>
        <button onClick={() => play('noiseFx')} className={padStyle}>9. Noise FX</button>
      </div>
    </section>
  );
}
