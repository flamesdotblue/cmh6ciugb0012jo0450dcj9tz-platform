// Lightweight WebAudio synthesis for sound pad
export function createAudioEngine(options = {}) {
  const state = {
    ctx: null,
  };

  const ensureReady = async () => {
    if (!state.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      try {
        state.ctx = new AudioCtx({ sampleRate: options.sampleRate || undefined });
      } catch {
        state.ctx = new AudioCtx();
      }
    }
    if (state.ctx.state === 'suspended') await state.ctx.resume();
  };

  const now = () => state.ctx.currentTime;
  const gain = (v = 1) => {
    const g = state.ctx.createGain();
    g.gain.value = v;
    return g;
    };
  const osc = (type = 'sine', freq = 440) => {
    const o = state.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    return o;
  };
  const noiseBuffer = () => {
    const length = state.ctx.sampleRate * 2;
    const buffer = state.ctx.createBuffer(1, length, state.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * 0.9;
    return buffer;
  };

  const playBass = () => {
    const t0 = now();
    const o = osc('sawtooth', 100);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.8, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);

    o.frequency.setValueAtTime(120, t0);
    o.frequency.exponentialRampToValueAtTime(40, t0 + 0.5);

    const f = state.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(800, t0);
    f.frequency.exponentialRampToValueAtTime(200, t0 + 0.5);

    o.connect(f).connect(g).connect(state.ctx.destination);
    o.start(t0);
    o.stop(t0 + 0.7);
  };

  const playLaser = () => {
    const t0 = now();
    const o = osc('square', 1000);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.8, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);

    o.frequency.setValueAtTime(1600, t0);
    o.frequency.exponentialRampToValueAtTime(200, t0 + 0.5);

    const f = state.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    f.Q.value = 6;

    o.connect(f).connect(g).connect(state.ctx.destination);
    o.start(t0);
    o.stop(t0 + 0.6);
  };

  const playElectroBassHeat = () => {
    const t0 = now();
    const o1 = osc('sawtooth', 60);
    const o2 = osc('sawtooth', 61);
    const g = gain(0.0001);

    const f = state.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(600, t0);

    const dist = state.ctx.createWaveShaper();
    dist.curve = makeDistortionCurve(20);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.9, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);

    o1.connect(f);
    o2.connect(f);
    f.connect(dist).connect(g).connect(state.ctx.destination);

    o1.start(t0); o2.start(t0);
    o1.stop(t0 + 0.9); o2.stop(t0 + 0.9);
  };

  const playBassDrum = () => {
    const t0 = now();
    const o = osc('sine', 120);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(1.0, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6);

    o.frequency.setValueAtTime(150, t0);
    o.frequency.exponentialRampToValueAtTime(40, t0 + 0.5);

    const click = osc('square', 1000);
    const g2 = gain(0.0001);
    g2.gain.setValueAtTime(0.0001, t0);
    g2.gain.exponentialRampToValueAtTime(0.5, t0 + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);

    o.connect(g).connect(state.ctx.destination);
    click.connect(g2).connect(state.ctx.destination);
    o.start(t0); o.stop(t0 + 0.7);
    click.start(t0); click.stop(t0 + 0.06);
  };

  const playWhooshBass = () => {
    const t0 = now();
    const src = state.ctx.createBufferSource();
    src.buffer = noiseBuffer();
    const f = state.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(200, t0);
    f.frequency.exponentialRampToValueAtTime(2000, t0 + 0.6);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.7, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);

    src.connect(f).connect(g).connect(state.ctx.destination);
    src.start(t0);
    src.stop(t0 + 0.75);
  };

  const playDrumFx = () => {
    const t0 = now();
    const src = state.ctx.createBufferSource();
    src.buffer = noiseBuffer();
    const f = state.ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 800;
    f.Q.value = 4;
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.8, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);

    src.connect(f).connect(g).connect(state.ctx.destination);
    src.start(t0);
    src.stop(t0 + 0.3);
  };

  const playDrumClick = () => {
    const t0 = now();
    const o = osc('triangle', 300);
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.7, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

    o.connect(g).connect(state.ctx.destination);
    o.start(t0);
    o.stop(t0 + 0.15);
  };

  const playNoiseFx = () => {
    const t0 = now();
    const src = state.ctx.createBufferSource();
    src.buffer = noiseBuffer();
    const f = state.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    f.Q.value = 1.5;
    const g = gain(0.0001);
    g.gain.setValueAtTime(0.6, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4);

    src.connect(f).connect(g).connect(state.ctx.destination);
    src.start(t0);
    src.stop(t0 + 0.45);
  };

  return {
    get ctx() { return state.ctx; },
    ensureReady,
    playBass,
    playLaser,
    playElectroBassHeat,
    playBassDrum,
    playWhooshBass,
    playDrumFx,
    playDrumClick,
    playNoiseFx,
  };
}

function makeDistortionCurve(amount = 20) {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  let i = 0;
  let x;
  for (; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}
