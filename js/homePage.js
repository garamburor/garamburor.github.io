// p5js setup
// Page state
let currentPage = 'home';
let memory = currentPage;
let nbPages = 3 - 1.;

function setup() {
  logoSetup();
  easterEggSetup();

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

// Set page state following scroll
function scrollListener(evt) {
  // Change color from home to about
  let roo = document.querySelector(':root');
  let normH = window.scrollY / window.innerHeight;
  console.log(normH);
  let fontcol;
  let bgcol;

  if (normH <= 0.5) {
    /*
    let ho = document.getElementById("home");
    e = new CustomEvent("click", { target:  ho});
    ho.dispatchEvent(e);
    */
    currentPage = "home";
    // Dynamic
    fontcol = lerpColor(color(0,0,255), color(6,41,118), normH  * 2);
    bgcol = lerpColor(color(255,254,241), color(253,253,253), normH * 2);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--title-pos', map(normH, 0, 0.5, 33, 66).toString() + "vh");
    roo.style.setProperty('--portrait-pos', map(normH, 0, 0.5, 0, 33).toString() + "vh");
    // Static
    roo.style.setProperty('--show-portrait', 0);
  } else
  if (normH > 0.5 && normH <= 0.7) {
    // Static
    currentPage = "home";
    fontcol = color(6,41,118);
    bgcol = color(253,253,253);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--title-pos', "66vh");
    roo.style.setProperty('--portrait-pos', "33vh");
    roo.style.setProperty('--show-portrait', 1);
  } else
  if (normH > 0.7 && normH <= 0.8) {
    // Static
    currentPage = "about";
    fontcol = color(6,41,118);
    bgcol = color(253,253,253);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--title-pos', "66vh");
    roo.style.setProperty('--portrait-pos', "33vh");
    roo.style.setProperty('--show-portrait', 1);
  } else
  if (normH > 0.8 && normH <= 1.3) {
    // Static
    currentPage = "about";
    fontcol = color(6,41,118);
    bgcol = color(253,253,253);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--show-portrait', 0);
    // Dynamic
    roo.style.setProperty('--title-pos', map(normH, 0.8, 1.3, 66, 0).toString() + "vh");
    roo.style.setProperty('--portrait-pos', map(normH, 0.8, 1.3, 33, 101).toString() + "vh");
  } else
  if (normH > 1.3) {
    // Static
    currentPage = "about";
    fontcol = color(6,41,118);
    bgcol = color(253,253,253);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--title-pos', "0vh");
    roo.style.setProperty('--portrait-pos', "101vh");
    roo.style.setProperty('--show-portrait', 0);
  }
  pageState();
}

// For the state events that don't repeat every loop
function pageState() {
  // if page changed
  if (currentPage != memory) {
    memory = currentPage;
    let page;
    let e;
    switch (currentPage) {
      case "home":
        page = document.getElementById("home");
        e = new CustomEvent("click", { target:  page});
        page.dispatchEvent(e);
        break;
      case "about":
        page = document.getElementById("about");
        e = new CustomEvent("click", { target:  page});
        page.dispatchEvent(e);
        break;
      case "contact":
        break;
      case "work":
        break;
      default: // 404
        break;
    }
  }
}

// return to main title
function returnTitle() {
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