/* Switch frames of anim everytime transition ends */
let j = 0;
function trigFrame() {
  j += 1;
  textChange(j);
};

/* Intro text animation sequence */
function textChange(j) {
  let about = document.getElementById("about");
  let contact = document.getElementById("contact");
  let work = document.getElementById("work");
  let intro1 = document.getElementById("intro1");
  let intro2 = document.getElementById("intro2");
  let knob = document.getElementById("Gknob");
  let subt = document.getElementById("subt");

  switch(j) {
    case 0: // greeting
      // disable href links
      about.style.pointerEvents = "none";
      contact.style.pointerEvents = "none";
      work.style.pointerEvents = "none";
      // make text not selectable
      about.style.userSelect = "none";
      contact.style.userSelect = "none";
      work.style.userSelect = "none";
      // keep the same pointer always
      about.style.cursor = "pointer";
      contact.style.cursor = "pointer";
      work.style.cursor = "pointer";
      // Set new title
      intro1.style.opacity = 1;
      intro2.style.opacity = 1;
      intro1.textContent = 'H';
      intro2.textContent = "LA";
      // Adjust centering
      intro1.style.width = '12%';
      intro2.style.width = '12%';
      intro2.style.overflow = 'visible';
      break;
    case 1:
      // Hide
      intro1.style.opacity = 0;
      intro2.style.opacity = 0;
      break;
    case 2: // I'm
      // Set new title
      intro1.style.opacity = 1;
      intro2.style.opacity = 1;
      intro1.textContent = 'S';
      intro2.textContent = "Y";
      // Adjust centering
      intro1.style.width = '10%';
      intro2.style.width = '10%';
      break;
    case 3:
      // Hide
      intro1.style.opacity = 0;
      intro2.style.opacity = 0;
      break;
    case 4: // Cover
      // Remove animation listener
      intro1.removeEventListener("transitionend", trigFrame);
      // Show last title
      intro1.style.opacity = 1;
      intro2.style.opacity = 1;
      intro1.style.overflow = 'hidden';
      intro2.style.overflow = 'hidden';
      knob.style.overflow = 'hidden';
      // enable hyperlinks
      about.style.pointerEvents = "auto";
      contact.style.pointerEvents = "auto";
      work.style.pointerEvents = "auto";
      // make text selectable
      about.style.userSelect = "auto";
      contact.style.userSelect = "auto";
      work.style.userSelect = "auto";
      // pointer back to default
      about.style.cursor = "default";
      contact.style.cursor = "default";
      work.style.cursor = "default";
      // Enable menu
      menuSetup();
      document.getElementById("menu").style.opacity = 1;
      // Set new title
      steadyCover();
      break;
    default:
      break;
  }
  j += 1;
}