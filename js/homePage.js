// p5js setup
// Page state
let currentPage = 'home';
let memory = currentPage;
let nbPages = 3 - 1.;

function setup() {
  logoSetup();
  easterEggSetup();
  document.addEventListener('touchmove',function (){
    document.body.scrollTop = 0
  })

  let el = document.getElementById("intro1");
  el.addEventListener("transitionstart", function inT() {
    hoverState = 1;
  });
  el.addEventListener("transitionend", function ouT() {
    hoverState = 0;
  });
  addEventListener('scroll', scrollListener);
  // State machine?
  if (currentPage == "home") {
    textChange(0);
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
  }
  else {
    textChange(4);
  }
}

function scrollListener(evt) {
  // Change color from home to about
  let roo = document.querySelector(':root');
  let normH = window.scrollY / window.innerHeight;
  console.log(normH);
  let fontcol;
  let bgcol;
  let e;

  if (normH <= 1) {
    let ho = document.getElementById("home");
    e = new CustomEvent("click", { target:  ho});
    ho.dispatchEvent(e);
    fontcol = lerpColor(color(0,0,255), color(6,41,118), normH % 1.);
    bgcol = lerpColor(color(255,254,241), color(253,253,253), normH % 1.);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    roo.style.setProperty('--title-pos', map(normH, 0, 1, 33, 66).toString() + "vh");
    stroke(fontcol);
  } else
  if (normH > 1) {
    let ab = document.getElementById("about");
    e = new CustomEvent("click", { target:  ab});
    ab.dispatchEvent(e);
    fontcol = color(6,41,118);
    bgcol = color(253,253,253);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    roo.style.setProperty('--title-pos', map(normH, 1, 2, 66, 0).toString() + "vh");
    stroke(fontcol);
  }
}

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
      knob.style.overflowX = 'hidden';
      knob.textContent = 'G';
      intro1.textContent = 'UILLERM';
      intro2.textContent = '';
      knob.style.transform = "rotate(0deg)";
      break;
    default:
      // Make sure G is not there
      knob.textContent = "";
      // Split text where O is
      let splitText = titleText.split("O");
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