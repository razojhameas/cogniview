let mediaRecorder;
let audioChunks = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start_transcription") {
        captureTabAudio();
    } else if (message.action === "stop_transcription") {
        stopRecording();
    }
});

function captureTabAudio() {
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
        if (chrome.runtime.lastError || !stream) {
            console.error("❌ Failed to capture tab audio:", chrome.runtime.lastError?.message || "Unknown error");
            return;
        }
        startRecording(stream);
    });
}

function startRecording(stream) {
    console.log("🎙️ Recording started");

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        console.log("📢 Recording stopped");
        let audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        await sendToWhisperAPI(audioBlob);
    };

    mediaRecorder.start();
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        console.log("🛑 Stopping transcription...");
    }
}


