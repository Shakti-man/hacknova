import { useState, useRef } from 'react';
import { Type, Upload, Link as LinkIcon, Download, Loader2, ArrowRight } from 'lucide-react';
import Tesseract from 'tesseract.js';

export default function InputPanel({ inputText, setInputText, onSimplify, loading }) {
    const [activeTab, setActiveTab] = useState('text'); // text, upload, url
    const [extracting, setExtracting] = useState(false);
    const [urlInput, setUrlInput] = useState('');
    const [fileName, setFileName] = useState('');

    const fetchUrl = async () => {
        if (!urlInput.trim()) return;
        setExtracting(true);
        try {
            const resp = await fetch(`/api/fetch-url?url=${encodeURIComponent(urlInput)}`);
            const data = await resp.json();
            if (!resp.ok) throw new Error(data.error);
            setInputText(data.text);
            setActiveTab('text');
        } catch (err) {
            alert(`Error fetching URL: ${err.message}`);
        } finally {
            setExtracting(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setFileName(file.name);
        setExtracting(true);
        try {
            if (file.type === 'application/pdf') {
                const formData = new FormData();
                formData.append('file', file);
                const resp = await fetch('/api/parse-pdf', {
                    method: 'POST',
                    body: formData
                });
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error);
                setInputText(data.text);
                setActiveTab('text');
            } else if (file.type.startsWith('image/')) {
                const result = await Tesseract.recognize(file, 'eng');
                setInputText(result.data.text);
                setActiveTab('text');
            } else {
                alert('Unsupported file type. Please upload PDF or images.');
            }
        } catch (err) {
            alert(`Extraction failed: ${err.message}`);
        } finally {
            setExtracting(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    };

    return (
        <div className="flex flex-col flex-1 bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-700">

            {/* Tabs */}
            <div className="flex bg-slate-800 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'text' ? 'bg-slate-700 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'}`}
                >
                    <Type size={18} /> <span>Paste Text</span>
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'upload' ? 'bg-slate-700 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'}`}
                >
                    <Upload size={18} /> <span>Upload File</span>
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'url' ? 'bg-slate-700 text-teal-400 border-b-2 border-teal-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'}`}
                >
                    <LinkIcon size={18} /> <span>Enter URL</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex flex-col relative">
                {extracting && (
                    <div className="absolute inset-0 bg-slate-900/80 z-10 flex flex-col items-center justify-center rounded-b-2xl">
                        <Loader2 size={48} className="animate-spin text-teal-500 mb-4" />
                        <p className="text-teal-400 font-medium tracking-wide animate-pulse">Extracting text...</p>
                    </div>
                )}

                {activeTab === 'text' && (
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste or type any complex text here..."
                        className="w-full flex-1 p-4 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-full"
                    />
                )}

                {activeTab === 'upload' && (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-600 rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer group p-8 text-center"
                        onClick={() => document.getElementById('fileUpload').click()}
                    >
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf, image/png, image/jpeg, image/jpg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                        <Download size={48} className="text-slate-500 group-hover:text-teal-400 transition-colors mb-4" />
                        <h3 className="text-lg font-medium text-slate-300 mb-2">Drag & Drop file here</h3>
                        <p className="text-sm text-slate-500">Supports PDF, PNG, JPG</p>
                        {fileName && <p className="mt-4 text-teal-400 font-medium">Selected: {fileName}</p>}
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Webpage URL</label>
                            <div className="flex space-x-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/article"
                                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && fetchUrl()}
                                />
                                <button
                                    onClick={fetchUrl}
                                    disabled={!urlInput.trim() || extracting}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg disabled:opacity-50 transition-colors"
                                >
                                    Extract
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 text-center">We will extract the main article text, ignoring menus and ads.</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={onSimplify}
                    disabled={loading || !inputText.trim() || activeTab !== 'text'}
                    className="mt-6 w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-slate-700 disabled:to-slate-700 rounded-xl text-white font-bold text-lg flex items-center justify-center shadow-lg transition-all transform active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-3" size={24} />
                            Processing...
                        </>
                    ) : (
                        <>
                            Simplify Text
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={24} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
