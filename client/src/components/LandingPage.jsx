import { BookOpen, Check, Headphones, Type, Layers, Star, Settings, Brain } from 'lucide-react';

export default function LandingPage({ onStart }) {

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#333333] font-lexy overflow-hidden relative selection:bg-[#E2F1E7]">
            {/* Soft background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0" 
                 style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            {/* Navigation */}
            <nav className="z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm bg-[#FDFBF7]/80 sticky top-0 border-b border-[#E2E8F0]/50 shadow-xs">
                <div 
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={(e) => scrollToSection(e, 'hero')}
                >
                    <div className="w-8 h-8 bg-[#4A90E2] rounded-md flex items-center justify-center text-white font-bold">
                        <Layers size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-wide">Lexify</span>
                </div>
                <div className="hidden md:flex items-center space-x-8 text-[17px] font-medium text-[#555555]">
                    <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-[#4A90E2] transition-colors">Features</a>
                    <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-[#4A90E2] transition-colors">How it works</a>
                    {/* <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} className="hover:text-[#4A90E2] transition-colors">Resources</a> */}
                    <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="hover:text-[#4A90E2] transition-colors">About</a>
                </div>
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={onStart}
                        className="px-6 py-2.5 bg-white border-2 border-[#E2E8F0] shadow-sm rounded-xl text-[17px] font-medium hover:border-[#4A90E2] hover:text-[#4A90E2] transition-all">
                        Try Lexify
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">

    {/* Background Gradient */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#FDFBF7] to-[#F5F7FA] -z-10"></div>

    {/* Center Icon */}
    <div className="mb-10 p-5 bg-white shadow-md rounded-2xl border border-gray-200">
        <div className="grid grid-cols-2 gap-2">
            <div className="w-4 h-4 rounded-full bg-[#4A90E2]"></div>
            <div className="w-4 h-4 rounded-full bg-[#333]"></div>
            <div className="w-4 h-4 rounded-full bg-[#333]"></div>
            <div className="w-4 h-4 rounded-full bg-[#333]"></div>
        </div>
    </div>

    {/* Heading */}
    <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#1E293B] max-w-4xl">
        Read, understand, and learn
        <br />
        <span className="text-[#94A3B8] font-medium">
            all in one place
        </span>
    </h1>

    {/* Subtext */}
    <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
        Effortlessly simplify complex texts, adjust reading settings,
        and boost your reading confidence.
    </p>

    {/* CTA */}
    <button
        onClick={onStart}
        className="mt-10 px-8 py-4 bg-[#4A90E2] hover:bg-[#357ABD] transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl active:scale-95"
    >
        Start Reading Free
    </button>

    {/* LEFT FLOATING CARD */}
    <div className="absolute top-24 left-6 hidden lg:block animate-[float_6s_ease-in-out_infinite]">
        <div className="bg-[#FFF8CC] p-5 rounded-xl shadow-md w-64 border border-[#FBE58D]">
            <p className="text-[#5A4C08] text-sm leading-relaxed">
                Easily adjust font size, spacing, and use dyslexia-friendly text.
            </p>
        </div>

        <div className="absolute -bottom-5 -left-5 bg-white p-3 rounded-xl shadow-md border">
            <div className="w-8 h-8 bg-[#4A90E2] rounded-lg flex items-center justify-center text-white">
                <Check size={18} />
            </div>
        </div>
    </div>

    {/* RIGHT FLOATING CARD */}
    <div className="absolute top-32 right-6 hidden lg:block animate-[float_7s_ease-in-out_infinite]">
        <div className="bg-white p-4 rounded-xl shadow-md w-60 border">
            <div className="flex items-center gap-2 mb-2">
                <Headphones size={18} className="text-[#4A90E2]" />
                <span className="font-semibold text-sm">Read Aloud</span>
            </div>
            <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/6"></div>
            </div>
        </div>
    </div>

    {/* BOTTOM CARD */}
    <div className="absolute bottom-10 hidden xl:block animate-[float_8s_ease-in-out_infinite]">
        <div className="bg-white p-5 rounded-xl shadow-md w-72 border">
            <h3 className="font-semibold mb-3 text-gray-700 text-sm">
                Simplification Levels
            </h3>

            <div className="space-y-3 text-xs">
                <div>
                    <div className="flex justify-between mb-1">
                        <span>Original</span>
                        <span className="text-red-500">Advanced</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div className="w-[80%] h-full bg-red-400 rounded-full"></div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <span>Simplified</span>
                        <span className="text-green-500">Easy</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                        <div className="w-full h-full bg-green-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</main>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white relative z-20 border-t border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#1E293B] mb-4">Powerful Features for Easier Reading</h2>
                        <p className="text-xl text-[#555555] max-w-2xl mx-auto">Tools built intentionally to support diverse learning and reading needs.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-[#FDFBF7] border border-[#E2E8F0] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center mb-6">
                                <BookOpen className="text-[#4A90E2]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">AI Simplification</h3>
                            <p className="text-[#555555] leading-relaxed">
                                Transform complex jargon, dense paragraphs, and tricky vocabulary into plain English with a single click.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#FDFBF7] border border-[#E2E8F0] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center mb-6">
                                <Settings className="text-[#4A90E2]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">Customizable UI</h3>
                            <p className="text-[#555555] leading-relaxed">
                                Toggle OpenDyslexic terminology, adjust font sizes, line heights, and letter spacing easily to make text readable.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#FDFBF7] border border-[#E2E8F0] hover:shadow-lg transition-shadow">
                            <div className="w-14 h-14 bg-[#4A90E2]/10 rounded-xl flex items-center justify-center mb-6">
                                <Headphones className="text-[#4A90E2]" size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">Read Aloud</h3>
                            <p className="text-[#555555] leading-relaxed">
                                Auditory support built right in. Highlight text and have our natural voices read it out loud for you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works Section */}
            <section id="how-it-works" className="py-24 bg-[#F8FAFC] relative z-20">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-4xl font-bold text-center mb-16 text-[#1E293B]">How Lexify Works</h2>
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-8">
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-md">1</div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">Import Text</h3>
                            <p className="text-[#555555]">Simply paste text, upload a PDF document, or insert a link to an article you wish to read.</p>
                        </div>
                        <div className="hidden md:block w-16 border-t-2 border-dashed border-[#CBD5E1]"></div>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white border-2 border-[#4A90E2] text-[#4A90E2] rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-md">2</div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">Lexify It</h3>
                            <p className="text-[#555555]">Our AI engine automatically summarizes, clarifies, and reformats the text for clarity.</p>
                        </div>
                        <div className="hidden md:block w-16 border-t-2 border-dashed border-[#CBD5E1]"></div>
                        <div className="flex-1 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-[#4A90E2] border-2 border-[#4A90E2] text-white rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-md">3</div>
                            <h3 className="text-xl font-bold mb-3 text-[#333333]">Learn & Read</h3>
                            <p className="text-[#555555]">Enjoy the distraction-free reader interface, listen to the audio, and comprehend fearlessly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Resources Section */}
            {/* <section id="resources" className="py-24 bg-white relative z-20">
                <div className="max-w-4xl mx-auto px-8 text-center bg-[#FFF8CC]/30 p-12 rounded-3xl border border-[#F6EEB4]">
                    <Star className="text-[#F5A623] mx-auto mb-6" size={48} />
                    <h2 className="text-3xl font-bold mb-6 text-[#1E293B]">Dyslexia Resources</h2>
                    <p className="text-lg text-[#555555] mb-8 leading-relaxed">
                        Lexify is meant to be a companion tool, but understanding Dyslexia is highly valuable. Discover professional strategies, diagnostic guidelines, and community support networks to tackle daily reading challenges.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="https://dyslexiaida.org/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white border border-[#E2E8F0] shadow-sm text-[#333333] font-bold rounded-xl hover:border-[#4A90E2] transition-colors">
                            IDA Knowledge Base
                        </a>
                        <a href="https://www.understood.org/" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white border border-[#E2E8F0] shadow-sm text-[#333333] font-bold rounded-xl hover:border-[#4A90E2] transition-colors">
                            Understood.org Support
                        </a>
                    </div>
                </div>
            </section> */}

            {/* About Section */}
            <section id="about" className="py-24 bg-[#FDFBF7] relative z-20 border-t border-[#E2E8F0]">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <div className="w-16 h-16 bg-[#4A90E2]/10 rounded-2xl flex items-center justify-center text-[#4A90E2] font-bold mx-auto mb-6">
                        <Brain size={32} />
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-[#1E293B]">About Lexify</h2>
                    <p className="text-lg text-[#555555] mb-8 leading-relaxed max-w-3xl mx-auto">
                        Lexify was created with a single mission: to make reading on the web accessible for everyone. 
                        We believe that complex language and poorly formatted text shouldn't be a barrier to learning. By bringing together advanced AI with carefully tailored UI modifications, 
                        we aim to bridge the gap and provide an empowering reading environment for individuals that struggle with reading comprehension or Dyslexia.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-white border-t border-[#E2E8F0] mt-auto">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between text-[#888888] text-sm">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <Layers size={16} />
                        <span className="font-bold text-[#555555]">Lexify Reader</span>
                    </div>
                    <p>© {new Date().getFullYear()} Lexify. Built for Accessibility. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
