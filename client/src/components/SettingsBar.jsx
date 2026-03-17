import { Settings, Type, AlignLeft } from 'lucide-react';

export default function SettingsBar({
    useDyslexicFont, setUseDyslexicFont,
    wordSpacing, setWordSpacing,
    lineHeight, setLineHeight,
    fontSize, setFontSize
}) {
    return (
        <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 py-3 px-6 flex flex-wrap gap-6 items-center shadow-md">
            <div className="flex items-center space-x-2 text-slate-300">
                <Settings size={18} />
                <span className="font-medium text-sm">Reading Settings</span>
            </div>

            <div className="h-6 w-px bg-slate-600 hidden md:block"></div>

            <label className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={useDyslexicFont}
                    onChange={(e) => setUseDyslexicFont(e.target.checked)}
                    className="rounded border-slate-500 text-teal-500 focus:ring-teal-500/50 bg-slate-700 w-4 h-4"
                />
                <span className="text-sm font-lexy">OpenDyslexic Font</span>
            </label>

            <div className="flex items-center space-x-2">
                <Type size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">Size: {fontSize}px</span>
                <input
                    type="range" min="14" max="28" step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24 accent-teal-500"
                />
            </div>

            <div className="flex items-center space-x-2">
                <AlignLeft size={16} className="text-slate-400" />
                <span className="text-sm text-slate-400">Spacing</span>
                <input
                    type="range" min="0" max="3" step="0.5"
                    value={wordSpacing}
                    onChange={(e) => setWordSpacing(Number(e.target.value))}
                    className="w-24 accent-teal-500"
                    title={`Word Spacing: ${wordSpacing}rem`}
                />
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400 leading-none" style={{ lineHeight: 1 }}>↕</span>
                <span className="text-sm text-slate-400">Lines</span>
                <input
                    type="range" min="1.5" max="3" step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-24 accent-teal-500"
                    title={`Line Height: ${lineHeight}`}
                />
            </div>
        </div>
    );
}
