let r = 0; 
let waves = []; 
let num = 6; 
let step = 30;
let msTime = 0;
let j = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(35);
  windowResized();
  stroke(0, 0, 255);
  angleMode(DEGREES);
  for (let i=0; i<num; i++) {
    waves[i] = new Wave(i*step);
  }
}

function draw() {
  // msTime = Math.floor(millis() * 1e-3);
  translate(width/2, height/2);
  canvas.clear();
  // Sphere Animation
  sphereAnim();
}

function sphereAnim() {
  noFill();
  strokeWeight(1);
  for (let i=0; i<num; i++) {
    waves[i].display();
    waves[i].move();
  }
}
// Always resize the canvas to fill the browser window.
function windowResized() {
    // make sure position is correct
    //canvas.position(-34,3.25);
    var el = document.getElementById('span1');
    const rect = el.getBoundingClientRect();
    r = 44 / 128 * parseInt(window.getComputedStyle(el).fontSize);
    resizeCanvas(2*r, 2*r);
    canvas.position(rect.left + r * 0.14, rect.top + r * 0.88);
}

function introAnim() {
    switch(j) {
      case 0: // Motif intro
        var el = document.getElementById('span1');
        const rect = el.getBoundingClientRect();
        canvas.position(width * 0.5, rect.top + r * 0.88);
        document.getElementById("intro1").textContent = '';
        document.getElementById("intro2").textContent = "";
        document.getElementById("subt").textContent = '';
        windowResized();
        break;
      case 2: // greeting
        document.getElementById("intro1").textContent = 'H';
        document.getElementById("intro2").textContent = "LA";
        document.getElementById("subt").textContent = '';
        windowResized();
        break;
      case 3: // I'm
        document.getElementById("intro1").textContent = 'S';
        document.getElementById("intro2").textContent = "Y";
        document.getElementById("subt").textContent = '';
        windowResized();
        break;
      case 4: // Cover
        document.getElementById("intro1").textContent = 'GUILLERM';
        document.getElementById("intro2").textContent = "";
        document.getElementById("subt").textContent = 'ARAMBURO RODRIGUEZ';
        windowResized();
        clearInterval(id);
        break;
      default:
        break;
    }
    
    // location.reload();
    j += 1; 
}

let id = null;
//clearInterval(id);
id = setInterval(introAnim, 1000);