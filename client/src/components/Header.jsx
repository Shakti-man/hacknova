import { Brain } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 flex items-center px-6 z-50">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center">
                    <Brain size={24} />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white m-0">Lexify</h1>
                    <p className="text-xs text-slate-400 m-0">Simplifying Words. Empowering Readers.</p>
                </div>
            </div>
        </header>
    );
}
