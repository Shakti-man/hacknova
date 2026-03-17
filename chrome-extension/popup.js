document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const inputText = document.getElementById('inputText');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const modeSelect = document.getElementById('modeSelect');
    const fontToggle = document.getElementById('fontToggle');
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeVal = document.getElementById('sizeVal');
    const resultWrapper = document.getElementById('result-wrapper');
    const resultContent = document.getElementById('result-content');
    const btnText = document.getElementById('btnText');
    const loader = document.getElementById('loader');
    const copyBtn = document.getElementById('copyBtn');
    const ttsBtn = document.getElementById('ttsBtn');
    const clearBtn = document.getElementById('clearBtn');
    const errorMsg = document.getElementById('error-msg');
    const logo = document.querySelector('.logo');

    // Open Landing Page on logo click
    logo.addEventListener('click', () => {
        chrome.tabs.create({ url: 'http://localhost:5173' });
    });

    // Auto-scan page text on popup open
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_SELECTED_TEXT" }, (selResponse) => {
                if (selResponse && selResponse.text && selResponse.text.trim()) {
                    inputText.value = selResponse.text;
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PAGE_TEXT" }, (pageResponse) => {
                        if (pageResponse && pageResponse.text) {
                            inputText.value = pageResponse.text.substring(0, 1000); // Sample first 1000 chars
                        }
                    });
                }
            });
        }
    });

    // Font Size Slider
    sizeSlider.addEventListener('input', (e) => {
        const size = e.target.value;
        sizeVal.textContent = size + 'px';
        resultContent.style.fontSize = size + 'px';
    });

    // Font Toggle Handler
    fontToggle.addEventListener('change', () => {
        if (fontToggle.checked) {
            resultContent.classList.add('font-lexy');
        } else {
            resultContent.classList.remove('font-lexy');
        }
    });

    // Simplify Action
    simplifyBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return;

        // UI State: Loading
        simplifyBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'block';
        resultWrapper.style.display = 'none';
        errorMsg.style.display = 'none';

        chrome.runtime.sendMessage({ 
            action: "FETCH_SIMPLIFY", 
            text: text, 
            mode: modeSelect.value 
        }, (response) => {
            if (response && response.success) {
                const data = response.data;
                resultContent.textContent = data.result;
                resultWrapper.style.display = 'block';
                
                // Set initial styles
                resultContent.style.fontSize = sizeSlider.value + 'px';
                if (fontToggle.checked) {
                    resultContent.classList.add('font-lexy');
                }
            } else {
                errorMsg.textContent = response ? response.error : 'Network Error: Make sure backend server is running.';
                errorMsg.style.display = 'block';
            }
            
            // UI State: Done
            simplifyBtn.disabled = false;
            btnText.style.display = 'block';
            loader.style.display = 'none';
        });
    });

    // Extra Actions
    clearBtn.addEventListener('click', () => {
        resultWrapper.style.display = 'none';
        inputText.value = '';
    });

    copyBtn.addEventListener('click', () => {
        const text = resultContent.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            setTimeout(() => copyBtn.innerHTML = originalIcon, 2000);
        });
    });

    ttsBtn.addEventListener('click', () => {
        const text = resultContent.textContent;
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.85; // Slower for comprehension
            window.speechSynthesis.speak(utterance);
            
            // Highlight button while speaking
            ttsBtn.style.color = '#14b8a6';
            utterance.onend = () => ttsBtn.style.color = '#64748b';
        } else {
            alert("TTS not supported in this browser.");
        }
    });
});
