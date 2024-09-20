// frame rate
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

/* Intro animation */
let counter = 0;
let j = 0;
let child = 0
let parent = 0;

// p5js setup
function setup() {
  // Set canvas size
  canvas = createCanvas(windowWidth, windowHeight);
  // Set frame rate
  frameRate(fps);
  // Refresh variables that depend on window size
  windowResized();
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
  translate(width/2, height/2);
  canvas.clear();
  // Sphere Animation
  sphereAnim();
}

/* Sphere animation loop */
function sphereAnim() {
  noFill();
  strokeWeight(1);
  for (let i=0; i<num; i++) {
    waves[i].display();
    waves[i].move();
  }
}

/* Adjust to window size  dynamically */
function windowResized() {
    // Get element that holds O in title
    var el = document.getElementById('span1');
    // Get dimensions
    const rect = el.getBoundingClientRect();
    // Compute radius of logo based on font size of O
    r = 44 / 128 * parseInt(window.getComputedStyle(el).fontSize);
    resizeCanvas(3*r, 3*r);
    translate(1.5*r, 1.5*r);
    // Make Logo follow the O position
    canvas.position(rect.left - r * 0.38, rect.top + r * 0.4);
}

function textChange() {
  switch(j) {
    case 0: // greeting
      document.getElementById("intro1").classList.toggle('hi');
      document.getElementById("intro2").classList.toggle('hi');
      // Set new title
      document.getElementById("intro1").textContent = 'H';
      document.getElementById("intro2").textContent = "LA";
      // Adjust centering
      document.getElementById("intro1").style.width = '12%';
      document.getElementById("intro2").style.width = '12%';
      child = document.getElementById("span1").getBoundingClientRect();
      parent = document.getElementById("title").getBoundingClientRect();
      child.left = parent.width * 0.5 - child.width * 0.5;
      windowResized();
      break;
    case 1: // I'm
      // Set new title
      document.getElementById("intro1").textContent = 'S';
      document.getElementById("intro2").textContent = "Y";
      // Adjust centering
      document.getElementById("intro1").style.width = '10%';
      document.getElementById("intro2").style.width = '10%';
      child = document.getElementById("span1").getBoundingClientRect();
      parent = document.getElementById("title").getBoundingClientRect();
      document.getElementById("span1").left = parent.width * 0.5 - child.width * 0.5;
      windowResized();
      break;
    case 2: // Cover
      steadyCover();
      clearInterval(id1);
      break;
    default:
      break;
  }
  j += 1;
}

// Hover effect for navigation menu
function menuHover(id) {
  let text = document.getElementById(id).textContent;
  let splitText = text.split("O");
  document.getElementById("subt").classList.remove("fade");
  document.getElementById("intro1").textContent = splitText[0];
  document.getElementById("intro2").textContent = splitText[1];
  document.getElementById("intro1").style.width = 'auto';
  document.getElementById("intro2").style.width = 'auto';
  windowResized();
}

// Steady state of home page
function steadyCover() {
  document.getElementById("subt").classList.add("fade");
  document.getElementById('span1').style.position = "sticky";
  document.getElementById("intro1").textContent = 'GUILLERM';
  document.getElementById("intro2").textContent = "";
  document.getElementById("intro1").style.width = 'auto';
  document.getElementById("intro2").style.width = 'auto';
  document.getElementById("subt").textContent = 'ARAMBURO RODRIGUEZ';
  windowResized();
}

// Intro animation
let id1 = null;
clearInterval(id1);
id1 = setInterval(textChange, 900);