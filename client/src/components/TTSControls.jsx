import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Settings2 } from 'lucide-react';

export default function TTSControls({ text }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoiceURI, setSelectedVoiceURI] = useState('');
    const [speed, setSpeed] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    // Initialize voices
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                if (!selectedVoiceURI) {
                    const defaultVoice = availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
                    setSelectedVoiceURI(defaultVoice.voiceURI);
                }
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.cancel();
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    // Sync state with synthesizer
    useEffect(() => {
        const handleEnd = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };

        const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking && isPlaying && !isPaused) {
                handleEnd();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, isPaused]);

    // Stop when text changes
    useEffect(() => {
        stop();
    }, [text]);

    const speak = () => {
        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            return;
        }

        if (isPlaying) return;

        window.speechSynthesis.cancel(); // clear queue
        const utterance = new SpeechSynthesisUtterance(text);

        if (selectedVoiceURI) {
            const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
            if (voice) utterance.voice = voice;
        }

        utterance.rate = speed;
        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
        };
        utterance.onerror = (e) => {
            console.error('TTS Error:', e);
            setIsPlaying(false);
            setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setIsPaused(false);
    };

    const pause = () => {
        if (isPlaying && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <div className="relative flex items-center space-x-2 bg-slate-700/50 p-1.5 rounded-lg border border-slate-600/50 mr-4">

            {!isPlaying || isPaused ? (
                <button onClick={speak} className="p-1.5 bg-teal-500 hover:bg-teal-400 text-slate-900 rounded-md transition-colors" title="Play">
                    <Play size={16} fill="currentColor" />
                </button>
            ) : (
                <button onClick={pause} className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-md transition-colors" title="Pause">
                    <Pause size={16} fill="currentColor" />
                </button>
            )}

            <button onClick={stop} disabled={!isPlaying && !isPaused} className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-slate-600 rounded-md transition-colors disabled:opacity-50" title="Stop">
                <Square size={16} fill="currentColor" />
            </button>

            <div className="h-5 w-px bg-slate-600 mx-1"></div>

            <button onClick={() => setShowSettings(!showSettings)} className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-slate-600 text-teal-400' : 'text-slate-300 hover:text-teal-400 hover:bg-slate-600'}`} title="Voice Settings">
                <Settings2 size={16} />
            </button>

            {/* TTS Settings Popover */}
            {showSettings && (
                <div className="absolute top-12 right-0 bg-slate-800 border border-slate-600 shadow-xl rounded-lg p-4 w-64 z-50">
                    <h4 className="text-sm font-semibold mb-3 text-slate-200">Voice Settings</h4>

                    <div className="mb-4">
                        <label className="block text-xs font-medium text-slate-400 mb-1">Speed: {speed}x</label>
                        <input
                            type="range" min="0.5" max="2" step="0.1"
                            value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                            className="w-full accent-teal-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Voice</label>
                        <select
                            value={selectedVoiceURI}
                            onChange={(e) => setSelectedVoiceURI(e.target.value)}
                            className="w-full text-sm bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        >
                            {voices.map(v => (
                                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
