const spamKeywords = [
    "free money",
    "work from home",
    "click here",
    "visit this link",
    "http",
    "www",
];

const spamDetector = (text) => {
    let score = 0;

    if (text.length < 20) {
        score += 20;
    }

    const lowerText = text.toLowerCase();

    spamKeywords.forEach(word => {
        if (lowerText.includes(word)) score += 30;
    });

    if (/([A-Z]){6,}/.test(text)) score += 20;

    if ((text.match(/😀|🔥|😍/g) || []).length > 5) {
        score += 10;
    }

    return score > 100 ? 100 : score;
};

export default spamDetector;