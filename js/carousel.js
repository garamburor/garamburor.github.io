export const carousel = (p) => {
    // Array to store the random positions and rotations
    let rectangles = []; // cartesian coord of each pic
    let images = []; // Array to store the loaded images
    let cam;
    let canvas;
    let norm;
    let lastInputTime = -2000;
    let IDLE_THRESHOLD = 2000; // Waiting time before auto rotation (ms)
    // pic files
    const pics = ['DSCF1714', 'DSCF1874', 'DSCF1881', 'DSCF2415', 'DSCF2489', 'DSCF2494', 'DSCF2534', 'DSCF2577', 'DSCF2769', 'DSCF2785', 'DSCF2872', 'DSCF2884', 'DSCF3007', 'DSCF3114', 'DSCF3127'];
    // Scale factor for the images
    let scale;
    // load images before setup
    p.preload = () => {
        for (let i = 0; i < pics.length; i++) {
            images.push(p.loadImage('./media/photos/' +pics[i] + '.avif'));
        }
    }

    p.setup = () => {  
        // Create a 3D canvas
        canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        canvas.position(0, 0);
        // Ensure sketch is visible
        p.canvas.style.display = "block";
        p.canvas.style.visibility = "visible";
        canvas.show();

        // Create a p5.Camera object.
        cam = p.createCamera();
        // Generate random coords for n rectangles
        for (let i = 0; i < pics.length; i++) {
            rectangles.push({
            id: i + 1, // Unique ID per object (Must be greater than 0)
            // Random X, Y, Z coordinates
            x: p.random(0.1, 0.9),
            y: p.random(0.1, 0.9),
            z: p.random(0.1, 0.9)});
        }
        p.windowResized();
        cam.move(norm * 0.3, norm * 0.3, norm * 0.3);
    }

    p.draw = () => {
        // Set background color
        p.background(250);
        // Check if user input is idle
        let idleTime = p.millis() - lastInputTime;
        if (idleTime > IDLE_THRESHOLD) {
            // auto rotate
            cam.move(5, 0, 0);
            //cam.lookAt(0, 0, 0);
        }
        // Enable standard 3D camera controls (left-click + drag to look around)
        p.orbitControl(0.5, 0.5, 0.5);
        cam.lookAt(0, 0, 0);
        // Calculate angles to make plane face the cam
        let angleY = p.atan2(cam.eyeX, cam.eyeZ); 
        
        // Calculate pitch based on the true 3D position
        let distance2D = p.sqrt(cam.eyeX * cam.eyeX + cam.eyeZ * cam.eyeZ); 
        let angleX = p.atan2(cam.eyeY, distance2D);
        p.noStroke();
        
        // Loop through and draw each plane/img
        for (let i = 0; i < pics.length; i++) {
            let r = rectangles[i];
            p.push(); // Save current coordinate system state
            // Move to the coords
            p.translate(r.x * norm - norm * 0.5,
                    r.y * norm - norm * 0.5, 
                    r.z * norm - norm * 0.5);
            
            p.rotateY(angleY);
            p.rotateX(-angleX);
            // Apply img as texture
            p.texture(images[i]);
            // Create plane
            p.plane(images[i].width * scale, images[i].height * scale);
            
            p.pop(); // Restore coordinate system state for the next object
        }
    }

    // Adjust canvas size if the window resizes
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if (p.windowHeight > p.windowWidth) {
            norm = p.windowWidth;
        } else {
            norm = p.windowHeight;
        }
        scale = norm * 1e-4;
    }
    // Update last input time on mouse press or wheel scroll
    p.mousePressed = () => {
        lastInputTime = p.millis();
    }

    p.mouseWheel = () => {
        lastInputTime = p.millis();
    }
};