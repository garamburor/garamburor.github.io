import { carousel } from './carousel.js'; // Import the specific class

class Photos extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.carousel;
    }

    async unload() {
        return Promise.resolve();
    }

    connectedCallback() {
        let container = this.shadowRoot.getElementById("container");
        // Create sequencer if it doesn't exist
        if (!this.carousel) {
            this.carousel = new p5((p) => {
                p.canvasParentNode = container;
                carousel(p);
            }, container);
        }
    }

    disconnectedCallback() {
        if (this.carousel) {
            this.carousel.remove(); // Remove canvas
            this.carousel = null;
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/carousel.css">
        <section id="container">
        </section>
        `;
    }
}

customElements.define('photo-page', Photos);