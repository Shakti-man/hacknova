import { useState } from 'react';
import { Copy, Download, MessageSquare, List, Sparkles } from 'lucide-react';
import ReadabilityBadge from './ReadabilityBadge';
import TTSControls from './TTSControls';

export default function OutputPanel({
    currentResult, loading, mode, onModeChange,
    readabilityBefore, readabilityAfter,
    useDyslexicFont, wordSpacing, lineHeight, fontSize
}) {
    const [copied, setCopied] = useState(false);

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

    return (
        <div className="flex flex-col flex-1 bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700 relative h-full">
            {/* Tabs */}
            <div className="flex bg-slate-800 border-b border-slate-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onModeChange(tab.id)}
                        className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${mode === tab.id
                                ? 'bg-slate-700 text-cyan-400 border-b-2 border-cyan-400'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                            }`}
                    >
                        {tab.icon} <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="px-6 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                <ReadabilityBadge before={readabilityBefore} after={readabilityAfter} />

                <div className="flex space-x-2">
                    {currentResult && <TTSControls text={currentResult} />}
                    <button
                        onClick={handleCopy}
                        disabled={!currentResult}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        title="Copy to clipboard"
                    >
                        <Copy size={20} className={copied ? "text-green-400" : ""} />
                        {copied && <span className="absolute mt-8 -ml-4 text-xs text-green-400 font-bold animate-fade-in">Copied!</span>}
                    </button>
                    <button
                        onClick={handleDownload}
                        disabled={!currentResult}
                        className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        title="Download .txt"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto relative">
                {loading ? (
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded"></div>
                        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-700 rounded"></div>
                    </div>
                ) : currentResult ? (
                    <div
                        className={`whitespace-pre-wrap animate-fade-in text-slate-100 ${useDyslexicFont ? 'font-lexy' : 'font-sans'}`}
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: lineHeight,
                            wordSpacing: `${wordSpacing}rem`
                        }}
                    >
                        {currentResult}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-500 font-medium">
                        Your simplified text will appear here...
                    </div>
                )}
            </div>
        </div>
    );
}
