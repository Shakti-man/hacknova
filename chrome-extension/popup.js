document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const loading = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Try to get selected text from current tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "GET_SELECTED_TEXT" }, (response) => {
            if (response && response.text) {
                inputText.value = response.text;
            }
        });
    });

    simplifyBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) return;

        simplifyBtn.disabled = true;
        loading.style.display = 'block';
        resultDiv.style.display = 'none';

        try {
            const resp = await fetch('http://localhost:5000/api/simplify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, mode: 'simplified' })
            });

            const data = await resp.json();

            if (!resp.ok) throw new Error(data.error);

            resultDiv.textContent = data.result;
            resultDiv.style.display = 'block';

            // Load OpenDyslexic font
            const font = new FontFace('OpenDyslexic', 'url(https://fonts.cdnfonts.com/s/16474/OpenDyslexic-Regular.woff)');
            await font.load();
            document.fonts.add(font);
            resultDiv.style.fontFamily = "'OpenDyslexic', sans-serif";

        } catch (err) {
            resultDiv.textContent = `Error: ${err.message}`;
            resultDiv.style.display = 'block';
            resultDiv.style.color = '#ef4444';
        } finally {
            simplifyBtn.disabled = false;
            loading.style.display = 'none';
        }
    });
});
