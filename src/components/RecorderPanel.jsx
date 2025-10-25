import React, { useEffect, useRef, useState } from 'react';
import { createAudioEngine } from '../lib/audio';

export default function RecorderPanel() {
  const [recording, setRecording] = useState(false);
  const [mp3Blob, setMp3Blob] = useState(null);
  const [error, setError] = useState('');
  const engineRef = useRef(null);
  const workRef = useRef({});

  const getEngine = () => {
    if (!engineRef.current) engineRef.current = createAudioEngine({ sampleRate: 44100 });
    return engineRef.current;
  };

  useEffect(() => {
    return () => {
      if (workRef.current.stream) {
        workRef.current.stream.getTracks().forEach(t => t.stop());
      }
      if (workRef.current.source) workRef.current.source.disconnect();
      if (workRef.current.processor) workRef.current.processor.disconnect();
    };
  }, []);

  async function startRecording() {
    setError('');
    setMp3Blob(null);
    const eng = getEngine();
    await eng.ensureReady();

    try {
      const Lame = await import('https://esm.sh/lamejs');
      workRef.current.Lame = Lame;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      workRef.current.stream = stream;

      const ac = eng.ctx;

      const source = ac.createMediaStreamSource(stream);
      const processor = ac.createScriptProcessor(4096, 1, 1);

      const mp3Encoder = new Lame.Mp3Encoder(1, ac.sampleRate || 44100, 128);
      const mp3Data = [];

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const buffer = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          let s = Math.max(-1, Math.min(1, input[i]));
          buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        const chunk = mp3Encoder.encodeBuffer(buffer);
        if (chunk.length > 0) mp3Data.push(chunk);
      };

      source.connect(processor);
      processor.connect(ac.destination);

      workRef.current.source = source;
      workRef.current.processor = processor;
      workRef.current.finish = () => {
        const end = mp3Encoder.flush();
        if (end.length > 0) mp3Data.push(end);
        const blob = new Blob(mp3Data, { type: 'audio/mpeg' });
        setMp3Blob(blob);
      };

      setRecording(true);
    } catch (e) {
      console.error(e);
      setError('Microphone permission or encoding error.');
    }
  }

  function stopRecording() {
    try {
      if (workRef.current.stream) workRef.current.stream.getTracks().forEach(t => t.stop());
      if (workRef.current.source) workRef.current.source.disconnect();
      if (workRef.current.processor) workRef.current.processor.disconnect();
      if (workRef.current.finish) workRef.current.finish();
    } finally {
      setRecording(false);
    }
  }

  return (
    <section id="recorder-panel" className="mt-12">
      <div className="rounded-2xl bg-white/10 border border-white/15 p-6 backdrop-blur">
        <h3 className="text-lg font-semibold">Voice Recorder</h3>
        <p className="text-white/70 mb-4">No time limit. Click record, then stop, then download as MP3.</p>
        {error && <p className="text-red-300 mb-3">{error}</p>}
        <div className="flex items-center gap-3">
          <button
            id="recorder-toggle"
            data-state={recording ? 'recording' : 'idle'}
            onClick={recording ? stopRecording : startRecording}
            className={`px-5 py-3 rounded-lg font-semibold shadow ${recording ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} transition`}
          >
            {recording ? 'Stop' : 'Record'}
          </button>
          {mp3Blob && (
            <a
              href={URL.createObjectURL(mp3Blob)}
              download={`jkon-recording-${Date.now()}.mp3`}
              className="px-5 py-3 rounded-lg font-semibold bg-white text-black shadow hover:shadow-lg"
            >
              Download MP3
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
