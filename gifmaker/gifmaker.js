document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const displayCanvas = document.createElement('canvas');
    const displayCtx = displayCanvas.getContext('2d');

    // Set display canvas size (scaled up)
    displayCanvas.width = 512;
    displayCanvas.height = 384;

    // Replace the original canvas with the display canvas
    const canvasContainer = document.querySelector('.canvas-container');
    canvasContainer.replaceChild(displayCanvas, canvas);

    // Now we'll use displayCanvas for drawing, but maintain a smaller buffer
    const bufferCanvas = document.createElement('canvas');
    const bufferCtx = bufferCanvas.getContext('2d');
    bufferCanvas.width = 256;
    bufferCanvas.height = 192;

    // Frame storage
    const frames = [
        bufferCtx.createImageData(256, 192),
        bufferCtx.createImageData(256, 192),
        bufferCtx.createImageData(256, 192)
    ];

    // Initialize frames with TRANSPARENT background (for onion skinning)
    frames.forEach(frame => {
        for (let i = 0; i < frame.data.length; i += 4) {
            frame.data[i] = 0;     // R
            frame.data[i+1] = 0;   // G
            frame.data[i+2] = 0;   // B
            frame.data[i+3] = 0;   // A (fully transparent - IMPORTANT)
        }
    });

    // Drawing state
    let currentFrame = 0;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let brushSize = 2; // Medium thickness by default
    let currentColor = '#000000'; // Black by default
    let isEraserActive = false;
    let onionSkinEnabled = true;
    let isPlaying = false;
    let animationInterval;
    let fps = 12;

    // Export modal elements
    const exportModal = document.getElementById('export-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelExport = document.getElementById('cancel-export');
    const confirmExport = document.getElementById('confirm-export');
    const exportPreview = document.getElementById('export-preview');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');

    // Set initial canvas background to WHITE for display
    displayCtx.fillStyle = '#ffffff';
    displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);

    // Draw the current frame with onion skinning if enabled
    function drawFrame() {
        // Clear display canvas with WHITE background for display only
        displayCtx.fillStyle = '#ffffff';
        displayCtx.fillRect(0, 0, displayCanvas.width, displayCanvas.height);

        // Draw previous frame as onion skin if enabled and not on first frame
        if (onionSkinEnabled && currentFrame > 0) {
            displayCtx.globalAlpha = 0.3;
            // Use TRANSPARENT version for onion skinning
            displayCtx.drawImage(
                createImageFromFrameData(frames[currentFrame - 1]),
                0, 0, 256, 192,
                0, 0, displayCanvas.width, displayCanvas.height
            );
            displayCtx.globalAlpha = 1.0;
        }

        // Draw current frame - use TRANSPARENT version for main drawing
        displayCtx.drawImage(
            createImageFromFrameData(frames[currentFrame]),
            0, 0, 256, 192,
            0, 0, displayCanvas.width, displayCanvas.height
        );
    }

    // Create an image from frame data WITH WHITE BACKGROUND for export
    function createImageFromFrameDataWithWhiteBg(frameData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 192;
        const tempCtx = tempCanvas.getContext('2d');

        // Fill with white background first
        tempCtx.fillStyle = '#ffffff';
        tempCtx.fillRect(0, 0, 256, 192);

        // Create a temporary canvas for the frame data
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = 256;
        frameCanvas.height = 192;
        const frameCtx = frameCanvas.getContext('2d');
        frameCtx.putImageData(frameData, 0, 0);

        // Draw the frame data onto the white background
        tempCtx.drawImage(frameCanvas, 0, 0);

        return tempCanvas;
    }

    // Create an image from frame data WITHOUT white background (for onion skinning and display)
    function createImageFromFrameData(frameData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 256;
        tempCanvas.height = 192;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(frameData, 0, 0);
        return tempCanvas;
    }

    // Draw a pixel at the specified position
    function drawPixel(x, y, color, size) {
        const frame = frames[currentFrame];
        const pixelSize = Math.max(1, size);

        // Convert display coordinates to buffer coordinates
        const bufferX = Math.floor(x / (displayCanvas.width / 256));
        const bufferY = Math.floor(y / (displayCanvas.height / 192));

        // Handle eraser (transparent) vs normal color
        let r, g, b, a;
        if (isEraserActive) {
            r = g = b = 0;  // These don't matter for transparent
            a = 0;          // Fully transparent
        } else {
            r = parseInt(color.slice(1, 3), 16);
            g = parseInt(color.slice(3, 5), 16);
            b = parseInt(color.slice(5, 7), 16);
            a = 255;        // Fully opaque
        }

        // Draw the pixel with the specified size
        for (let dx = 0; dx < pixelSize; dx++) {
            for (let dy = 0; dy < pixelSize; dy++) {
                const px = bufferX + dx;
                const py = bufferY + dy;

                if (px >= 0 && px < 256 && py >= 0 && py < 192) {
                    const index = (py * 256 + px) * 4;
                    frame.data[index] = r;
                    frame.data[index + 1] = g;
                    frame.data[index + 2] = b;
                    frame.data[index + 3] = a; // Use the alpha value
                }
            }
        }

        drawFrame();
    }

    // Event listeners for drawing
    displayCanvas.addEventListener('mousedown', startDrawing);
    displayCanvas.addEventListener('mousemove', draw);
    displayCanvas.addEventListener('mouseup', stopDrawing);
    displayCanvas.addEventListener('mouseout', stopDrawing);

    // Touch events for mobile
    displayCanvas.addEventListener('touchstart', handleTouch);
    displayCanvas.addEventListener('touchmove', handleTouch);
    displayCanvas.addEventListener('touchend', stopDrawing);

    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });

        if (e.type === 'touchstart') {
            startDrawing(mouseEvent);
        } else if (e.type === 'touchmove') {
            draw(mouseEvent);
        }
    }

    function startDrawing(e) {
        isDrawing = true;
        const rect = displayCanvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;

        drawPixel(lastX, lastY, currentColor, brushSize);
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = displayCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // Simple line drawing for continuous strokes
        drawLine(lastX, lastY, currentX, currentY, currentColor, brushSize);
        lastX = currentX;
        lastY = currentY;
    }

    function drawLine(x0, y0, x1, y1, color, size) {
        // Convert display coordinates to buffer coordinates
        x0 = Math.floor(x0 / (displayCanvas.width / 256));
        y0 = Math.floor(y0 / (displayCanvas.height / 192));
        x1 = Math.floor(x1 / (displayCanvas.width / 256));
        y1 = Math.floor(y1 / (displayCanvas.height / 192));

        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = (x0 < x1) ? 1 : -1;
        const sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            drawPixel(
                x0 * (displayCanvas.width / 256),
                y0 * (displayCanvas.height / 192),
                color,
                size
            );

            if (x0 === x1 && y0 === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Brush size buttons
    document.querySelectorAll('.brush-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.brush-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            brushSize = parseInt(this.getAttribute('data-size'));
        });
    });

    // Color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
            // Exit eraser mode when selecting a color
            isEraserActive = false;
            document.getElementById('eraser').classList.remove('active');
        });
    });

    // Frame navigation
    document.querySelectorAll('.frame-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFrame = parseInt(this.getAttribute('data-frame'));
            drawFrame();
        });
    });

    // Eraser button - once clicked, stays active until a color is selected
    document.getElementById('eraser').addEventListener('click', function() {
        isEraserActive = true;
        this.classList.add('active');
        // Remove active state from color buttons
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    });

    // Onion skin toggle
    document.getElementById('onion-toggle').addEventListener('change', function() {
        onionSkinEnabled = this.checked;
        drawFrame();
    });

    // FPS control
    const fpsSlider = document.getElementById('fps-slider');
    const fpsValue = document.getElementById('fps-value');

    fpsSlider.addEventListener('input', function() {
        fps = parseInt(this.value);
        fpsValue.textContent = fps;

        if (isPlaying) {
            stopAnimation();
            playAnimation();
        }
    });

    // Animation controls
    document.getElementById('play-btn').addEventListener('click', playAnimation);
    document.getElementById('stop-btn').addEventListener('click', stopAnimation);

    function playAnimation() {
        if (isPlaying) return;

        isPlaying = true;
        document.getElementById('play-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;

        let frameIndex = 0;

        animationInterval = setInterval(() => {
            // Show the frame
            currentFrame = frameIndex;
            document.querySelectorAll('.frame-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === frameIndex);
            });

            drawFrame();

            // Move to next frame
            frameIndex = (frameIndex + 1) % 3;
        }, 1000 / fps);
    }

    function stopAnimation() {
        if (!isPlaying) return;

        isPlaying = false;
        clearInterval(animationInterval);
        document.getElementById('play-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;

        // Return to the current editing frame
        drawFrame();
    }

    // Action buttons
    document.getElementById('clear-btn').addEventListener('click', function() {
        if (confirm('Clear the current frame?')) {
            // Clear the current frame to TRANSPARENT
            const frame = frames[currentFrame];
            for (let i = 0; i < frame.data.length; i += 4) {
                frame.data[i] = 0;     // R
                frame.data[i+1] = 0;   // G
                frame.data[i+2] = 0;   // B
                frame.data[i+3] = 0;   // A (transparent)
            }
            drawFrame();
        }
    });

    // Export GIF functionality
    document.getElementById('export-gif').addEventListener('click', function() {
        showExportModal();
    });

    // Modal controls
    closeModal.addEventListener('click', hideExportModal);
    cancelExport.addEventListener('click', hideExportModal);

    confirmExport.addEventListener('click', function() {
        exportGIF();
    });

    function showExportModal() {
        // Update preview
        updateExportPreview();
        exportModal.style.display = 'flex';
    }

    function hideExportModal() {
        exportModal.style.display = 'none';
        progressBar.style.display = 'none';
        progress.style.width = '0%';
    }

    function updateExportPreview() {
        // Create a preview of the animation
        const previewCanvas = createImageFromFrameDataWithWhiteBg(frames[0]);
        const previewImg = document.createElement('img');
        previewImg.src = previewCanvas.toDataURL('image/png');
        previewImg.alt = "Animation Preview";

        exportPreview.innerHTML = '<p>Animation Preview:</p>';
        exportPreview.appendChild(previewImg);
    }

    function exportGIF() {
        // Show progress bar
        progressBar.style.display = 'block';
        progress.style.width = '0%';

        // Create GIF with proper configuration
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 256,
            height: 192,
            workerScript: '../dist/gif.worker.js'
        });

        // Add frames to GIF - use the white background version
        frames.forEach((frameData, index) => {
            const frameCanvas = createImageFromFrameDataWithWhiteBg(frameData);
            gif.addFrame(frameCanvas, {delay: 1000 / fps});

            // Update progress
            progress.style.width = `${((index + 1) / 3) * 100}%`;
        });

        // Render GIF
        gif.on('finished', function(blob) {
            // Create download link
            const link = document.createElement('a');
            link.download = 'pixel-animation.gif';
            link.href = URL.createObjectURL(blob);
            link.click();

            // Clean up
            URL.revokeObjectURL(link.href);

            // Hide modal after a short delay
            setTimeout(hideExportModal, 500);
        });

        gif.on('progress', function(p) {
            // Update progress during rendering (p is between 0 and 1)
            progress.style.width = `${p * 100}%`;
        });

        gif.render();
    }

    // Initial draw
    drawFrame();
});