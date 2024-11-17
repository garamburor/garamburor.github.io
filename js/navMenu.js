let titleText = null;
let tempTitle = titleText;
// Coordinates for "touch hover"
var lastMove = [0, 0];
// Page state
let currentPage = 'home';

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
  evt.preventDefault();
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
  linkState = 0;
  // For touch devices
  evt.preventDefault();
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let elements = document.getElementsByClassName('title');
  let subt = document.getElementById("subt");
  // Hide elements that don't fit width
  intro1.style.overflow = 'hidden';
  intro2.style.overflow = 'hidden';
  knob.style.overflow = 'hidden';
  // Remove subtitle
  subt.style.opacity = 0;
  // While letters are hidden, set new text and then open back
  tempTitle = evt.target.innerText;
  for(let i = 0; i < elements.length; i++)
  {
    // Hide letters by reducing width
    elements[i].style.width = 0;
    elements[i].removeEventListener("transitionend", enableSmoothTransition);
    elements[i].removeEventListener("transitionend", steadyCover);
    elements[i].addEventListener("transitionend", setTitle);
  }
  evt.target.style.textDecoration = "blue wavy underline";
  evt.target.style.webkitTextDecoration = "blue wavy underline";
}

/* When mouse leaves nav element */
function menuHoverOut(evt) {
  evt.target.style.textDecoration = "transparent wavy underline";
  evt.target.style.webkitTextDecoration = "transparent wavy underline";
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Set animation for hiding text
    elements[i].style.width = 0;
    // Once its done call the main cover
    elements[i].removeEventListener("transitionend", enableSmoothTransition);
    elements[i].removeEventListener("transitionend", setTitle);
    elements[i].addEventListener("transitionend", steadyCover);
  }
}

/* Set main title text */
function setTitle() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let elements = document.getElementsByClassName('title');
  // Make sure G is not there
  document.getElementById("Gknob").textContent = "";
  // Split text where O is
  let splitText = tempTitle.split("O");
  intro1.textContent = splitText[0];
  intro2.textContent = splitText[1];
  for(let i = 0; i < elements.length; i++)
  {
    // set text to be revealed
    elements[i].style.width = "100%";
    elements[i].removeEventListener("transitionend", setTitle);
  }
}

/* Makes overflow visible for prettier window size changes */
function enableSmoothTransition()  {
  linkState = 0;
  document.getElementById("intro1").style.overflow = 'visible';
  document.getElementById("intro2").style.overflow = 'visible';
  let knob = document.getElementById("Gknob");
  knob.style.overflow = 'visible';
  knob.style.transform = "rotate(0deg)";
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    elements[i].removeEventListener("transitionend", enableSmoothTransition);
  }
};

/* Enable element in nav menu */
function enableTab(id) {
  let el = document.getElementById(id);
  el.style.filter = "none";
  el.style.userSelect = "auto";
  el.style.pointerEvents = "auto";
  el.style.cursor = "pointer";
  el.style.fontSize = "min(2.5vw, 15px)";
}

/* Disable element in nav menu */
function removeTab(id) {
  // Set new title
  titleText = id.toUpperCase();
  let el = document.getElementById(id);
  el.style.filter = "blur(1.5px)";
  el.style.userSelect = "none";
  el.style.pointerEvents = "none";
  el.style.cursor = "pointer";
  // Make text a bit smaller
  el.style.fontSize = "min(2.4vw, 13px)";
}

/* Handle nav click */
function menuClick(evt) {
  evt.preventDefault();
  // Remove underline
  evt.target.style.textDecoration = "transparent wavy underline";
  evt.target.style.webkitTextDecoration = "transparent wavy underline";
  enableTab(currentPage);
  currentPage = evt.target.id;
  // Disable current page in nav
  removeTab(evt.target.id);
  if (evt.target.id == "home") {
    // Set new page cover
    document.title = 'Guillermo A. R.';
    history.pushState({}, 'Guillermo A. R.', '/');
  }
  else {
    // Set new page cover
    document.title = evt.target.id.toUpperCase() + ' - Guillermo A. R.';
    history.pushState({}, 'ABOUT - Guillermo A. R.', '/' + evt.target.id);
  }
  steadyCover();
}