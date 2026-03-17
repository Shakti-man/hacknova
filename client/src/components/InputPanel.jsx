import { useState } from 'react';
import { Type, Upload, Link as LinkIcon, Download, Loader2, ArrowRight } from 'lucide-react';
import LoadingPage from './LoadingPage';

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
            let data;
            try {
                data = await resp.json();
            } catch (e) {
                throw new Error('Server returned an invalid response. Ensure the backend is running.');
            }
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
            const formData = new FormData();
            formData.append('file', file);

            let endpoint = '';
            if (file.type === 'application/pdf') {
                endpoint = '/api/parse-pdf';
            } else if (file.type.startsWith('image/')) {
                endpoint = '/api/ocr-image';
            } else {
                alert('Unsupported file type. Please upload PDF or images.');
                setExtracting(false);
                return;
            }

            const resp = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            let data;
            try {
                data = await resp.json();
            } catch (e) {
                throw new Error('Server returned an invalid response. Ensure the backend is running.');
            }

            if (!resp.ok) throw new Error(data.error);
            setInputText(data.text);
            setActiveTab('text');
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
        <div className="flex flex-col flex-1 bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">

            {/* Tabs */}
            <div className="flex bg-white border-b border-[#E2E8F0]">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'text' ? 'bg-[#F8FAFC] text-[#4A90E2] border-b-2 border-[#4A90E2]' : 'text-[#555555] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
                >
                    <Type size={18} /> <span>Paste Text</span>
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'upload' ? 'bg-[#F8FAFC] text-[#4A90E2] border-b-2 border-[#4A90E2]' : 'text-[#555555] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
                >
                    <Upload size={18} /> <span>Upload File</span>
                </button>
                <button
                    onClick={() => setActiveTab('url')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${activeTab === 'url' ? 'bg-[#F8FAFC] text-[#4A90E2] border-b-2 border-[#4A90E2]' : 'text-[#555555] hover:text-[#333333] hover:bg-[#F8FAFC]'}`}
                >
                    <LinkIcon size={18} /> <span>Enter URL</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex flex-col relative">
                {extracting && <LoadingPage message="Extracting text..." />}

                {activeTab === 'text' && (
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Paste or type any complex text here..."
                        className="w-full flex-1 p-4 bg-[#FDFBF7] border border-[#E2E8F0] rounded-xl text-[#333333] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent resize-none h-full"
                    />
                )}

                {activeTab === 'upload' && (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={onDrop}
                        className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[#CBD5E1] rounded-xl bg-[#FDFBF7] hover:bg-[#F8FAFC] transition-colors cursor-pointer group p-8 text-center"
                        onClick={() => document.getElementById('fileUpload').click()}
                    >
                        <input
                            id="fileUpload"
                            type="file"
                            accept=".pdf, image/png, image/jpeg, image/jpg"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files[0])}
                        />
                        <Download size={48} className="text-[#888888] group-hover:text-[#4A90E2] transition-colors mb-4" />
                        <h3 className="text-lg font-medium text-[#333333] mb-2">Drag & Drop file here</h3>
                        <p className="text-sm text-[#555555]">Supports PDF, PNG, JPG</p>
                        {fileName && <p className="mt-4 text-[#4A90E2] font-medium">Selected: {fileName}</p>}
                    </div>
                )}

                {activeTab === 'url' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="w-full max-w-md">
                            <label className="block text-sm font-medium text-[#555555] mb-2">Webpage URL</label>
                            <div className="flex space-x-2">
                                <input
                                    type="url"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    placeholder="https://example.com/article"
                                    className="flex-1 px-4 py-3 bg-[#FDFBF7] border border-[#E2E8F0] rounded-lg text-[#333333] placeholder-[#888888] focus:ring-2 focus:ring-[#4A90E2] focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && fetchUrl()}
                                />
                                <button
                                    onClick={fetchUrl}
                                    disabled={!urlInput.trim() || extracting}
                                    className="px-6 py-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#333333] font-medium rounded-lg disabled:opacity-50 transition-colors"
                                >
                                    Extract
                                </button>
                            </div>
                            <p className="text-xs text-[#888888] mt-4 text-center">We will extract the main article text, ignoring menus and ads.</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={onSimplify}
                    disabled={loading || !inputText.trim() || activeTab !== 'text'}
                    className="mt-6 w-full py-4 bg-linear-to-r from-[#4A90E2] to-[#357ABD] hover:from-[#3a7ac4] hover:to-[#2c659e] disabled:from-[#E2E8F0] disabled:to-[#E2E8F0] disabled:text-[#888888] rounded-xl text-white font-bold text-lg flex items-center justify-center shadow-md transition-all transform active:scale-[0.98] disabled:active:scale-100 disabled:cursor-not-allowed group"
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
