class NotFound extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    render() {
        //sthis.shadowRoot.innerHTML = ``;
    }
}

customElements.define('error-page', NotFound);