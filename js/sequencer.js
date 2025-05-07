// Audio elements
let audioCtx = new window.AudioContext() || window.webkitAudioContext();



const sketch3 = p => {
    // Number of steps
    let canvas
    let cols;
    let rows;
    let squareSize;
    // Grid for storing state of each sequence step
    let grid = [];
    let colorGrid = [];
    // Color palette array
    let colors = [];
    // Iterate through colors
    let colorCounter = 0;

    let oscArray = [];
    let envArray = [];
    let bpm = 100;
    let lastTime = 0;
    let currentStep = 0;
    let interval;
    let nbVoices = 6;
    let voiceCount = 0;

    let clock;

    // Scale
    let midiNotes = [60, 61, 63, 65];
    midiNotes = midiNotes.reverse();

    // Colors
    function initializePalette() {
        colors = [
            p.color(254, 250, 235), // Stroke color
            p.color(246, 192, 106), // Warm gold
            p.color(244, 122, 96),  // Soft coral
            p.color(92, 64, 107),   // Deep purple
            p.color(45, 117, 161)   // Rich blue
        ];
    }

    function initializeGrid() {
        // Check how many octaves can be added
        // Reset grid
        grid = [];
        colorGrid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            colorGrid[y] = [];
            for (let x = 0; x < cols; x++) {
                grid[y][x] = false;
                colorGrid[y][x] = null;
            }
        }
    }

    function initSynth() {            
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

    p.drawGrid = function() {
        // Clear canvas
        //p.clear()
        // Set bg color
        p.background(23, 167, 126);
        // Set line color and width
        p.stroke(254, 250, 235);
        p.strokeWeight(1);
        // Check how many octaves can be added
        // Estimate screen excess to center grid
        let totalGridWidth = cols * squareSize;
        let totalGridHeight = rows * squareSize;
        let xOffset = (p.windowWidth - totalGridWidth) * 0.5;
        let yOffset = (p.windowHeight - totalGridHeight) * 0.5;
        // Draw grid
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
            // If step is active
            if (grid[y][x] == true) {
                // Add color
                p.fill(colorGrid[y][x]);
            } else {
                // Remove color if unactive
                p.noFill();
            }
            // Draw square
            p.rect(xOffset + x * squareSize, yOffset + y * squareSize, squareSize, squareSize);
            }
        }
    }

    p.midiToFreq = function(midiNote) {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    p.setup = function() {
        initializePalette();
        initializeGrid();
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        cols =  32;
        // Check how many octaves can be added
        p.windowResized();
        interval = (60 / bpm) / 8; // Step interval in milliseconds
        // Check how many octaves can be added
    }

    p.scheduler = function() {
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

    function playStep() {
        for (let i = 0; i < rows; i++) {
            if (grid[i][currentStep]) {
                let noteFreq = midiNotes[i % midiNotes.length]
                let middleNote = Math.floor(rows * 0.5);
                let octvPos = -12 * Math.floor((i - middleNote) / midiNotes.length);
                noteFreq = p.midiToFreq(noteFreq + octvPos);
                oscArray[voiceCount].frequency.setValueAtTime(noteFreq, audioCtx.currentTime); 

                envArray[voiceCount].gain.exponentialRampToValueAtTime(
                    1. / nbVoices, 
                    audioCtx.currentTime + 0.1
                );
                // envArray[i].gain.setValueAtTime(0, audioCtx.currentTime + 0.1);
                // Finally this schedules the fade out.
                envArray[voiceCount].gain.exponentialRampToValueAtTime(
                    1e-9, 
                    audioCtx.currentTime + 0.8
                );
                voiceCount = (voiceCount + 1) % nbVoices;
            }
        }
    }

    // if window size changes draw grid again
    p.windowResized = function() {
        cancelAnimationFrame(clock);
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Size of squares always fits sequence length
        if (window.matchMedia("(orientation: portrait)").matches) {
            cols = 16;
        }
        else {
            cols = 32;
        }
        squareSize = p.windowWidth / (cols + 0.5);
        rows = Math.floor(p.windowHeight / squareSize);
        
        initializeGrid();
        p.drawGrid();
        p.scheduler();
    }
    
    p.mouseClicked = function() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
            lastTime = audioCtx.currentTime;
            initSynth();
            p.scheduler();
        }

        if (p.mouseX >= 0 && p.mouseX <= p.windowWidth && p.mouseY >= 0 && p.mouseY <= p.windowHeight) {
            let totalGridWidth = cols * squareSize;
            let totalGridHeight = rows * squareSize;
            let xOffset = (p.windowWidth - totalGridWidth) / 2;
            let yOffset = (p.windowHeight - totalGridHeight) / 2;

            let xIndex = floor((p.mouseX - xOffset) / squareSize);
            let yIndex = floor((p.mouseY - yOffset) / squareSize);

            // Activate square that mouse clicked
            if (xIndex >= 0 && xIndex < cols && yIndex >= 0 && yIndex < rows)   {
                if (grid[yIndex][xIndex] === false) {
                    grid[yIndex][xIndex] = true;
                    colorGrid[yIndex][xIndex] = colors[colorCounter];
                    colorCounter = (colorCounter + 1) % colors.length;
                }
                else{
                    grid[yIndex][xIndex] = false;
                }

            }

            // Update grid
            p.drawGrid();
        }
    }
}

// Create sketch
let instance3 = new p5(sketch3, 'works-container');