document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Popup loaded successfully.");

    // Controversial Topics Dictionary
    const controversialTopics = {
        "climate change": ["scientific studies", "economic impact", "policy debates"],
        "AI ethics": ["privacy concerns", "technological benefits", "government regulations"],
        "vaccines": ["scientific research", "public skepticism", "government mandates"],
        "cryptocurrency": ["financial risks", "decentralization benefits", "regulatory challenges"],
        "social media bias": ["algorithm influence", "free speech", "fact-checking"],
        "TikTok algorithm": ["content personalization", "misinformation risks", "censorship policies"],
        "gun control": ["crime statistics", "self-defense arguments", "government regulations"],
        "abortion": ["women’s rights", "religious views", "medical ethics"],
        "universal healthcare": ["economic feasibility", "social benefits", "taxpayer burden"],
        "minimum wage": ["job market impact", "cost of living", "business sustainability"],
        "nuclear energy": ["environmental risks", "energy efficiency", "disposal concerns"],
        "GMOs": ["food safety", "economic benefits", "agricultural sustainability"],
        "gender identity": ["scientific research", "societal norms", "legal policies"],
        "free speech": ["hate speech limits", "social responsibility", "government control"],
        "media censorship": ["national security", "freedom of expression", "fake news"],
        "religious freedom": ["individual rights", "public policy", "social harmony"],
        "immigration policies": ["economic benefits", "security concerns", "cultural impact"],
        "capital punishment": ["crime deterrence", "human rights", "judicial errors"],
        "police funding": ["crime rates", "community trust", "public safety"],
        "student loan forgiveness": ["economic impact", "fairness to taxpayers", "education accessibility"],
        "space exploration": ["economic costs", "scientific advancements", "earthly priorities"],
        "fast fashion": ["labor exploitation", "environmental impact", "consumer culture"]
    };

    // AI Engine Options
    const aiEngines = {
        "perplexity": "https://www.perplexity.ai/search?q=",
        "gemini": "https://gemini.google.com/search?q=",
        "bingai": "https://www.bing.com/search?q=",
        "openai": "https://chat.openai.com/?q="
    };

    let selectedEngine = "perplexity"; // Default AI engine

    // Update selected AI engine from dropdown
    document.getElementById("aiEngineSelect").addEventListener("change", function () {
        selectedEngine = this.value;
        console.log(`🔄 AI Engine changed to: ${selectedEngine}`);
    });

    function modifyQuery(mode, query) {
        if (!query.trim()) {
            console.warn("⚠️ Empty search query.");
            return null;
        }

        let modifiedQuery = query;

        // Check for controversial topics and add alternative perspectives
        for (let topic in controversialTopics) {
            if (query.toLowerCase().includes(topic)) {
                let perspectives = controversialTopics[topic].join(" OR ");
                modifiedQuery = `${query} OR (${perspectives})`;
                console.log(`🔄 Alternative perspectives added: ${modifiedQuery}`);
                break;
            }
        }

        let searchBaseUrl = aiEngines[selectedEngine] || aiEngines["perplexity"]; // Fallback to Perplexity if something is wrong

        switch (mode) {
            case "summary":
                return `${searchBaseUrl}${encodeURIComponent(
                    `Provide a comprehensive and objective summary of "${modifiedQuery}". Include historical background, key events, controversies, major figures, and modern relevance.`
                )}`;

            case "factcheck":
                return `${searchBaseUrl}${encodeURIComponent(
                    `Fact-check this claim: "${modifiedQuery}". Analyze credibility, provide source verification, and cross-check with reliable news outlets.`
                )}`;

            case "timeline":
                let timelineQuery = `Generate a chronological timeline for "${modifiedQuery}". Include key dates, major events, and historical significance.`;
                navigator.clipboard.writeText(timelineQuery).then(() => {
                    console.log("📋 Copied to clipboard:", timelineQuery);
                }).catch(err => {
                    console.error("❌ Failed to copy text:", err);
                });
                return `${searchBaseUrl}${encodeURIComponent(timelineQuery)}`;

            case "trusted":
                return `${searchBaseUrl}${encodeURIComponent(
                    `Provide analysis of "${modifiedQuery}" using sources from BBC, Reuters, and AP News.`
                )}`;

            case "gov":
                return `${searchBaseUrl}${encodeURIComponent(
                    `Provide research-backed information on "${modifiedQuery}" using only .gov and .edu sources.`
                )}`;

            case "docs":
                return `${searchBaseUrl}${encodeURIComponent(
                    `Find academic papers and PDF documents on "${modifiedQuery}".`
                )}`;

            case "contrast":
                return [
                    `https://www.google.com/search?q=${encodeURIComponent(modifiedQuery)}`,
                    `https://www.bing.com/search?q=${encodeURIComponent(modifiedQuery)}`,
                    `https://duckduckgo.com/?q=${encodeURIComponent(modifiedQuery)}`
                ];

            default:
                console.error("❌ Invalid search mode:", mode);
                return null;
        }
    }

    function searchWithMode(mode) {
        let query = document.getElementById("searchQuery").value.trim();
        let searchUrl = modifyQuery(mode, query);

        if (Array.isArray(searchUrl)) {
            searchUrl.forEach(url => chrome.tabs.create({ url }));
        } else if (searchUrl) {
            console.log(`🔎 Searching with ${selectedEngine}: ${searchUrl}`);
            chrome.tabs.create({ url: searchUrl });
        }
    }

    document.querySelectorAll("button[data-mode]").forEach(button => {
        button.addEventListener("click", function () {
            let mode = this.getAttribute("data-mode");
            console.log(`🖱️ Button clicked: ${mode}`);
            searchWithMode(mode);
        });
    });
});
