export const sequencer = p => {
    // Variables for grid size
    let canvas
    let cols;
    let rows;
    let squareSize;
    let gridWidth;
    let gridHeight;
    let xOffset;
    let yOffset;

    // Sequencer button / UX logic
    let grid = [];
    let lock = [];
    let isPressed = false;

    // Resets seuqencer memory
    function initializeGrid() {
        grid = [];
        lock = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            lock[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = false;
                lock[y][x] = false;
            }
        }
    }

    // Color palette array
    let colors = [];
    // Iterate through colors
    let colorCounter = 0;

    function initializePalette() {
        colors = [
            p.color(254, 250, 235), // Stroke color
            p.color(246, 192, 106), // Warm gold
            p.color(6, 41, 118),   // Rich blue
            p.color(244, 122, 96),  // Soft coral
            p.color(92, 64, 107)   // Deep purple
        ];
    }

    // Audio elements
    let audioCtx = new window.AudioContext() || window.webkitAudioContext();
    audioCtx.suspend(); // Stop audio
    let oscArray = [];
    let envArray = [];
    let bpm = 100;
    let lastTime = 0;
    let currentStep = 0;
    let interval;
    let nbVoices = 6;
    let voiceCount = 0;
    let clock;

    function initSynth() {    
        oscArray = []
        envArray = []      
        // Create oscillators and envelopes
        for (let i = 0; i < nbVoices; i++) {
            let osc = audioCtx.createOscillator();
            osc.type = "triangle";
            
            let env = audioCtx.createGain();
            env.gain.setValueAtTime(1e-9, audioCtx.currentTime); // Start silent
            
            osc.connect(env);
            env.connect(audioCtx.destination);
            osc.start();
            
            oscArray.push(osc);
            envArray.push(env);
        }
    }

    // Scale
    let midiNotes = [60, 61, 63, 65];
    midiNotes = midiNotes.reverse();

    // Sketch constructor
    p.setup = () => {
        // Make colors
        initializePalette();
        // Make sequencer memory
        initializeGrid();
        // Set element that will hold the sequencer
        const container = p.canvas.parentElement;
        // Sketch takes the whole element size
        canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
        // Ensure sketch is visible
        p.canvas.style.display = "block";
        p.canvas.style.visibility = "visible";
        p.canvas.style.pointerEvents = "auto";
        canvas.position(0, 0);
        // Step interval in milliseconds
        interval = (60 / bpm) / 8;
        // Events for Sequencer UX
        canvas.mousePressed(buttonPressed);
        canvas.mouseReleased(buttonReleased);
        canvas.mouseMoved(handleDrag); // yass
        canvas.show();
        // Check how many octaves can be added
        p.windowResized();
    }

    // Destructor
    p.destroy = () => {
        cancelAnimationFrame(clock); // Kill the clock
        oscArray.forEach(osc => { // Kill the oscillators
            try { osc.stop(); osc.disconnect(); } catch(e) {}
        });
        envArray.forEach(env => env.disconnect());
        if (audioCtx && audioCtx.state !== 'closed') { // Kill the audio context
            audioCtx.close();
        }
    };

    // Funtion to draw & update sequencer
    p.drawGrid = () => {
        // Clear canvas
        p.clear()
        // Set bg color
        p.background(23, 167, 126);
        // Set line color and width
        p.stroke(254, 250, 235);
        p.strokeWeight(1);

        for(let i = 0; i <= rows; i++) {
            let y = yOffset + i * squareSize;
            p.line(xOffset, y, xOffset + gridWidth, y);
        }

        for (let j = 0; j <= cols; j++) {
            let x = xOffset + j * squareSize;
            p.line(x, yOffset, x, yOffset + gridHeight);
        }
    }

    p.midiToFreq = function(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    // For timing of sequencer
    p.scheduler = () => {
        // Capture current time
        let now = audioCtx.currentTime;
        // If step time already passed
        if (now - lastTime >= interval) {
            // Update last time
            lastTime = now;
            // Play step
            playStep();
            // Advance step
            currentStep = (currentStep + 1) % cols;
        }
        
        clock = requestAnimationFrame(p.scheduler);
    }

    // If step is active this function is called to make sound
    function playStep() {
        for (let i = 0; i < rows; i++) {
            if (grid[i][currentStep]) {
                // Pick midi note based on position of button pressed
                let noteFreq = midiNotes[i % midiNotes.length]
                // Take octaves into account
                let middleNote = p.floor(rows * 0.5);
                let octvPos = -12 * p.floor((i - middleNote) / midiNotes.length);
                // Convert midi to freq
                noteFreq = p.midiToFreq(noteFreq + octvPos);
                // Assign osc to play sound
                oscArray[voiceCount].frequency.setValueAtTime(noteFreq, audioCtx.currentTime); 
                // Assign corresponding amplitude envelope
                envArray[voiceCount].gain.exponentialRampToValueAtTime(
                    1. / nbVoices, // To avoid clipping
                    audioCtx.currentTime + 0.1 // Play in 0.1 secs
                );
                // envArray[i].gain.setValueAtTime(0, audioCtx.currentTime + 0.1);
                // Finally this schedules the fade out.
                envArray[voiceCount].gain.exponentialRampToValueAtTime(
                    1e-9, // Mute envelope
                    audioCtx.currentTime + 0.8 // End sound after 0.8 secs
                );
                // Set the osc that will handle the next step called
                voiceCount = (voiceCount + 1) % nbVoices;
            }
        }
    }

    // if window size changes draw grid again
    p.windowResized = () =>  {
        p.clear();
        let winWidth = window.innerWidth || 
            document.documentElement.clientWidth ||  
            document.body.clientWidth;
        let winHeight = window.innerHeight|| 
            document.documentElement.clientHeight|| 
            document.body.clientHeight;

        // Clear sequencer since grid size could change
        cancelAnimationFrame(clock);
        audioCtx.suspend();
        oscArray.forEach(osc => { // Kill the oscillators
            try { osc.stop(); osc.disconnect(); } catch(e) {}
        });
        envArray.forEach(env => env.disconnect());
        p.resizeCanvas(winWidth, winHeight);
        // 32 steps landscape, 16 steps for portrait
        if (window.matchMedia("(orientation: portrait)").matches) {
            cols = 16;
        }
        else {
            cols = 32;
        }
        // Calculate size!
        squareSize = winWidth* 0.98 / cols;
        rows = Math.floor(winHeight * 0.98 / squareSize);
        // Estimate screen excess to center grid
        gridHeight = rows * squareSize;
        gridWidth = cols * squareSize;
        xOffset = (winWidth - gridWidth) * 0.5;
        yOffset = (winHeight - gridHeight) * 0.5;
        // Reset gui and audio
        initializeGrid();
        p.drawGrid();
    }

    // Handle click inside sequencer
    function seqButton() {
        // Calculate position of button clicked
        let xIndex = p.floor((p.mouseX - xOffset) / squareSize);
        let yIndex = p.floor((p.mouseY - yOffset) / squareSize);
        
        // Activate square that mouse clicked
        // The gap could create values that make no sense, so ensure
        // value is within rows and cols
        if (xIndex >= 0 && xIndex < cols && yIndex >= 0 && yIndex < rows)   {
            if (p.mouseButton === p.LEFT) {
                // Web audio needs a click to activate
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                    currentStep = xIndex - 3;
                    p.scheduler();
                    // Update time of audio handler
                    lastTime = audioCtx.currentTime;
                    initSynth();
                    // draw stop button
                    p.fill(171, 50, 24);
                    p.rect(xOffset, yOffset, squareSize, squareSize);
                }

                // Check if button is locked
                if (!lock[yIndex][xIndex]) {
                    // Change state of button
                    grid[yIndex][xIndex] = !grid[yIndex][xIndex];
                    // Check if it should be drawn or erased
                    if (grid[yIndex][xIndex]) {
                        p.fill(colors[colorCounter]);
                        colorCounter = (colorCounter + 1) % colors.length;
                    } else {
                        // Background color
                        p.fill(23, 167, 126);
                    }
                    // Draw square
                    p.rect(xOffset + xIndex * squareSize, yOffset + yIndex * squareSize, squareSize, squareSize);
                    lock[yIndex][xIndex] = true;
                }
            }
            if(lock[0][0]) {
                audioCtx.suspend();
                cancelAnimationFrame(clock); // Kill the clock
                oscArray.forEach(osc => { // Kill the oscillators
                    try { osc.stop(); osc.disconnect(); } catch(e) {}
                });
                envArray.forEach(env => env.disconnect());
                initializeGrid();
                p.drawGrid(); // Clear
            }
        }
    }

    function buttonPressed() {
        isPressed = true;
        seqButton();
    }

    function buttonReleased() {
        isPressed = false;
        // not a fan of this
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                lock[y][x] = false;
            }
        }
    }
    // yass bitch
    function handleDrag() {
        if (isPressed) {
            seqButton();
        }
    }
}