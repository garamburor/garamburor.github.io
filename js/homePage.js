// p5js setup
function setup() {
  logoSetup();
  easterEggSetup();
  
  addEventListener('scroll', scrollListener);
  // State machine?
  switch (currentPage) {
    case "home":
      textChange(0);
      document.getElementById('intro1').addEventListener("transitionend", trigFrame);
      break;
    case "about":
      // Add features of home navigation
      document.getElementById("home").textContent = "HOME";
      break;
  }
}

function scrollListener(evt) {
  // Change color from home to about
  let roo = document.querySelector(':root');
  let normH = window.scrollY / window.innerHeight;
  let fontcol = lerpColor(color(0,0,255), color(6,41,118), normH);
  let bgcol = lerpColor(color(255,254,241), color(253,253,253), normH);
  roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
  roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
  stroke(fontcol);
  
  // Change title pos from home to about
  let title = document.getElementById("title-container");
  title.style.height = (60 + normH * 40).toString() + "vh";
  // Reduce width
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  // intro1.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";
  // intro2.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";
  // knob.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";

  if(normH < 0.5) {
    // Enable subtitles
    subt.style.opacity = 1;
    // Show main title
    knob.style.overflow = 'hidden';
    knob.textContent = 'G';
    intro1.textContent = 'UILLERM';
    intro2.textContent = '';
    // subt.textContent = 'ARÁMBURO RODRÍGUEZ';
    // Disable home in nav
    home.style.opacity = 0;
    removeTab("home");
    enableTab("about");
    intro1.style.maxWidth = '100vw';
    intro2.style.maxWidth = '100vw';
    knob.style.maxWidth = '100vw';
  }
  if (normH == 0.5) {
    intro1.style.maxWidth = 0;
    intro2.style.maxWidth = 0;
    knob.style.maxWidth = 0;
  }
  if (normH > 0.5) {
    // Activate home in nav
    home.style.opacity = 1;
    enableTab("home");
    removeTab("about");
    // Remove knob
    knob.textContent = '';
    // Write new title
    titleText = "ABOUT"
    let splitText1 = titleText.split("O");
    intro1.textContent = splitText1[0];
    intro2.textContent = splitText1[1];
    intro1.style.maxWidth = '100vw';
    intro2.style.maxWidth = '100vw';
    knob.style.maxWidth = '100vw';
  }
}

function steadyCover() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  let home = document.getElementById("home");
  let roo = document.querySelector(':root');

  // Make logo adjust to text
  document.getElementById('logo').style.position = "sticky";

  intro1.style.maxWidth = '100vw';
  intro2.style.maxWidth = '100vw';
  knob.style.maxWidth = '100vw';
  intro1.addEventListener("transitionend", enableSmoothTransition);
}