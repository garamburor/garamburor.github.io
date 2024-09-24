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

/* Intro animation */
let counter = 0;
let j = 0;
let id1 = null;
let id2 = null;
let id3 = null;
clearInterval(id1);
id1 = setInterval(textChange, 900);

/* Intro animation */
let hoverState = 0;

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

/* Intro text animation seuqence */
function textChange() {
  switch(j) {
    case 0: // greeting
      document.getElementById("intro1").classList.add('hi');
      document.getElementById("intro2").classList.add('hi');
      // Set new title
      document.getElementById("intro1").textContent = 'H';
      document.getElementById("intro2").textContent = "LA";
      // Adjust centering
      document.getElementById("intro1").style.width = '12%';
      document.getElementById("intro2").style.width = '12%';
      document.getElementById("intro2").style.overflow = 'visible';
      break;
    case 1: // I'm
      // Set new title
      document.getElementById("intro1").textContent = 'S';
      document.getElementById("intro2").textContent = "Y";
      // Adjust centering
      document.getElementById("intro1").style.width = '10%';
      document.getElementById("intro2").style.width = '10%';
      break;
    case 2: // Cover
      document.getElementById("intro1").classList.remove('hi');
      document.getElementById("intro2").classList.remove('hi');
      document.getElementById("intro1").style.overflow = 'hidden';
      document.getElementById("intro2").style.overflow = 'hidden';
      document.getElementById("menu").style.opacity = 1;
      steadyCover();
      clearInterval(id1);
      break;
    default:
      break;
  }
  j += 1;
}

// Hover effect for navigation menu
function menuHoverIn(id) {
  // Don't go to menu if you hover back inside
  clearInterval(id2);
  clearInterval(id3);
  document.getElementById("intro1").style.overflow = 'hidden';
  document.getElementById("intro2").style.overflow = 'hidden';
  // Obtain text to be set
  let text = document.getElementById(id).textContent;
  // Split where O is
  let splitText = text.split("O");
  // Add text word by word
  document.getElementById("title").style.animation = "curtain 1s linear";
  id2 = setTimeout(function() {
    document.getElementById("intro1").textContent = splitText[0];
    document.getElementById("intro2").textContent = splitText[1];
    document.getElementById("title").style.width = 1;
  }, 500);
  
  // Remove subtitle
  document.getElementById("subt").style.opacity = 0;
}

function menuHoverOut() {
  clearInterval(id2);
  clearInterval(id3);
  document.getElementById("title").style.animation = "widthIn 500ms linear";
  id2 = setTimeout(steadyCover, 490);
}

/* Steady state of home page */
function steadyCover() {
  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";
  // Update cover text
  document.getElementById("title").style.animation = "widthOut 500ms linear"
  document.getElementById("intro1").textContent = 'GUILLERM';
  document.getElementById("intro2").textContent = '';
  document.getElementById("title").style.width = 1;
  // Update cover width
  document.getElementById("intro1").style.width = 'auto';
  document.getElementById("intro2").style.width = 'auto';
  // Show subtitles
  document.getElementById("subt").style.opacity = 1;
  document.getElementById("subt").textContent = 'ARAMBURO RODRIGUEZ';
  id3 = setTimeout(function() {
    document.getElementById("intro1").style.overflow = 'visible';
    document.getElementById("intro2").style.overflow = 'visible';
  }, 600);
}