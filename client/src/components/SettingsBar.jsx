import { Settings, Type, AlignLeft } from 'lucide-react';

export default function SettingsBar({
    useDyslexicFont, setUseDyslexicFont,
    wordSpacing, setWordSpacing,
    lineHeight, setLineHeight,
    fontSize, setFontSize
}) {
    return (
        <div className="bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E2E8F0] py-3 px-6 flex flex-wrap gap-6 items-center shadow-xs">
            <div className="flex items-center space-x-2 text-[#333333]">
                <Settings size={18} />
                <span className="font-medium text-sm">Reading Settings</span>
            </div>

            <div className="h-6 w-px bg-[#E2E8F0] hidden md:block"></div>

            <label className="flex items-center space-x-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={useDyslexicFont}
                    onChange={(e) => setUseDyslexicFont(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#4A90E2] focus:ring-[#4A90E2]/50 bg-[#F1F5F9] w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-lexy text-[#333333]">OpenDyslexic Font</span>
            </label>

            <div className="flex items-center space-x-2">
                <Type size={16} className="text-[#555555]" />
                <span className="text-sm text-[#555555]">Size: {fontSize}px</span>
                <input
                    type="range" min="14" max="28" step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-24 accent-[#4A90E2] cursor-pointer"
                />
            </div>

            <div className="flex items-center space-x-2">
                <AlignLeft size={16} className="text-[#555555]" />
                <span className="text-sm text-[#555555]">Spacing</span>
                <input
                    type="range" min="0" max="3" step="0.5"
                    value={wordSpacing}
                    onChange={(e) => setWordSpacing(Number(e.target.value))}
                    className="w-24 accent-[#4A90E2] cursor-pointer"
                    title={`Word Spacing: ${wordSpacing}rem`}
                />
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm text-[#555555] leading-none" style={{ lineHeight: 1 }}>↕</span>
                <span className="text-sm text-[#555555]">Lines</span>
                <input
                    type="range" min="1.5" max="3" step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-24 accent-[#4A90E2] cursor-pointer"
                    title={`Line Height: ${lineHeight}`}
                />
            </div>
        </div>
    );
}
