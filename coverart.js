/* Thank you Patt
Vira for the amazing tutorial
I just did a few changes */

// 2d list of each square dimensions
let sizes = [];

let mouseFx = 0;
let scl = 0.1;
let trnsfrm = 0;

// Matrix of squares properties
let cols; let rows; let size = 8;
// offset to go to origin
let rectOffset;

let xstep = 0; let ystep = 0; let zstep = 0;

function setup() {
  // set canvas size to window size
  canvas = createCanvas(windowWidth, windowHeight);
  windowResized();
  // Set coordinates assuming center pos
  ellipseMode(CENTER);
  // Compute needed rows
  // & cols for matrix
  cols = width / size;
  rows = height / size;
  rectOffset = size * 0.5;
  // Set noise to 6 octaves
  // With a decrease of 0.4 per oct
  noiseDetail(6, 0.4);
  noiseSeed(4);
}

function draw() {
  // Set bg brightness
  background(255);

  // Loop for background art
  xstep = 0;
  for (let i = 0; i < cols; i++) 
  {
    sizes[i] = [];
    ystep = 0;
    for (let j = 0; j < rows; j++) 
    {
      // Define sizes for each circle according to noise map
      sizes[i][j] = map(noise(xstep, ystep, zstep), 0, 1, 0, size);
      // Define sizes according to mouse distance
      mouseFx = dist(mouseX, mouseY, rectOffset + i*size, rectOffset + j*size) * scl;
      // Constrain size to value set in setup
      trnsfrm = constrain(mouseFx, 0, size);
      // Reverse effect
      trnsfrm = size - trnsfrm;
      trnsfrm = constrain(trnsfrm * 0.4 + sizes[i][j], 0, size);
      // Advance 3D noise map in y by 0.1
      ystep += 0.1;
      // Set fill to black
      fill(0);
      noStroke();
      // Create circle
      circle(rectOffset + i * size,rectOffset + j * size, trnsfrm);
    }
  // Advance 3D noise map in x by 0.1
  xstep += 0.1;
  // Advance 3D noise map in z by 0.1 (time)
  zstep += 8e-4;
  }
}

// Always resize the canvas to fill the browser window.
function windowResized() {
    // make sure position is correct
    canvas.position(0,0);
    resizeCanvas(windowWidth, windowHeight);
    // Re-calc stuff for window
    cols = width / size;
    rows = height / size;
    rectOffset = size * 0.5;
}