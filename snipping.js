(async function() {
    // Create a semi-transparent overlay
    let overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999";
    overlay.style.cursor = "crosshair";
    document.body.appendChild(overlay);

    let startX, startY, endX, endY;
    let rect = document.createElement("div");
    rect.style.position = "absolute";
    rect.style.border = "2px dashed white";
    rect.style.zIndex = "10000";
    overlay.appendChild(rect);

    overlay.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        rect.style.left = startX + "px";
        rect.style.top = startY + "px";
        rect.style.width = "0px";
        rect.style.height = "0px";
    });

    overlay.addEventListener("mousemove", (e) => {
        if (startX === undefined) return;
        endX = e.clientX;
        endY = e.clientY;
        rect.style.width = Math.abs(endX - startX) + "px";
        rect.style.height = Math.abs(endY - startY) + "px";
        rect.style.left = Math.min(startX, endX) + "px";
        rect.style.top = Math.min(startY, endY) + "px";
    });

    overlay.addEventListener("mouseup", async (e) => {
        overlay.remove();
        let selectedArea = {
            x: Math.min(startX, endX),
            y: Math.min(startY, endY),
            width: Math.abs(endX - startX),
            height: Math.abs(endY - startY)
        };
        let screenshot = await captureSelectedArea(selectedArea);
        let extractedText = await extractTextFromImage(screenshot);
        if (extractedText.trim().length > 0) {
            let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(extractedText)}`;
            window.open(searchUrl, "_blank");
        }
    });

    async function captureSelectedArea(area) {
        let stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        let track = stream.getVideoTracks()[0];
        let imageCapture = new ImageCapture(track);
        let bitmap = await imageCapture.grabFrame();
        let canvas = document.createElement("canvas");
        canvas.width = area.width;
        canvas.height = area.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
        track.stop();
        return canvas.toDataURL();
    }

    async function extractTextFromImage(imageUri) {
        const worker = await Tesseract.createWorker();
        await worker.load();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const { data: { text } } = await worker.recognize(imageUri);
        await worker.terminate();
        return text;
    }
})();
