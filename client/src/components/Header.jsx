import { Brain, Maximize2 } from 'lucide-react';

export default function Header({ onToggleFocus, onGoHome }) {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6 z-50 shadow-sm shadow-black/5">
            <div 
                className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={onGoHome}
            >
                <div className="w-10 h-10 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg flex items-center justify-center">
                    <Brain size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-[#333333] m-0">Lexify</h1>
                    <p className="text-xs text-[#555555] m-0">Simplifying Words. Empowering Readers.</p>
                </div>
            </div>

            <button 
                onClick={onToggleFocus}
                className="flex items-center space-x-2 px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#555555] font-medium transition-all group"
            >
                <Maximize2 size={18} className="group-hover:text-[#4A90E2]" />
                <span>Focus Mode</span>
            </button>
        </header>
    );
}
