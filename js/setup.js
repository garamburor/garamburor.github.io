// p5js setup
function setup() {
    // Update size of logo based on font size
    sphereSize();
    // Set canvas size to diameter of circle
    canvas = createCanvas(2.1*r, 2.1*r);
    // Set canvas inside span1
    canvas.parent('logo');
    // Set frame rate
    frameRate(fps);
    // Set color of strokes
    stroke(0, 0, 255);
    // Set angle with degrees instead of radians
    angleMode(DEGREES);
    // Create wave objects
    for (let i=0; i<num; i++) {
      waves[i] = new Wave(i*step);
    }
    
    // For easter egg
    document.body.addEventListener("mousemove", rotateKnob);
    document.body.addEventListener("touchmove", touchKnob, {passive: false});
    document.body.addEventListener("mouseup", mouseUp);
    document.body.addEventListener("touchend", mouseUp);
    document.body.addEventListener("touchcancel", mouseUp);
    document.getElementById("Gknob").addEventListener("mousedown", mouseDown);
    document.getElementById("Gknob").addEventListener("touchstart", mouseDown);
  }