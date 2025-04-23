// p5js setup
// Page state
let currentPage = 'home';
let memory = 'home';
let nbPages = 3 - 1.;


// Setup website
function setup() {
  // Don't create a default canvas
  noCanvas()
  // Detect if mousehover has triggered a transition
  let el = document.getElementById("intro1");
  el.addEventListener("transitionstart", function inT() {
    hoverState = 1;
  });
  el.addEventListener("transitionend", function ouT() {
    hoverState = 0;
  });

  // Detect scrolling
  document.getElementById("main").addEventListener('scroll', handleScroll);

  // State machine
  if (currentPage == "home") {
    // Set animation step to begin with
    textChange(0);
    // Trigger animation
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
    document.getElementById('home').style.opacity = 0;
  }
  else {
    // Set animation to begin at last step
    textChange(4);
    // Scroll to location of site accessed
    scrollPage();
  }
}

// Set page state following scroll
function handleScroll(evt) {
  let roo = document.querySelector(':root');
  let normH = this.scrollTop / this.clientHeight;
  let fontcol;
  let bgcol;

  if (normH < 1) {
    // Set new page
    currentPage = "home";
    // Interpolate background and text colors
    fontcol = lerpColor(color(0,0,255), color(6,41,118), normH);
    bgcol = lerpColor(color(255,254,241), color(253,253,253), normH);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    // Update logo color
    instance1.changeStrokeColor(red(fontcol), green(fontcol), blue(fontcol))
    // Interpolate title & portrait photo position
    roo.style.setProperty('--title-pos', map(normH, 0, 1, 33.33, 66.66).toString() + "dvh");
    roo.style.setProperty('--portrait-pos', map(normH, 0, 1, 0, 166).toString() + "dvh");
  }
  else if (normH < 2) {
    // Set new page
    currentPage = "about";
    // Interpolate title position
    roo.style.setProperty('--title-pos', map(normH, 1, 2, 66.66, 0).toString() + "dvh");
  }
  else if (normH < 4) {
    // Set new page
    currentPage = "about";
  }
  else if (normH < 5) {
    // Set new page
    currentPage = "about";
    // Interpolate background and text colors
    fontcol = lerpColor(color(6,41,118), color(0, 0, 0), normH - 4);
    bgcol = lerpColor(color(253,253,253), color(242, 242, 242), normH - 4);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    // Update logo color
    instance1.changeStrokeColor(red(fontcol), green(fontcol), blue(fontcol))
  }
  else if (normH < 6) {
    // Set new page
    currentPage = "contact";
  }
  else {
    // Set new page
    currentPage = "work";
  }
  // Update page state
  pageState();
}

// For the state events that don't repeat every loop
function pageState() {
  // if page changed
  if (currentPage != memory) {
    let home = document.getElementById("home");
    let intro1 = document.getElementById("intro1");
    let roo = document.querySelector(':root');
    let workPage = document.getElementById('work-page');
    // Disable current page in nav
    removeTab(currentPage);
    // Stop any other transition
    clearTimeout(id1);
    clearTimeout(id2);
    // Remove underline
    enableTab(memory);
    memory = currentPage;

    switch (currentPage) {
      case "home":
        // Set new page cover
        document.title = 'Guillermo A. R.';
        history.pushState({}, 'Guillermo A. R.', '/');
        // Set animation for hiding text
        //roo.style.setProperty('--title-width', "0px");
        home.style.opacity = 0;
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        // Stop about photo effect
        instance2.noLoop();
        break;
      case "about":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        // Begin about photo effect
        instance2.loop();
        // Set colors
        fontcol = color(6,41,118)
        instance1.changeStrokeColor(6,41,118)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(253,253,253)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        break;
      case "contact":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0dvh");
        // Set colors
        fontcol = color(0, 0, 0)
        instance1.changeStrokeColor(0, 0, 0)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(242,242,242)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        // Hide grid
        workPage.style.clipPath = "inset(0 0 100% 0 round 0 0 0 0)";
        // Stop about photo effect
        instance2.noLoop();
        break;
      case "work":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0dvh");
        // Set colors
        fontcol = color(254, 250, 235)
        instance1.changeStrokeColor(254, 250, 235)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(23, 167, 126)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        // Reveal grid
        workPage.style.clipPath = "inset(0 0 0 0 round 0 0 0 0)"
        // Stop about photo effect
        instance2.noLoop();
        break;
      default: // 404
        break;
    }
    // Trigger page when transitions stop
    if (!titleLock) {
      if (hoverState == 0) {
        // Set animation for hiding text
        roo.style.setProperty('--title-width', "0px");
        intro1.addEventListener("transitionend", returnTitle, {once:true});
      }
      else {
        intro1.addEventListener("transitionend", returnTitle, {once:true});
      }
    }
    else {
      // Once its done call the main cover
      id2 = setTimeout(function () { returnTitle(), titleLock = 0; }, 405);
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
      home.style.opacity = 0;
      break;
    default:
      // Make sure G is not there
      knob.textContent = "";
      // Rotate
      knob.style.transform = "rotate(45deg)";
      // Split text where O is
      let splitText = titleText.split("O");
      intro1.textContent = splitText[0];
      intro2.textContent = splitText[1];
      subt.style.opacity = 0;
      break;
  }
  let roo = document.querySelector(':root');
  roo.style.setProperty('--title-width', "100dvw");
}