// DOM Elements
const introScreen = document.getElementById('intro-screen');
const resultScreen = document.getElementById('result-screen');
const barcodeTrigger = document.getElementById('barcode-trigger');
const cameraInput = document.getElementById('camera-input');
const loading = document.getElementById('loading');

// Result elements
const sodiumValue = document.getElementById('sodium-value');
const allergensValue = document.getElementById('allergens-value');
const additivesValue = document.getElementById('additives-value');
const spiceValue = document.getElementById('spice-value');
const summaryText = document.getElementById('summary-text');

// Event Listeners
barcodeTrigger.addEventListener('click', () => {
    cameraInput.click();
});

// Make logo on result screen clickable to return to intro
const resultLogo = resultScreen.querySelector('.logo');
resultLogo.addEventListener('click', () => {
    showScreen('intro');
});

cameraInput.addEventListener('change', handleImageUpload);

// Show/Hide Screens
function showScreen(screenName) {
    introScreen.classList.remove('active');
    resultScreen.classList.remove('active');

    if (screenName === 'intro') {
        introScreen.classList.add('active');
    } else if (screenName === 'result') {
        resultScreen.classList.add('active');
    }
}

// Show/Hide Loading
function showLoading(show = true) {
    if (show) {
        loading.classList.add('active');
    } else {
        loading.classList.remove('active');
    }
}

// Handle Image Upload
async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        showLoading(true);

        // Convert image to base64
        const base64Image = await fileToBase64(file);

        // Call API to analyze the image
        const result = await analyzeRamenLabel(base64Image);

        // Display results
        displayResults(result);

        showLoading(false);
        showScreen('result');

    } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to analyze image. Please try again.');
        showLoading(false);
    }

    // Reset input
    event.target.value = '';
}

// Convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Analyze Ramen Label using OpenAI Vision API
async function analyzeRamenLabel(base64Image) {
    // TODO: Replace with your API endpoint (serverless function)
    const API_ENDPOINT = '/api/analyze';

    /* AI PROMPT TO USE:
     * "Analyze this ramen nutrition label and extract the following information:
     * 1. Salt/Sodium content - READ CAREFULLY:
     *    - Look for "Salz" or "Salt" or "Sodium" fields
     *    - Convert to mg: if listed as "4.5g" or "4,5g" = 4500mg (multiply grams by 1000)
     *    - If listed as "Natrium" (sodium), that's already the sodium content
     *    - Return ONLY the number in mg format like "4500 mg"
     * 2. Allergens (list all allergens found)
     * 3. Additives (count the total number of food additives/E-numbers)
     * 4. Spice level (estimate: low, moderate, high, very high)
     * 5. Calculate a 'Pirate Level' score from 0-5 using this RAMEN-SPECIFIC rubric:
     *    (Note: Average instant ramen contains ~1700mg sodium)
     *    - 5: <1000mg sodium, natural ingredients, minimal allergens (healthy ramen options)
     *    - 4: 1000-1400mg sodium, few additives, some allergens (below average)
     *    - 3: 1400-2000mg sodium, standard additives, common allergens (typical instant ramen)
     *    - 2: 2000-2500mg sodium, concerning additives (MSG, artificial colors), many allergens (above average)
     *    - 1: 2500-3000mg sodium, many harmful additives, severe allergen concerns (very unhealthy)
     *    - 0: >3000mg sodium (130%+ daily value), toxic additive levels (extreme/dangerous)
     *
     * Then provide a 1-2 sentence cautionary summary that:
     * - Warns about sodium levels with % of daily value (daily limit = 2300mg)
     * - Mentions additive count and EXPLAINS what the most concerning additives are (with E-numbers) and their potential health effects
     * - Mentions specific allergen warnings
     * - Notes spice level if relevant
     *
     * Return as JSON: { sodium, allergens, additives (as number), spiceLevel, pirateLevel, summary }"
     */

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image
            })
        });

        if (!response.ok) {
            const error = await response.json();
            if (response.status === 429) {
                throw new Error(error.message || 'Scan limit reached');
            }
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API Error:', error);

        // Mock data for development/testing
        return {
            sodium: '1850 mg',
            allergens: 'wheat, soy, sesame',
            additives: '3',
            spiceLevel: 'high',
            summary: 'Average sodium content (80% daily value). Contains 3 additives including MSG (E621) which is a flavor enhancer that may cause sensitivity, and caramel coloring (E150c) linked to potential health concerns.',
            pirateLevel: 3
        };
    }
}

// Display Results
function displayResults(data) {
    sodiumValue.textContent = data.sodium || '-- mg';
    allergensValue.textContent = data.allergens || 'none detected';
    additivesValue.textContent = data.additives || 'unknown';
    spiceValue.textContent = data.spiceLevel || 'unknown';
    summaryText.textContent = data.summary || 'No summary available.';

    // Update pirate flags based on pirate level
    const pirateIcons = document.querySelectorAll('.pirate-icon');
    const level = Math.min(data.pirateLevel || 0, 5);

    pirateIcons.forEach((icon, index) => {
        if (index < level) {
            icon.src = '/full-point.png';
        } else {
            icon.src = '/empty-point.png';
        }
    });
}

// Initialize app
console.log('Ramen Pirate initialized! 🍜🏴‍☠️');
