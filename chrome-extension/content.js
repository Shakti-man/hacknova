chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_SELECTED_TEXT") {
        sendResponse({ text: window.getSelection().toString() });
    }

    if (request.action === "GET_PAGE_TEXT") {
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
        sendResponse({ text: paragraphs.join('\n\n') });
    }

    if (request.action === "SIMPLIFY_PAGE") {
        const paragraphs = Array.from(document.querySelectorAll('p')).map(p => p.textContent);
        const fullText = paragraphs.join('\n\n');

        if (!fullText.trim()) {
            alert("No text found on this page.");
            return;
        }

        // Send to background script for fetch to bypass PNA/CORS blocks on webpage
        chrome.runtime.sendMessage({ 
            action: "FETCH_SIMPLIFY", 
            text: fullText.substring(0, 3000), 
            mode: 'simplified' 
        }, (response) => {
            if (response && response.success) {
                const data = response.data;
                // Create overlay
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '10%';
                overlay.style.left = '50%';
                overlay.style.transform = 'translate(-50%, 0)';
                overlay.style.width = '80%';
                overlay.style.maxHeight = '80vh';
                overlay.style.overflowY = 'auto';
                overlay.style.backgroundColor = '#0f172a';
                overlay.style.color = '#f1f5f9';
                overlay.style.padding = '30px';
                overlay.style.borderRadius = '16px';
                overlay.style.zIndex = '999999';
                overlay.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)';
                overlay.style.border = '1px solid #334155';

                const fontUrl = 'https://fonts.cdnfonts.com/css/opendyslexic';
                const link = document.createElement('link');
                link.href = fontUrl;
                link.rel = 'stylesheet';
                document.head.appendChild(link);

                overlay.style.fontFamily = "'OpenDyslexic', sans-serif";
                overlay.style.fontSize = '18px';
                overlay.style.lineHeight = '2';

                const closeBtn = document.createElement('button');
                closeBtn.innerText = 'Close';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '15px';
                closeBtn.style.right = '15px';
                closeBtn.style.background = '#ef4444';
                closeBtn.style.color = 'white';
                closeBtn.style.border = 'none';
                closeBtn.style.padding = '8px 16px';
                closeBtn.style.borderRadius = '8px';
                closeBtn.style.cursor = 'pointer';
                closeBtn.onclick = () => overlay.remove();

                const textNode = document.createElement('div');
                textNode.innerText = data.result;
                textNode.style.marginTop = '20px';
                textNode.style.whiteSpace = 'pre-wrap';

                overlay.appendChild(closeBtn);
                overlay.appendChild(textNode);
                document.body.appendChild(overlay);
            } else {
                alert("Lexify Error: " + (response ? response.error : "Communication failed"));
            }
        });
    }
});
