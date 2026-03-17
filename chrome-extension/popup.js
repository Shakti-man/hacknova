document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Auto-scan page on open
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            // First try selection
            chrome.tabs.sendMessage(tabs[0].id, { action: "GET_SELECTED_TEXT" }, (selResponse) => {
                if (selResponse && selResponse.text && selResponse.text.trim()) {
                    inputText.value = selResponse.text;
                } else {
                    // If no selection, get all page text
                    chrome.tabs.sendMessage(tabs[0].id, { action: "GET_PAGE_TEXT" }, (pageResponse) => {
                        if (pageResponse && pageResponse.text) {
                            // Truncate if too long for preview
                            inputText.value = pageResponse.text.substring(0, 1000);
                        }
                    });
                }
            });
        }
    });

    simplifyBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) return;

        simplifyBtn.disabled = true;
        loading.style.display = 'block';
        resultDiv.style.display = 'none';

        // Send message to background script to perform the fetch
        // This bypasses many CORS/PNA restrictions that apply to popup pages
        chrome.runtime.sendMessage({ 
            action: "FETCH_SIMPLIFY", 
            text: text, 
            mode: 'simplified' 
        }, async (response) => {
            if (response && response.success) {
                const data = response.data;
                resultDiv.textContent = data.result;
                resultDiv.style.display = 'block';
                resultDiv.style.color = '#e2e8f0';

                // Load OpenDyslexic font
                try {
                    const font = new FontFace('OpenDyslexic', 'url(https://fonts.cdnfonts.com/s/16474/OpenDyslexic-Regular.woff)');
                    await font.load();
                    document.fonts.add(font);
                    resultDiv.style.fontFamily = "'OpenDyslexic', sans-serif";
                } catch (e) {
                    console.error("Font load failed", e);
                    resultDiv.style.fontFamily = "sans-serif";
                }
            } else {
                resultDiv.textContent = `Error: ${response ? response.error : 'Network connection failed'}`;
                resultDiv.style.display = 'block';
                resultDiv.style.color = '#ef4444';
            }
            
            simplifyBtn.disabled = false;
            loading.style.display = 'none';
        });
    });
});
