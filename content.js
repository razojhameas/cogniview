chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "fillGemini") {
        console.log("📝 Filling Gemini input...");

        function tryFillingInput() {
            let inputBox = document.querySelector("textarea");
            let sendButton = document.querySelector("button[aria-label='Submit']");

            if (inputBox && sendButton) {
                inputBox.value = message.text;
                inputBox.dispatchEvent(new Event('input', { bubbles: true }));
                
                setTimeout(() => {
                    console.log("🚀 Clicking submit...");
                    sendButton.click();
                }, 1000);
            } else {
                console.log("⏳ Waiting for Gemini to fully load...");
                setTimeout(tryFillingInput, 1000);
            }
        }

        tryFillingInput();
    }
});
