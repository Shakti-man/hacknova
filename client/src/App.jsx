import { useState } from 'react';
import Header from './components/Header';
import SettingsBar from './components/SettingsBar';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { Loader2 } from 'lucide-react';

function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('simplified'); // simplified, bullets, plain

  // Output and stats
  const [outputCache, setOutputCache] = useState({}); // { [inputTextHash_mode]: { result, readabilityBefore, readabilityAfter } }
  const [currentResult, setCurrentResult] = useState(null);
  const [readabilityBefore, setReadabilityBefore] = useState(null);
  const [readabilityAfter, setReadabilityAfter] = useState(null);

  // Styling settings
  const [useDyslexicFont, setUseDyslexicFont] = useState(false);
  const [wordSpacing, setWordSpacing] = useState(0); // rem
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontSize, setFontSize] = useState(18); // px

  const handleSimplify = async (textToProcess = inputText, targetMode = mode) => {
    if (!textToProcess.trim()) {
      setError('Please provide some text to simplify.');
      return;
    }

    setLoading(true);
    setError(null);
    setInputText(textToProcess);
    setMode(targetMode);

    // Simple cache key based on length + first 20 chars + last 20 chars + mode
    const textHash = textToProcess.length + '_' + textToProcess.substring(0, 20) + textToProcess.substring(textToProcess.length - 20);
    const cacheKey = `${textHash}_${targetMode}`;

    if (outputCache[cacheKey]) {
      const cached = outputCache[cacheKey];
      setCurrentResult(cached.result);
      setReadabilityBefore(cached.readabilityBefore);
      setReadabilityAfter(cached.readabilityAfter);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToProcess, mode: targetMode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to simplify text.');
      }

      setCurrentResult(data.result);
      setReadabilityBefore(data.readabilityBefore);
      setReadabilityAfter(data.readabilityAfter);

      // Save to cache
      setOutputCache(prev => ({
        ...prev,
        [cacheKey]: {
          result: data.result,
          readabilityBefore: data.readabilityBefore,
          readabilityAfter: data.readabilityAfter
        }
      }));

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    if (newMode === mode) return;
    if (inputText.trim() && currentResult) {
      handleSimplify(inputText, newMode);
    } else {
      setMode(newMode);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <Header />
      <SettingsBar
        useDyslexicFont={useDyslexicFont} setUseDyslexicFont={setUseDyslexicFont}
        wordSpacing={wordSpacing} setWordSpacing={setWordSpacing}
        lineHeight={lineHeight} setLineHeight={setLineHeight}
        fontSize={fontSize} setFontSize={setFontSize}
      />

      <main className="flex-1 container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col h-[700px]">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Input</h2>
          <InputPanel
            inputText={inputText}
            setInputText={setInputText}
            onSimplify={() => handleSimplify(inputText, mode)}
            loading={loading}
          />
        </div>

        <div className="flex flex-col h-[700px]">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">Output</h2>
          <OutputPanel
            currentResult={currentResult}
            loading={loading}
            mode={mode}
            onModeChange={handleModeChange}
            readabilityBefore={readabilityBefore}
            readabilityAfter={readabilityAfter}
            useDyslexicFont={useDyslexicFont}
            wordSpacing={wordSpacing}
            lineHeight={lineHeight}
            fontSize={fontSize}
          />
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center shadow-red-500/20">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 font-bold hover:text-red-200">×</button>
        </div>
      )}
    </div>
  );
}

export default App;
