let r = 0; 
// Sin array
let waves = []; 
// Number of sines
let num = 6;

let sketch1 = (p) => {
  class Wave {
    constructor(shift) {
      this.shift = shift; // phase shift between each sine
      this.angle = 0; // angle of sine
      this.movement = 0; // phase shift multiplier
      this.period = 2.1; // visible period
      this.increment = 6; // distance between lines
    }
    
    display() {
      p.beginShape();
      for (let i=0; i<=360; i += this.increment) {
        // Map from angle to circle's size
        let x = p.map(i, 0, 360, -r, r);
        // Determine amplitude of sine
        let amplitude = r * p.sqrt(1 - p.pow((x/r), 2));
        // Plot each point of the sine with the corresponding phase shift
        let y = amplitude*p.sin((i - this.angle + this.shift*this.movement)*this.period);
        // Normally use lines to draw
        if (gameMode == 0) {
          p.vertex(x, y);
        } // For easter egg, use discrete points
        else {
          p.ellipse(x, y, 1, 1);
        }
      }
      p.endShape(); 
    }
    
    move() {
      // Angle increment per fps
      this.angle += 9;
      // Dynamically change phase shift
      this.movement = (p.cos(this.angle * 0.5) - 1)*0.5;
    }
  }

  /* Sphere animation */
  // sine amplitude (radius of sphere)
  
  // Phase shift between sines 
  let step = 30;
  p.setup = () => {
    // Update size of logo based on font size
    sphereSize();
    // Set canvas size to diameter of circle
    p.createCanvas(2.1*r, 2.1*r);
    p.changeStrokeColor(0, 0, 255);
    p.frameRate(30);
    // Set canvas inside span1
    // canvas.parent('logo');
    // Set angle with degrees instead of radians
    p.angleMode(p.DEGREES);
    // Create wave objects
    for (let i=0; i<num; i++) {
      waves[i] = new Wave(i*step);
      if(localStorage.hasOwnProperty('logo' + toString(i))) {
        waves[i].angle = JSON.parse(localStorage.getItem('logo' + toString(i)));
      }
    }
    localStorage.clear();
    easterEggSetup();
  };

  p.draw = () => {
    p.clear();
    // Center drawing in canvas
    p.translate(p.width * 0.5, p.height * 0.5);
    // Sphere Animation
    p.sphereAnim();
    };
  
  p.changeStrokeColor = (r, g, b) => {
    p.stroke(r, g, b);
  };

  /* Sphere animation loop */
  p.sphereAnim = () =>  {
    p.noFill();
    p.strokeWeight(2);
    for (let i=0; i<num; i++) {
      waves[i].display();
      waves[i].move();
    }
  }
    
  /* Adjust to window size  dynamically */
  p.windowResized = () => {
    // Update size of logo based on font size
    sphereSize();
    p.resizeCanvas(2.1*r, 2.1*r);
  }
};

/* Save states of logo before leaving */
window.onbeforeunload = function() { 
  for (let i=0; i<num; i++) {
    localStorage.setItem('logo' + toString(i),  JSON.stringify(waves[i].angle));
  }
}

/* Update logo size to match font size */
function sphereSize() {
  // Get element that holds O in title
  let el = document.getElementById('logo');
  // Compute radius of logo based on font size of O
  r = 44 / 128 * parseInt(window.getComputedStyle(el).fontSize);
}

let instance1 = new p5(sketch1, 'logo');