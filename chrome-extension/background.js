chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "simplifyWithLexify",
        title: "Simplify with Lexify",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "simplifyWithLexify") {
        // Inject logic to simplify selected text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (selectedText) => {
                // Simple overlay creation similar to SIMPLIFY_PAGE but specifically for selected text
                fetch("http://localhost:5000/api/simplify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: selectedText, mode: "simplified" })
                })
                    .then(r => r.json())
                    .then(data => {
                        if (data.error) throw new Error(data.error);

                        const overlay = document.createElement("div");
                        overlay.style.position = "fixed";
                        overlay.style.top = "10%";
                        overlay.style.left = "50%";
                        overlay.style.transform = "translate(-50%, 0)";
                        overlay.style.width = "400px";
                        overlay.style.maxHeight = "50vh";
                        overlay.style.overflowY = "auto";
                        overlay.style.backgroundColor = "#0f172a";
                        overlay.style.color = "#f1f5f9";
                        overlay.style.padding = "20px";
                        overlay.style.borderRadius = "12px";
                        overlay.style.zIndex = "999999";
                        overlay.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.5)";
                        overlay.style.border = "1px solid #334155";

                        // Apply font
                        const fontUrl = "https://fonts.cdnfonts.com/css/opendyslexic";
                        if (!document.querySelector(`link[href="${fontUrl}"]`)) {
                            const link = document.createElement("link");
                            link.href = fontUrl;
                            link.rel = "stylesheet";
                            document.head.appendChild(link);
                        }
                        overlay.style.fontFamily = "'OpenDyslexic', sans-serif";
                        overlay.style.fontSize = "16px";
                        overlay.style.lineHeight = "1.5";

                        const closeBtn = document.createElement("button");
                        closeBtn.innerText = "×";
                        closeBtn.style.position = "absolute";
                        closeBtn.style.top = "10px";
                        closeBtn.style.right = "10px";
                        closeBtn.style.background = "transparent";
                        closeBtn.style.color = "#94a3b8";
                        closeBtn.style.border = "none";
                        closeBtn.style.fontSize = "20px";
                        closeBtn.style.cursor = "pointer";
                        closeBtn.onclick = () => overlay.remove();

                        const textNode = document.createElement("div");
                        textNode.innerText = data.result;
                        textNode.style.marginTop = "10px";
                        textNode.style.whiteSpace = "pre-wrap";

                        overlay.appendChild(closeBtn);
                        overlay.appendChild(textNode);
                        document.body.appendChild(overlay);
                    })
                    .catch(err => alert("Lexify Error: " + err.message));
            },
            args: [info.selectionText]
        });
    }
});
