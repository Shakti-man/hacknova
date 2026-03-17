export default function ReadabilityBadge({ before, after }) {
    if (before === null || after === null) return null;

    const getColor = (score) => {
        if (score > 12) return 'bg-red-500/20 text-red-400 border border-red-500/50';
        if (score >= 8) return 'bg-orange-500/20 text-orange-400 border border-orange-500/50';
        return 'bg-green-500/20 text-green-400 border border-green-500/50';
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex flex-col text-xs font-semibold text-slate-400">
                <span>Readability</span>
                <span>Grade Level</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getColor(before)}`}>
                Before: {before}
            </div>
            <div className="text-slate-500">→</div>
            <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${getColor(after)} animate-fade-in`}>
                After: {after}
            </div>
        </div>
    );
}
