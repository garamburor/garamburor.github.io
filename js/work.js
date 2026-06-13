import { sequencer } from './sequencer.js'; // Import the specific class
import './photos.js';

class WorkPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        // Render html
        this.render();
        // Allocate sequencer
        this.seq = null;
    }

    connectedCallback() {
        let container = this.shadowRoot.getElementById("seq");
        // Create sequencer if it doesn't exist
        if (!this.seq) {
            this.seq = new p5((p) => {
                p.canvasParentNode = container;
                sequencer(p);
            }, container);
        }
    }

    disconnectedCallback() {
        if (this.seq) {
            this.seq.destroy(); // Kill allocated components
            this.seq.remove(); // Remove canvas
            this.seq = null;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/work.css">
         
        <section id="seq">
            <photo-work></photo-work>
        </section>
        `;
    }
}

customElements.define('work-page', WorkPage);