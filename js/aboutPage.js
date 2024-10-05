// p5js setup
function setup() {
    logoSetup();
    document.getElementById("menu").style.opacity = 1;
    menuSetup();
    // Disable current page in nav
    removeTab("about");
    // Add features of home navigation
    homeSetup();
    
    let intro1 = document.getElementById("intro1");
    let intro2 = document.getElementById("intro2");
    // Update cover width
    intro1.style.width = 'auto';
    intro2.style.width = 'auto';
    intro1.style.opacity = 1;
    intro2.style.opacity = 1;
    let knob = document.getElementById("Gknob");
    let title = document.getElementById("title");

    // Make logo adjust to text
    document.getElementById('logo').style.position = "sticky";
    title.style.animation = ""
    knob.style.overflow = 'hidden';
    knob.textContent = '';
    intro1.textContent = 'AB';
    intro2.textContent = 'UT';
  }
  
function steadyCover() {
    // Needed elements
    let intro1 = document.getElementById("intro1");
    let intro2 = document.getElementById("intro2");
    let knob = document.getElementById("Gknob");
    let title = document.getElementById("title");

    // Make logo adjust to text
    document.getElementById('logo').style.position = "sticky";
    title.style.animation = ""
    knob.style.overflow = 'hidden';
    knob.textContent = '';
    intro1.textContent = 'AB';
    intro2.textContent = 'UT';
    title.style.animation = "widthOpen 500ms linear";
    // Remove previous animation listeners
    title.removeEventListener("animationend", steadyCover);
    // When animation is done, set overflow to visible for prettier window size changes
    title.addEventListener("animationend", enableSmoothTransition);
}