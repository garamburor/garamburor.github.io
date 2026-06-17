import { motif } from './motif.js'; // Import the specific class

class SiteTitle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // To avoid jitter with mouse interaction
        this.render();
        this.motif = null;
        this.state;
        this.test = null;
        this.width = false;
        this.timer1 = null;
        this.timer2 = null;
    }

    connectedCallback() {
        let container = this.shadowRoot.getElementById("logo");
        
        // Create sequencer if it doesn't exist
        if (!this.motif) {
            this.motif = new p5((p) => {
                p.canvasParentNode = container;
                motif(p);
            }, container);
        }
    }

    disconnectedCallback() {
        // Remove the sketch when the component is removed
        if (this.motif) {
            this.motif.remove();
        }
        // Remove timer
        if (this.timer1) { clearTimeout(this.timer1) };
        if (this.timer2) { clearTimeout(this.timer2) };
    }

    openText(e) {
        //this.debounceTitle();
    }

    // Function for when page will change
    setState(id) {
        // Close text
        let intro1 = this.shadowRoot.getElementById("intro1");
        let intro2 = this.shadowRoot.getElementById("intro2");
        intro1.style.maxWidth = "0px";
        intro2.style.maxWidth = "0px";
        this.width = false;
        this.state = id.toUpperCase();
        this.debounceTitle();
    }

    debounceState(id) {
        if (this.timer1) clearTimeout(this.timer1);
            this.timer1 = setTimeout(() => {
            this.setState(id);
        }, 410);
    }

    // Function for when title is closed and title can change
    setTitle() {
        if (!this.width) {
            // Needed elements
            let intro1 = this.shadowRoot.getElementById("intro1");
            let intro2 = this.shadowRoot.getElementById("intro2");
            
            // Open
            intro1.style.maxWidth = "100dvw";
            intro2.style.maxWidth = "100dvw";
            // Split text where O is
            let splitText = this.state.split(/O(.*)/s) //.split("O");
            intro1.textContent = splitText[0];
            intro2.textContent = splitText[1];
            this.width = true;
        }
    }

    debounceTitle() {
        if (this.timer2) clearTimeout(this.timer2);
            this.timer2 = setTimeout(() => {
            this.setTitle();
        }, 410);
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/title.css">
        <div class="title" id="title-container">
          <span class="sides" id="intro1">W</span>
          <span id="logo"></span>
          <span class="sides" id="intro2">RK</span>
        </div>
        `;
    }
}

customElements.define('site-title', SiteTitle);