// The GOAT Patt Vira
// https://editor.p5js.org/pattvira/sketches/R2QG09tjC
class Wave {
  constructor(p, shift, radius) {
    this.shift = shift; // phase shift between each sine
    this.angle = 0; // angle of sine
    this.movement = 0; // phase shift multiplier
    this.period = 2.1; // visible period
    this.increment = 6; // distance between lines
    this.r = radius; // radius of the circle that defines the sine's amplitude
    this.p = p; // p5 instance
    this.drawDots = false
  }
  
  display() {
    this.p.beginShape();
    for (let i=0; i<=360; i += this.increment) {
      // Map from angle to circle's size
      let x = this.p.map(i, 0, 360, -this.r, this.r);
      // Determine amplitude of sine
      let amplitude = this.r * this.p.sqrt(1 - this.p.pow((x/this.r), 2));
      // Plot each point of the sine with the corresponding phase shift
      let y = amplitude*this.p.sin((i - this.angle + this.shift*this.movement)*this.period);
      // Normally use lines to draw
      if (this.drawDots) {
        this.p.ellipse(x, y, 1, 1);
      } else {
        this.p.vertex(x, y);
      }
    }
    this.p.endShape(); 
  }
  
  move() {
    // Angle increment per fps
    this.angle += 9;
    // Dynamically change phase shift
    this.movement = (this.p.cos(this.angle * 0.5) - 1)*0.5;
  }
}

export const motif = (p) => {
    let r; // radius
    let waves = []; // sine object
    let cnv; // canvas
    let phase = 30; // phase shift between sines
    let numWvs = 6; // number of sines
    let toggle = false;
    let timer = null;

    p.setup = () => {
        // Set size with magic numbers lol
        r = 44 / 128 * parseInt(window.getComputedStyle(p.canvas.parentElement).fontSize);
        cnv = p.createCanvas(2.1*r, 2.1*r);
        p.angleMode(p.DEGREES);
        // Make sines!
        for (let i=0; i<numWvs; i++) {
            waves[i] = new Wave(p, i * phase, r);
        }
        // Set frame rate
        p.frameRate(30);

        cnv.mousePressed(easterEgg);

        cnv.show();
    };

    function resize() {
        // const parent = p.canvas.parentElement;
        // Set size with magic numbers lol
        r = 44 / 128 * parseInt(window.getComputedStyle(p.canvas.parentElement).fontSize);
        // Make sines!
        p.resizeCanvas(2.1*r, 2.1*r);
        for (let i=0; i<numWvs; i++) {
            waves[i].r = r;
        }
    }
    p.windowResized = () => {
      // Debounce resize for iOS
      if(timer) {clearTimeout(timer)};
      timer = setTimeout(resize, 50);
    };

    p.draw = () => {
        p.clear();
        // Center drawing in canvas
        p.translate(p.width * 0.5, p.height * 0.5);
        // Sphere Animation
        p.noFill();
        p.strokeWeight(2);
        p.stroke(window.getComputedStyle(p.canvas.parentElement).getPropertyValue('--tx-color').trim());
        for (let i=0; i<numWvs; i++) {
            waves[i].display();
            waves[i].move();
        }
    };

    function easterEgg(event) {
        event.preventDefault();
        toggle = !toggle;
        for (let i=0; i<numWvs; i++) {
            waves[i].drawDots = toggle;
        }
    }
};