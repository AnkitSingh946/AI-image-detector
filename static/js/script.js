document.addEventListener('DOMContentLoaded', () => {
    // Only run on detect page
    const dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;

    const fileInput = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // States
    const defaultState = document.getElementById('default-state');
    const loadingState = document.getElementById('loading-state');
    const resultState = document.getElementById('result-state');
    
    // Results
    const predictionBanner = document.getElementById('prediction-banner');
    const predictionIcon = document.getElementById('prediction-icon');
    const predictionValue = document.getElementById('prediction-value');
    const confidenceValue = document.getElementById('confidence-value');
    const confidenceBar = document.getElementById('confidence-bar');
    
    // Insights
    const toggleInsightsBtn = document.getElementById('toggle-insights-btn');
    const insightsSection = document.getElementById('insights-section');

    let currentFile = null;

    // Drag and Drop Events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    removeBtn.addEventListener('click', () => {
        resetUI();
    });

    toggleInsightsBtn.addEventListener('click', () => {
        insightsSection.classList.toggle('hidden');
        const icon = toggleInsightsBtn.querySelector('i');
        if (insightsSection.classList.contains('hidden')) {
            icon.classList.replace('ph-caret-up', 'ph-caret-down');
        } else {
            icon.classList.replace('ph-caret-down', 'ph-caret-up');
            // Scroll to insights smoothly
            insightsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        // Show loading state
        switchState(loadingState);
        analyzeBtn.disabled = true;
        insightsSection.classList.add('hidden');

        const formData = new FormData();
        formData.append('image', currentFile);

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Prediction failed');

            const data = await response.json();
            showResult(data);
        } catch (error) {
            console.error(error);
            alert('Error analyzing image. Please try again.');
            switchState(defaultState);
        } finally {
            analyzeBtn.disabled = false;
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            dropZone.classList.add('hidden');
            previewContainer.classList.remove('hidden');
            // Reset result side
            switchState(defaultState);
            insightsSection.classList.add('hidden');
        };

        reader.readAsDataURL(file);
    }

    function resetUI() {
        currentFile = null;
        fileInput.value = '';
        imagePreview.src = '';
        previewContainer.classList.add('hidden');
        dropZone.classList.remove('hidden');
        switchState(defaultState);
        insightsSection.classList.add('hidden');
    }

    function switchState(stateEl) {
        defaultState.classList.add('hidden');
        loadingState.classList.add('hidden');
        resultState.classList.add('hidden');
        
        stateEl.classList.remove('hidden');
    }

    function showResult(data) {
        // Reset classes
        predictionBanner.className = 'prediction-banner';
        
        const isReal = data.prediction === 'Real';
        
        predictionBanner.classList.add(isReal ? 'real' : 'fake');
        predictionIcon.innerHTML = isReal ? '<i class="ph ph-check-circle"></i>' : '<i class="ph ph-x-circle"></i>';
        predictionValue.textContent = `${data.prediction} Image`;
        
        confidenceValue.textContent = `${data.confidence}%`;
        
        // Progress bar color based on result
        confidenceBar.style.backgroundColor = isReal ? 'var(--success)' : 'var(--danger)';
        
        // Animate progress bar
        setTimeout(() => {
            confidenceBar.style.width = `${data.confidence}%`;
        }, 100);

        switchState(resultState);
    }
});
