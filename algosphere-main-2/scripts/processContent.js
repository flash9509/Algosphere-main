import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_FILE = path.join(__dirname, '../src/assets/solutions_archive.json');
const OUTPUT_FILE = path.join(__dirname, '../src/assets/clean_problems.json');

// Phrases to remove from description
const JUNK_PHRASES = [
    "Ace your Coding Interview",
    "Practice this problem",
    "Rate this post",
    "Average rating",
    "Vote count:",
    "No votes so far! Be the first to rate this post.",
    "We are sorry that this post was not useful for you!",
    "Tell us how we can improve this post?",
    "Thanks for reading.",
    "To share your code in the comments, please use our online compiler that supports C, C++, Java, Python, JavaScript, C#, PHP, and many more popular programming languages.",
    "Like us? Refer us to your friends and support our growth. Happy coding :)",
    "Download  Run Code",
    "Output:"
];

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function cleanDescription(text) {
    if (!text) return "";
    let lines = text.split('\n');
    const cleanedLines = lines.filter(line => {
        const trimmed = line.trim();
        if (!trimmed) return false; // Remove empty lines
        // Check if line contains any junk phrase
        if (JUNK_PHRASES.some(phrase => trimmed.includes(phrase))) return false;
        // Remove lines that are just numbers (like line numbers in code blocks that leaked)
        if (/^\d+$/.test(trimmed)) return false;

        return true;
    });
    return cleanedLines.join('\n\n');
}

function extractCode(rawContent) {
    if (!rawContent) return { description: "", code: {} };

    const code = {};
    const languageHeaders = [
        { key: 'c', marker: '\nC\n' },
        { key: 'cpp', marker: 'C++' },
        { key: 'java', marker: 'Java' },
        { key: 'python', marker: 'Python' }
    ];

    // First, find positions of all headers
    let positions = [];
    languageHeaders.forEach(lang => {
        try {
            // Escape the marker for regex
            const escapedMarker = escapeRegExp(lang.marker);
            // Regex to find standalone language headers, avoiding false positives in text
            const regex = new RegExp(`(^|\\n)${escapedMarker}(\\n|$)`, 'i');
            const match = rawContent.match(regex);
            if (match) {
                positions.push({
                    lang: lang.key,
                    index: match.index + match[0].length, // Start of code
                    rawIndex: match.index
                });
            }
        } catch (e) {
            console.warn(`Regex error for ${lang.key}:`, e);
        }
    });

    // Sort by position
    positions.sort((a, b) => a.index - b.index);

    if (positions.length === 0) return { description: cleanDescription(rawContent), code: {} };

    // Description is everything before the first code block
    const descriptionPart = rawContent.substring(0, positions[0].rawIndex);
    const description = cleanDescription(descriptionPart);

    // Extract code for each language
    for (let i = 0; i < positions.length; i++) {
        const current = positions[i];
        const next = positions[i + 1];

        let codeEndIndex = next ? next.rawIndex : rawContent.length;

        // Refine end index by looking for "Download", "Output:", or "The time complexity"
        const section = rawContent.substring(current.index, codeEndIndex);

        // Stop at "Download" or "Output" or common text endings if they appear earlier
        const stopHeuristics = ["Download", "Output:", "The time complexity", "Reference:", "Related Posts:", "Average rating"];
        let effectiveLen = section.length;

        stopHeuristics.forEach(stop => {
            const stopIdx = section.indexOf(stop);
            if (stopIdx !== -1 && stopIdx < effectiveLen) {
                effectiveLen = stopIdx;
            }
        });

        let extractedCode = section.substring(0, effectiveLen).trim();

        // Remove line numbers if present (e.g., "12345...")
        extractedCode = extractedCode.replace(/^\d+\s+/gm, '');

        if (extractedCode.length > 20) { // Minimal check to ensure it's not noise
            code[current.lang] = extractedCode;
        }
    }

    return { description, code };
}

function process() {
    console.log("Starting processing...");
    console.log("Input:", INPUT_FILE);
    try {
        if (!fs.existsSync(INPUT_FILE)) {
            throw new Error(`Input file not found at ${INPUT_FILE}`);
        }

        const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
        console.log(`Read ${rawData.length} bytes.`);

        const problems = JSON.parse(rawData);
        console.log(`Parsed ${problems.length} problems.`);

        const cleanProblems = problems.map((p, index) => {
            const { description, code } = extractCode(p.content);
            return {
                id: (index + 1),
                title: p.title,
                category: p.category,
                url: p.url,
                difficulty: "Medium", // Default
                description: description,
                code: code
            };
        });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanProblems, null, 2));
        console.log(`Successfully processed ${cleanProblems.length} problems to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("Error processing file:", error);
        console.error(error.stack);
    }
}

process();
