// p5js setup
// Page state
let currentPage = 'home';
let memory = 'home';
let nbPages = 3 - 1.;

// Secret video
var myVideo;

// Click triggers video until next photo
function videoPlay(evt) {
  evt.preventDefault();
  if(myVideo.paused == true) {
    myVideo.play();
    // After 4s stop video
    setTimeout(videoStop, 4430);
  }
}

// Stop video func, if video is near end or beginning, reset
function videoStop() {
  myVideo.pause();
  // Bound video to pause in the photos
  myVideo.currentTime = Math.round(myVideo.currentTime / 4.43) * 4.43;
  if (myVideo.currentTime >= 14) {
    myVideo.currentTime = 0;
  }
}

function setup() {
  // add video object
  myVideo = document.getElementById("portrait-vid");
  // add click event to play
  myVideo.addEventListener("click", videoPlay);
  // mute audio
  myVideo.muted = true;
  myVideo.loop = false;

  logoSetup();
  easterEggSetup();

  let el = document.getElementById("intro1");
  el.addEventListener("transitionstart", function inT() {
    hoverState = 1;
  });
  el.addEventListener("transitionend", function ouT() {
    hoverState = 0;
  });

  document.getElementById("main").addEventListener('scroll', scrollListener);
  // State machine?
  if (currentPage == "home") {
    textChange(0);
    document.getElementById('intro1').addEventListener("transitionend", trigFrame);
  }
  else {
    textChange(4);
    scrollPage();
  }
}

// Set page state following scroll
function scrollListener(evt) {
  // Change color from home to about
  let roo = document.querySelector(':root');
  let normH = this.scrollTop / this.clientHeight;
  // console.log(normH);
  let fontcol;
  let bgcol;

  if (normH < 1) {
    currentPage = "home";
    // Dynamic
    fontcol = lerpColor(color(0,0,255), color(6,41,118), normH);
    bgcol = lerpColor(color(255,254,241), color(253,253,253), normH);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    roo.style.setProperty('--title-pos', map(normH, 0, 1, 33, 66).toString() + "vh");
    roo.style.setProperty('--portrait-pos', map(normH, 0, 1, 0, 166).toString() + "vh");
    // Static
    roo.style.setProperty('--show-portrait', normH);
  }
  else if (normH < 2) {
    roo.style.setProperty('--title-pos', map(normH, 1, 2, 66, 0).toString() + "vh");
    roo.style.setProperty('--show-portrait', map(normH, 1, 2, 1, 0));
    currentPage = "about";
  }
  else if (normH < 4) {
    currentPage = "about";
  }
  else if (normH < 5) {
    fontcol = lerpColor(color(6,41,118), color(0, 0, 0), normH - 4);
    bgcol = lerpColor(color(253,253,253), color(242, 242, 242), normH - 4);
    roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
    roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
    stroke(fontcol);
    currentPage = "about";
  }
  else if (normH < 6) {
    currentPage = "contact";
  }
  else {
    currentPage = "work";
  }
  
  pageState();
}

// For the state events that don't repeat every loop
function pageState() {
  // if page changed
  if (currentPage != memory) {
    let home = document.getElementById("home");
    let intro1 = document.getElementById("intro1");
    let roo = document.querySelector(':root');
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
        roo.style.setProperty('--show-portrait', 0);
        // Set new page cover
        document.title = 'Guillermo A. R.';
        history.pushState({}, 'Guillermo A. R.', '/');
        // Set animation for hiding text
        roo.style.setProperty('--title-width', "0px");
        home.style.opacity = 0;
        myVideo.pause();
        myVideo.currentTime = 0;
        break;
      case "about":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        break;
      case "contact":
        myVideo.pause();
        myVideo.currentTime = 0;
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0vh");
        // Set colors
        fontcol = color(0, 0, 0)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(242,242,242)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        stroke(fontcol);
        break;
      case "work":
        // Set new page cover
        document.title = currentPage.toUpperCase() + ' - Guillermo A. R.';
        history.pushState({}, document.title, '/' + currentPage);
        home.style.opacity = 1;
        // Set title position
        roo.style.setProperty('--title-pos', "0vh");
        // Set colors
        fontcol = color(254, 250, 235)
        roo.style.setProperty('--font-color', fontcol.toString('#rrggbb'));
        bgcol = color(23, 167, 126)
        roo.style.setProperty('--bg-color', bgcol.toString('#rrggbb'));
        stroke(fontcol);
        break;
      default: // 404
        break;
    }
    // Trigger page when transitions stop
    if (hoverState == 0) {
      // Set animation for hiding text
      roo.style.setProperty('--title-width', "0px");
      intro1.addEventListener("transitionend", returnTitle, {once:true});
    }
    else {
      intro1.addEventListener("transitionend", returnTitle, {once:true});
    }
  }
}

function scrollPage() {
  let divContainer = document.getElementById("main");
  switch (currentPage) {
    case "home":
      // Scroll to position
      divContainer.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "about":
      // Scroll to position
      divContainer.scrollTo({
        top: 1 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "contact":
      // Scroll to position
      divContainer.scrollTo({
        top: 5 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
    case "work":
      // Scroll to position
      divContainer.scrollTo({
        top: 6 * divContainer.clientHeight,
        left: 0,
        behavior: "smooth",
      });
      break;
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
      // Split text where O is
      let splitText = titleText.split("O");
      intro1.textContent = splitText[0];
      intro2.textContent = splitText[1];
      subt.style.opacity = 0;
      break;
  }
  let roo = document.querySelector(':root');
  roo.style.setProperty('--title-width', "100vw");
}