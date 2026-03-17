import { useState } from 'react';
import { Copy, Download, MessageSquare, List, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import ReadabilityBadge from './ReadabilityBadge';
import TTSControls from './TTSControls';

export default function OutputPanel({
    currentResult, loading, mode, onModeChange,
    readabilityBefore, readabilityAfter,
    useDyslexicFont, wordSpacing, lineHeight, fontSize,
    glossary = [], focusMode, onToggleFocus
}) {
    const [copied, setCopied] = useState(false);
    const [hoveredWord, setHoveredWord] = useState(null);

    const handleCopy = () => {
        if (!currentResult) return;
        navigator.clipboard.writeText(currentResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!currentResult) return;
        const blob = new Blob([currentResult], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lexify-${mode}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const tabs = [
        { id: 'simplified', icon: <MessageSquare size={16} />, label: 'Simplified' },
        { id: 'bullets', icon: <List size={16} />, label: 'Bullets' },
        { id: 'plain', icon: <Sparkles size={16} />, label: 'Plain' },
    ];

    // Function to render text with glossary highlights
    const renderComplexText = (text) => {
        if (!text || !glossary || glossary.length === 0) return text;

        let parts = [text];
        
        glossary.forEach(({ word, definition }) => {
            const newParts = [];
            const regex = new RegExp(`\\b(${word})\\b`, 'gi');
            
            parts.forEach(part => {
                if (typeof part !== 'string') {
                    newParts.push(part);
                    return;
                }
                
                const split = part.split(regex);
                split.forEach((subPart, i) => {
                    if (subPart.toLowerCase() === word.toLowerCase()) {
                        newParts.push(
                            <span 
                                key={`${word}-${i}`}
                                className="border-b-2 border-dashed border-[#14B8A6] cursor-help relative group inline-block"
                                onMouseEnter={() => setHoveredWord({ word, definition })}
                                onMouseLeave={() => setHoveredWord(null)}
                            >
                                {subPart}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1E293B] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48 shadow-xl text-center leading-normal">
                                    <span className="font-bold block mb-1 text-[#14B8A6] uppercase tracking-wider">{word}</span>
                                    {definition}
                                </span>
                            </span>
                        );
                    } else if (subPart !== '') {
                        newParts.push(subPart);
                    }
                });
            });
            parts = newParts;
        });

        return parts;
    };

    return (
        <div className={`flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden relative transition-all duration-500 ${focusMode ? 'h-full shadow-2xl border-[#4A90E2]/30' : 'h-full'}`}>
            {/* Tabs */}
            {!focusMode && (
                <div className="flex bg-white border-b border-[#E2E8F0]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onModeChange(tab.id)}
                            className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${mode === tab.id
                                    ? 'bg-[#F8FAFC] text-[#4A90E2] border-b-2 border-[#4A90E2]'
                                    : 'text-[#555555] hover:text-[#333333] hover:bg-[#F8FAFC]'
                                }`}
                        >
                            {tab.icon} <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Toolbar */}
            <div className={`px-6 py-3 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50 ${focusMode ? 'py-4' : ''}`}>
                <ReadabilityBadge before={readabilityBefore} after={readabilityAfter} />

                <div className="flex space-x-2">
                    {currentResult && <TTSControls text={currentResult} />}
                    <button
                        onClick={handleCopy}
                        disabled={!currentResult}
                        className="p-2 text-[#555555] hover:text-[#4A90E2] hover:bg-[#F1F5F9] rounded transition-colors disabled:opacity-50"
                        title="Copy to clipboard"
                    >
                        <Copy size={20} className={copied ? "text-green-600" : ""} />
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!currentResult}
                        className="p-2 text-[#555555] hover:text-[#4A90E2] hover:bg-[#F1F5F9] rounded transition-colors disabled:opacity-50"
                        title="Download .txt"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={onToggleFocus}
                        className="p-2 text-[#555555] hover:text-[#4A90E2] hover:bg-[#F1F5F9] rounded transition-colors"
                        title={focusMode ? "Minimize" : "Focus Mode"}
                    >
                        {focusMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 p-8 overflow-y-auto relative transition-all duration-500 ${focusMode ? 'px-12 py-10 max-w-4xl mx-auto w-full' : 'bg-[#FDFBF7]'}`}>
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded w-5/6"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded w-1/2"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded"></div>
                    </div>
                ) : currentResult ? (
                    <div
                        className={`whitespace-pre-wrap animate-fade-in text-[#333333] selection:bg-[#E2F1E7] ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                        style={{
                            fontSize: `${focusMode ? fontSize + 4 : fontSize}px`,
                            lineHeight: focusMode ? lineHeight + 0.2 : lineHeight,
                            wordSpacing: `${wordSpacing}rem`
                        }}
                    >
                        {renderComplexText(currentResult)}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-[#888888] font-medium italic">
                        Your simplified text will appear here...
                    </div>
                )}
            </div>
            
            {/* Focus Mode Badge */}
            {focusMode && (
                <div className="absolute bottom-4 right-8 text-[#94A3B8] text-xs font-bold uppercase tracking-widest opacity-50">
                    Focus Mode Active
                </div>
            )}
        </div>
    );
}
