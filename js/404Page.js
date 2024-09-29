// p5js setup
function setup() {
  // Show title
  document.getElementById("intro1").style.opacity = 1;
  document.getElementById("intro2").style.opacity = 1;
  // Bigger font
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    //elements[i].style.fontSize = 'min(25vw, 200px)';
  }
  logoSetup();
  menuSetup();
  
  // Add features of home navigation
  let home = document.getElementsByClassName('home')[0];
  home.style.opacity = 1;
  home.addEventListener('click', homeClick);
  /*
  // Format subtitles
  let subt = document.getElementById('subt');
  subt.style.opacity = 1;
  subt.style.justifyContent = 'center';
  subt.style.textAlign = 'center';
  subt.style.alignItems = 'center';
  subt.style.float = 'none';
  subt.style.padding = 'auto';
  subt.style.width = 1;
  */
  // Show cover
  steadyCover();
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
  intro1.textContent = '4';
  intro2.textContent = '4';
  title.style.width = 1;
  // Update cover width
  intro1.style.width = 'auto';
  intro2.style.width = 'auto';
  // Show subtitles
  document.getElementById('subt').style.opacity = 1;
  // Remove previous animation listeners
  title.removeEventListener("animationend", enableSmoothTransition);
  title.removeEventListener("animationend", steadyCover);
  // When animation is done, set overflow to visible for prettier window size changes
  title.addEventListener("animationend", enableSmoothTransition);
}

function homeClick(evt) {
  evt.preventDefault();
  let elements = document.getElementsByClassName('title');
  for(let i = 0; i < elements.length; i++)
  {
    // Make sure there are no events for prev animations
    elements[i].removeEventListener("animationend", enableSmoothTransition);
    elements[i].removeEventListener("animationend", setTitle);
    // Set animation for hiding text
    elements[i].style.animation = "widthClose 500ms linear";
    // Once its done call the main cover
    elements[i].addEventListener("animationend", function() { 
      elements[i].textContent = ""
      window.location = "/" ;
    });
  }
}