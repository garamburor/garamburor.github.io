// p5js setup
// Page state
let currentPage = 'home';
let memory = currentPage;

function setup() {
  logoSetup();
  easterEggSetup();
  
  // addEventListener('scroll', scrollListener);
  // State machine?
  if (currentPage == "home") {
    textChange(0);
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
  }
  else {
    pageState();
  }
}
/*
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
  roo.style.setProperty('--title-pos', (55 + normH * 35).toString() + "vh");

  // Reduce width
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  // intro1.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";
  // intro2.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";
  // knob.style.maxWidth = ((1. - Math.sin(Math.PI * normH)) * 100).toString() + "vw";
  if (normH < 0.5) {  currentPage = "home" };
  if (normH >= 0.5) {  currentPage = "about" };
  if (currentPage != memory) {
    memory = currentPage;
    intro1.style.maxWidth = 0;
    intro2.style.maxWidth = 0;
    knob.style.maxWidth = 0;
    intro1.addEventListener("transitionend", pageState, {once:true});
  }
}
*/
function pageState() {
  clearTimeout(id1);
  clearTimeout(id2);
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  let home = document.getElementById("home");

  switch(currentPage) {
    case "home":
      // Enable subtitles
      subt.textContent = "ARAMBURO RODRIGUEZ";
      subt.style.opacity = 1;
      // Show main title
      knob.style.overflow = 'hidden';
      knob.textContent = 'G';
      intro1.textContent = 'UILLERM';
      intro2.textContent = '';
      knob.style.transform = "rotate(0deg)";
      break;
    default:
      // Make sure G is not there
      knob.textContent = "";
      // Split text where O is
      let splitText = tempTitle.split("O");
      intro1.textContent = splitText[0];
      intro2.textContent = splitText[1];
      subt.style.opacity = 0;
      break;
  }
  /* subt.addEventListener('transitionend', function byeSubs() {
    subt.textContent = '';
  },{once: true}) */
  intro1.style.maxWidth = '100vw';
  intro2.style.maxWidth = '100vw';
  knob.style.maxWidth = '100vw';
}