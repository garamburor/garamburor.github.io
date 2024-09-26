let titleText = null;

// Setup required for nav menu
function menuSetup(id) {
  menuEvent("about");
  menuEvent("contact");
  menuEvent("work");
  menuEvent("hme");
}

// Listeners to add for menu elements
function menuEvent(id) {
  document.getElementById(id).addEventListener("mouseenter", menuHoverIn);
  document.getElementById(id).addEventListener("touchstart", menuHoverIn);
  document.getElementById(id).addEventListener("touchend", function(e) {e.preventDefault(); window.location = e.currentTarget.href });
  document.getElementById(id).addEventListener("touchcancel", menuHoverOut);
  document.getElementById(id).addEventListener("mouseout", menuHoverOut);
}

/* When mouse hovers nav element */
function menuHoverIn(evt) {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let title = document.getElementById("title");
  let subt = document.getElementById("subt");
  // For touch devices
  evt.preventDefault();
  // Hide elements that don't fit width
  intro1.style.overflow = 'hidden';
  intro2.style.overflow = 'hidden';
  knob.style.overflow = 'hidden';
  // Hide letters by reducing width
  title.style.animation = "widthClose 500ms linear";
  // Remove previous listeners
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", steadyCover);
  title.removeEventListener("animationend", toHome);
  // While letters are hidden, set new text and then open back
  titleText = evt.target.innerText;
  title.addEventListener("animationend", setTitle);
  // Remove subtitle
  subt.style.opacity = 0;
}

/* Set main title text */
function setTitle() {
  // Needed elements
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let title = document.getElementById("title");
  // Make sure G is not there
  document.getElementById("Gknob").textContent = "";
  // Split text where O is
  let splitText = titleText.split("O");
  intro1.textContent = splitText[0];
  intro2.textContent = splitText[1];
  // set text to be revealed
  title.style.animation = "widthOpen 500ms linear"
}

/* Makes overflow visible for prettier window size changes */
function enableSmoothTransition()  {
  document.getElementById("intro1").style.overflow = 'visible';
  document.getElementById("intro2").style.overflow = 'visible';
  document.getElementById("Gknob").style.overflow = 'visible';
};

/* When mouse leaves nav element */
function menuHoverOut() {
  let title = document.getElementById("title");
  // Make sure there are no events for prev animations
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", setTitle);
  title.removeEventListener("animationend", toHome);
  // Set animation for hiding text
  title.style.animation = "widthClose 500ms linear";
  // Once its done call the main cover
  title.addEventListener("animationend", steadyCover);
}

function goHome(evt) {
  // Don't go to link yet
  evt.preventDefault();
  let title = document.getElementById("title");
  // Make sure there are no events for prev animations
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", setTitle);
  title.removeEventListener("animationend", steadyCover);
  title.removeEventListener("animationend", toHome);
  // Set animation for hiding text
  title.style.animation = "widthClose 500ms linear";
  // Once its done call the main cover
  title.addEventListener("animationend", toHome);
}

function toHome() {
  window.location.href="/";
  title.style.animation = "";
}