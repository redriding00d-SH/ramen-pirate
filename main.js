// DOM Elements
const introScreen = document.getElementById('intro-screen');
const resultScreen = document.getElementById('result-screen');
const scanBtn = document.getElementById('scan-btn');
const scanAgainBtn = document.getElementById('scan-again-btn');
const cameraInput = document.getElementById('camera-input');
const loading = document.getElementById('loading');

// Result elements
const sodiumValue = document.getElementById('sodium-value');
const allergensValue = document.getElementById('allergens-value');
const additivesValue = document.getElementById('additives-value');
const spiceValue = document.getElementById('spice-value');
const summaryText = document.getElementById('summary-text');

// Event Listeners
scanBtn.addEventListener('click', () => {
    cameraInput.click();
});

scanAgainBtn.addEventListener('click', () => {
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
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('API Error:', error);

        // Mock data for development/testing
        return {
            sodium: '450 mg',
            allergens: 'wheat, soy',
            additives: 'moderate',
            spiceLevel: 'high',
            summary: 'This ramen contains high sodium levels. If you have hypertension, consider consuming in moderation. Contains common allergens like wheat and soy.',
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
    const pirateFlags = document.querySelector('.pirate-flags');
    const level = data.pirateLevel || 2;
    pirateFlags.innerHTML = '🏴‍☠️'.repeat(Math.min(level, 5));
}

// Initialize app
console.log('Ramen Pirate initialized! 🍜🏴‍☠️');
