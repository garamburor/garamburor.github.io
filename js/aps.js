class APS extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        // Load SVG
        let response = await fetch('../media/AP-7.svg');
        let svgText = await response.text();
        // Create div to hold the SVG
        let ob1 = document.createElement("div");
        this.shadowRoot.innerHTML = svgText;
        // Add events for interaction with knobs
        let play = this.shadowRoot.getElementById("play");
        play.style.cursor = "pointer";
        let stop = this.shadowRoot.getElementById("stop");
        stop.style.cursor = "pointer";
        let back = this.shadowRoot.getElementById("back");
        back.style.cursor = "pointer";
        let frwrd = this.shadowRoot.getElementById("frwrd");
        frwrd.style.cursor = "pointer";
        let vol = this.shadowRoot.getElementById("slider");
        vol.style.cursor = "pointer";

        let wheel = this.shadowRoot.getElementById("wheel");
        wheel.style.transform = "rotate(40)";
    }

    disconnectedCallback() {
    }

    render() {
    }
}

customElements.define('ap7-elm', APS);
