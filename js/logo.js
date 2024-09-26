// frame rate
let canvas;
let fps = 35;

/* Sphere animation */
// sine amplitude (radius of sphere)
let r = 0; 
// Sin array
let waves = []; 
// Number of sines
let num = 6;
// Phase shift between sines 
let step = 30;

function logoSetup() {
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
}

/* Main loop */
function draw() {
    canvas.clear();
    // Center drawing in canvas
    translate(width * 0.5, height * 0.5);
    // Sphere Animation
    sphereAnim();
  }
  
  /* Sphere animation loop */
  function sphereAnim() {
    noFill();
    strokeWeight(2);
    for (let i=0; i<num; i++) {
      waves[i].display();
      waves[i].move();
    }
  }
  
  /* Update logo size to match font size */
  function sphereSize() {
    // Get element that holds O in title
    let el = document.getElementById('logo');
    const rect = el.getBoundingClientRect();
    // Compute radius of logo based on font size of O
    r = 44 / 128 * parseInt(window.getComputedStyle(el).fontSize);
  }
  
  /* Adjust to window size  dynamically */
  function windowResized() {
    // Update size of logo based on font size
    sphereSize();
    resizeCanvas(2.1*r, 2.1*r);
  }