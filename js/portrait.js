export const portrait = p => {
    let dryImg;
    let pixelSize;
    let pixIndex, x, y, r, g, b;
    let gray, alphaValue;
    let colorsPerChannel = 6; // Number of shades for RGB
    let maxInvOpcty = 1. / 255;
    let d;
    let effectRadius; // The radius of the flashlight effect in pixels
    let colorDark;
    let colorLight;
    let finalColor;
    let txtColor;
    let asciiChar = '.:-=+*#%@';
    let txt;
    let count;
    let canvas;

    p.preload = () =>  {
        // Load your image here. Replace with your own URL or local path.
        dryImg = p.loadImage('./media/portrait.jpg');
    }

    p.setup = () =>  {
        // Set element that will hold the sequencer
        const container = p.canvas.parentElement;
        let ar = dryImg.width / dryImg.height; 
        canvas = p.createCanvas(container.offsetHeight * ar * 0.6, container.offsetHeight * 0.6);
        // Ensure sketch is visible
        p.canvas.style.display = "block";
        p.canvas.style.visibility = "visible";
        p.canvas.style.pointerEvents = "auto";
        p.windowResized();
        // Page colors for two tone effect
        colorDark = p.color(6, 41, 118);
        colorLight = p.color(204, 211, 226); // p.color(253, 253, 253);
        p.noLoop();
        count = 0;
    }

    p.windowResized = () => {
        p.clear();
        const container = p.canvas.parentElement;
        let ar = dryImg.width / dryImg.height; 
        p.resizeCanvas(container.offsetHeight * ar * 0.6, container.offsetHeight * 0.6);
        canvas.position(container.offsetWidth * 0.5 - container.offsetHeight * ar * 0.5 * 0.6, container.offsetHeight * 0.33);
        pixelSize = 10; // p.floor(p.height * 0.04);
        effectRadius = p.width * 0.25;
    }

    p.draw = () =>  {
        // Draw image
        // Load img pixels
        dryImg.loadPixels();
        // p.image(dryImg, 0, 0, p.width, p.height);
        makeImg();
    }

    // Helper function to math-magically reduce color depth
    function crushColor(val, steps) {
        // Maps 0-255 into a few distinct steps, then scales it back up
        return Math.floor(val / (255 / steps)) * (255 / (steps - 1));
    }

    p.mouseMoved = () =>  {
        p.clear();
        // p.image(dryImg, 0, 0, p.width, p.height);
        makeImg();
    }

    function makeImg() {
        for (x = 0; x < dryImg.width; x += pixelSize) {
            let true_x = p.map(x, 0, dryImg.width, 0, p.width);
        for (y = 0; y < dryImg.height; y += pixelSize) {
            let true_y = p.map(y, 0, dryImg.height, 0, p.height);
            // Distance from mouse pos to current x, y pixels
            // d = p.dist(p.mouseX, p.mouseY, true_x, true_y);
            // If inside radius for effect
            // if (d < effectRadius) {
                // Get the color of the current pixel
                pixIndex = (x + y * dryImg.width) * 4;
                r = dryImg.pixels[pixIndex];
                g = dryImg.pixels[pixIndex + 1];
                b = dryImg.pixels[pixIndex + 2];
                // Convert to grayscale using standard luminance weights
                gray = (r * 0.299) + (g * 0.587) + (b * 0.114);
                // Reduce effect with distance
                // alphaValue = p.map(d, 0, effectRadius, 255, 0);
                // Decimate color shades
                txt = p.floor(p.map(gray + 50 * p.noise(0.008 * (pixIndex + count)) - 25, 255, 0, 0, asciiChar.length));
                // gray = crushColor(gray, colorsPerChannel);
                // Normalize brightness
                gray = gray * maxInvOpcty;
                // Mix the two tones based on grayscale
                finalColor = p.lerpColor(colorDark, colorLight, gray * 1.6);
                //txtColor = p.lerpColor(colorLight, colorDark, gray * 1.6);
                //txtColor.setAlpha(200);
                // Set effect reduce / dist
                // finalColor.setAlpha(alphaValue);
                // Draw
                p.fill(finalColor);
                //noStroke();
                //rect(true_x, true_x, pixelSize, pixelSize);
                //finalColor.setAlpha(alphaValue);
                p.textSize(p.height * 0.005);
                //fill(txtColor);
                p.textAlign(p.CENTER, p.CENTER);
                p.text(asciiChar.charAt(txt), true_x, true_y);
            // }
        }
        }
        count++;
        }
}