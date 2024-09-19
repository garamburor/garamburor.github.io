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
    // make sure position is correct
    //canvas.position(-34,3.25);
    var el = document.getElementById('span1');
    const rect = el.getBoundingClientRect();
    r = 44 / 128 * parseInt(window.getComputedStyle(el).fontSize);
    resizeCanvas(2*r, 2*r);
    canvas.position(rect.left + r * 0.14, rect.top + r * 0.88);
}

function textChange() {
    if (counter >= fps) {
      switch(j) {
        case 0: // Motif intro
          document.getElementById("intro1").textContent = '';
          document.getElementById("intro2").textContent = "";
          document.getElementById("subt").textContent = '';
          child = document.getElementById("span1").getBoundingClientRect();
          parent = document.getElementById("title").getBoundingClientRect();
          document.getElementById("span1").left = parent.width * 0.5 - child.width * 0.5;
          windowResized();
          break;
        case 1: // greeting
          document.getElementById("intro1").textContent = 'H';
          document.getElementById("intro2").textContent = "LA";
          document.getElementById("subt").textContent = '';
          document.getElementById("intro1").style.width = '12%';
          document.getElementById("intro2").style.width = '12%';
          child = document.getElementById("span1").getBoundingClientRect();
          parent = document.getElementById("title").getBoundingClientRect();
          child.left = parent.width * 0.5 - child.width * 0.5;
          windowResized();
          break;
        case 2: // I'm
          document.getElementById("intro1").textContent = 'S';
          document.getElementById("intro2").textContent = "Y";
          document.getElementById("subt").textContent = '';
          document.getElementById("intro1").style.width = '10%';
          document.getElementById("intro2").style.width = '10%';
          child = document.getElementById("span1").getBoundingClientRect();
          parent = document.getElementById("title").getBoundingClientRect();
          document.getElementById("span1").left = parent.width * 0.5 - child.width * 0.5;
          windowResized();
          break;
        case 3: // Cover
          document.getElementById('span1').style.position = "sticky";
          document.getElementById("intro1").textContent = 'GUILLERM';
          document.getElementById("intro2").textContent = "";
          document.getElementById("intro1").style.width = 'auto';
          document.getElementById("intro2").style.width = 'auto';
          document.getElementById("subt").style.opacity = 0;
          document.getElementById("subt").textContent = 'ARAMBURO RODRIGUEZ';
          windowResized();
          break;
        default:
          break;
      }
      j += 1;
      counter = 0;
    }

    if (j < 4) {
      textFadeInNOut();
    } // Final fade in
    else if (j < 5) {
      document.getElementById("intro1").style.opacity = 1. - 1./Math.exp(7 * counter/fps);
      document.getElementById("intro2").style.opacity = 1. - 1./Math.exp(7 * counter/fps);
      document.getElementById("subt").style.opacity = 1. - 1./Math.exp(4 * counter/fps);
    } // End animation
    else {
      clearInterval(id1);
    }
    
    counter += 1; 
}

function textFadeInNOut() {
  document.getElementById("intro1").style.opacity = Math.tanh(2 * Math.sin(Math.PI * counter/fps));
  document.getElementById("intro2").style.opacity = Math.tanh(2 * Math.sin(Math.PI * counter/fps));
}

let id1 = null;
clearInterval(id1);
id1 = setInterval(textChange, 1000/fps);