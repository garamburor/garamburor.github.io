let titleText = null;
let tempTitle = titleText;
// Variable to check if title is on transition
let hoverState = 0;
// Variables for controlling timed transitions
let id1 = null;
let id2 = null;
let id3 = null;
// Coordinates for "touch hover"
var lastMove = [0, 0];

// Setup required for nav menu
function menuSetup(id) {
  menuEvent("about");
  menuEvent("contact");
  menuEvent("work");
  menuEvent("home");
}

// Listeners to add for menu elements
function menuEvent(id) {
  el = document.getElementById(id);
  el.addEventListener("mouseenter", menuHoverIn);
  el.addEventListener("touchstart", handleTouchStart);
  el.addEventListener("touchmove", saveTouch, false);
  el.addEventListener("touchend", handleTouchEnd);
  el.addEventListener("touchcancel", handleTouchEnd);
  el.addEventListener("mouseout", menuHoverOut);
  el.addEventListener("click", menuClick);
}

/* Store last touch position */
function saveTouch(evt) {
  //evt.preventDefault();
  lastMove[0] = evt.touches[0].clientX;
  lastMove[1] = evt.touches[0].clientY;
}

/* If finger is inside element, go to link, otherwise cancel */
function handleTouchEnd(e) {
  e.preventDefault();
  const rect = document.getElementById(e.target.id).getBoundingClientRect();
  if (lastMove[0] >= rect.x && lastMove[0] <= rect.right) {
    if (lastMove[1] >= rect.y && lastMove[1] <= rect.bottom) {
      e.target.click();
    }
    else {
      menuHoverOut(e);
    }
  }
  else {
    menuHoverOut(e);
  } 
}

function handleTouchStart(evt) {
  // Save coordinate for hover-like effect with touchscreens
  lastMove[0] = evt.touches[0].clientX;
  lastMove[1] = evt.touches[0].clientY;
  menuHoverIn(evt)
}

/* When mouse hovers nav element */
function menuHoverIn(evt) {
  // For touch devices
  evt.preventDefault();
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  // If text is already hidden, show title
  clearTimeout(id1);
  clearTimeout(id2);
  // Remove subtitle
  subt.style.opacity = 0;
  // While letters are hidden, set new text and then open back
  tempTitle = evt.target.innerText;
  // intro1.addEventListener("transitionend", setTitle, {once:true});
  if(intro1.style.maxWidth == "0px" && hoverState) {
    intro1.addEventListener("transitionend", setTitle, {once:true});
  } else if (intro1.style.maxWidth == "0px" && !hoverState) {
    setTitle();
  }
  else {
      // Set width to 0
    intro1.style.maxWidth = 0;
    intro2.style.maxWidth = 0;
    knob.style.maxWidth = 0;
    id1 = setTimeout(setTitle, 505);
  }
  // add underline
  evt.target.style.textDecoration = "var(--font-color) wavy underline";
  evt.target.style.webkitTextDecoration = "var(--font-color) wavy underline";
}

/* When mouse leaves nav element */
function menuHoverOut(evt) {
  clearTimeout(id1);
  clearTimeout(id2);
  // remove underline
  evt.target.style.textDecoration = "transparent wavy underline";
  evt.target.style.webkitTextDecoration = "transparent wavy underline";
  
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");

  // Set animation for hiding text
  intro1.style.maxWidth = 0;
  intro2.style.maxWidth = 0;
  knob.style.maxWidth = 0;
  // Once its done call the main cover
  id2 = setTimeout(returnTitle, 505);
}

/* Set main title text */
function setTitle() {
  // Stop transition events
  clearTimeout(id1);
  clearTimeout(id2);
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");
  // Make sure G is not there
  knob.textContent = "";
  // Split text where O is
  let splitText = tempTitle.split("O");
  intro1.textContent = splitText[0];
  intro2.textContent = splitText[1];
  // Set text display transition
  intro1.style.maxWidth = '100vw';
  intro2.style.maxWidth = '100vw';
  // knob.style.maxWidth = '100vw';
  subt.style.opacity = 0;
}

/* Enable element in nav menu */
function enableTab(id) {
  let el = document.getElementById(id);
  // add listeners
  menuEvent(id);
  // edit style
  el.style.filter = "none";
  el.style.userSelect = "auto";
  el.style.pointerEvents = "auto";
  el.style.cursor = "pointer";
  el.style.fontSize = "3.3vmin";
}

/* Disable element in nav menu */
function removeTab(id) {
  // remove listeners
  el = document.getElementById(id);
  el.removeEventListener("mouseenter", menuHoverIn);
  el.removeEventListener("touchstart", handleTouchStart);
  el.removeEventListener("touchmove", saveTouch, false);
  el.removeEventListener("touchend", handleTouchEnd);
  el.removeEventListener("touchcancel", handleTouchEnd);
  el.removeEventListener("mouseout", menuHoverOut);
  el.removeEventListener("click", menuClick);
  // Set new title
  titleText = id.toUpperCase();
  // Change style
  el.style.filter = "blur(1.5px)";
  el.style.userSelect = "none";
  el.style.pointerEvents = "none";
  el.style.cursor = "pointer";
  // Disable home if returning home
  if (id == "home") {
    let home = document.getElementById("home");
    home.style.opacity = 0;
  }
  // Make text a bit smaller
  //el.style.fontSize = "2.8vmin";
}

/* Handle nav click */
function menuClick(evt) {
  evt.preventDefault();
  // Disable current page in nav
  removeTab(evt.target.id);
  // Stop any other transition
  clearTimeout(id1);
  clearTimeout(id2);
  // Remove underline
  evt.target.style.textDecoration = "transparent wavy underline";
  evt.target.style.webkitTextDecoration = "transparent wavy underline";
  enableTab(currentPage);
  currentPage = evt.target.id;
  // Needed for home transition
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  // Handle page
  if (currentPage == "home") {
        // Set new page cover
      document.title = 'Guillermo A. R.';
      history.pushState({}, 'Guillermo A. R.', '/');
      // Set animation for hiding text
      intro1.style.maxWidth = 0;
      intro2.style.maxWidth = 0;
      knob.style.maxWidth = 0;
  } else {
    // Set new page cover
    document.title = evt.target.id.toUpperCase() + ' - Guillermo A. R.';
    history.pushState({}, document.title, '/' + evt.target.id);
    let home = document.getElementById("home");
    home.style.opacity = 1;
  }
  // Trigger page when transitions stop
  if (hoverState == 0) {
    returnTitle();
  }
  else {
    intro1.addEventListener("transitionend", returnTitle, {once:true});
  }
}