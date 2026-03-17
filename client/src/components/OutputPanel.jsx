import { useState, useRef, useEffect } from 'react';
import { Copy, Download, MessageSquare, List, Sparkles, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import ReadabilityBadge from './ReadabilityBadge';
import TTSControls from './TTSControls';

export default function OutputPanel({
    currentResult, loading, mode, onModeChange,
    readabilityBefore, readabilityAfter,
    useDyslexicFont, wordSpacing, lineHeight, fontSize,
    glossary = [], focusMode, onToggleFocus
}) {
    const [copied, setCopied] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

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

    const getSentences = (text) => {
        if (!text) return [];
        const allSentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const segments = [];
        for (let i = 0; i < allSentences.length; i += 2) {
            segments.push(allSentences.slice(i, i + 2).join(' ').trim());
        }
        return segments;
    };

    const sentences = getSentences(currentResult);

    useEffect(() => {
        setCurrentCardIndex(0);
    }, [currentResult]);

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
                            >
                                {subPart}
                                {/* TOOLTIP SYSTEM - FIXED OVERFLOW AND CLIPPING */}
                                <span className={`
                                    absolute bottom-full mb-3 px-4 py-3 bg-[#1E293B] text-white text-sm rounded-xl 
                                    opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-[999] 
                                    w-64 shadow-2xl text-center leading-relaxed transform translate-y-1 group-hover:translate-y-0
                                    left-1/2 -translate-x-1/2
                                `}>
                                    <span className="font-bold block mb-1 text-[#14B8A6] uppercase tracking-wider text-[10px]">{word}</span>
                                    {definition}
                                    {/* Arrow */}
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1E293B]"></span>
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
        <div className={`flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] relative transition-all duration-500 ${focusMode ? 'h-full shadow-2xl border-[#4A90E2]/30' : 'h-full'}`}>
            {/* Tabs */}
            {!focusMode && (
                <div className="flex bg-white border-b border-[#E2E8F0] rounded-t-2xl">
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
            <div className={`px-6 py-3 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50 ${focusMode ? 'py-4 rounded-t-2xl' : ''}`}>
                <ReadabilityBadge before={readabilityBefore} after={readabilityAfter} />

                <div className="flex space-x-2">
                    {currentResult && <TTSControls text={focusMode ? sentences[currentCardIndex] : currentResult} />}
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

            {/* Content Area - REMOVED OVERFLOW-HIDDEN FROM PARENT TO FIX TOOLTIP CLIPPING */}
            <div className={`flex-1 overflow-y-auto relative transition-all duration-500 ${focusMode ? 'flex items-center justify-center' : 'p-10 bg-[#FDFBF7]'}`}>
                {loading ? (
                    <div className="p-8 w-full animate-pulse space-y-4">
                        <div className="h-4 bg-[#E2E8F0] rounded w-3/4"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded w-5/6"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded w-1/2"></div>
                        <div className="h-4 bg-[#E2E8F0] rounded"></div>
                    </div>
                ) : currentResult ? (
                    focusMode ? (
                        <div className="w-full max-w-2xl px-8 flex flex-col items-center">
                            <div className="min-h-[250px] flex items-center justify-center text-center p-12 bg-white border border-[#E2E8F0] rounded-[40px] shadow-2xl animate-scale-in">
                                <div
                                    className={`text-[#1E293B] leading-relaxed transition-all duration-300 ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                                    style={{
                                        fontSize: `${fontSize + 12}px`,
                                        wordSpacing: `${wordSpacing + 0.2}rem`
                                    }}
                                >
                                    {renderComplexText(sentences[currentCardIndex])}
                                </div>
                            </div>
                            
                            <div className="mt-12 flex items-center space-x-8">
                                <button 
                                    onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentCardIndex === 0}
                                    className="p-4 bg-white border border-[#E2E8F0] rounded-full shadow-lg hover:bg-[#F8FAFC] hover:text-[#4A90E2] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                
                                <div className="text-[#94A3B8] font-bold tracking-widest text-sm">
                                    {currentCardIndex + 1} <span className="opacity-40">/</span> {sentences.length}
                                </div>

                                <button 
                                    onClick={() => setCurrentCardIndex(prev => Math.min(sentences.length - 1, prev + 1))}
                                    disabled={currentCardIndex === sentences.length - 1}
                                    className="p-4 bg-white border border-[#E2E8F0] rounded-full shadow-lg hover:bg-[#F8FAFC] hover:text-[#4A90E2] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`whitespace-pre-wrap animate-fade-in text-[#333333] selection:bg-[#E2F1E7] relative ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                            style={{
                                fontSize: `${fontSize}px`,
                                lineHeight: lineHeight,
                                wordSpacing: `${wordSpacing}rem`
                            }}
                        >
                            {renderComplexText(currentResult)}
                        </div>
                    )
                ) : (
                    <div className="h-full flex items-center justify-center text-[#888888] font-medium italic">
                        Your simplified text will appear here...
                    </div>
                )}
            </div>
            
            {focusMode && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 bg-[#F1F5F9] px-3 py-1 rounded-full">
                    Focus Cards Active
                </div>
            )}
        </div>
    );
}
