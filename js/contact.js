class ContactPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/contact.css">
        <section id="contact-page">
            <div id="blank"></div>
            <div id="contact-info">
                <div class="contact-links">
                    <a href="https://www.linkedin.com/in/aramburog/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div class="contact-links">
                    <a href="mailto:hola@guillermo.works" target="_blank" rel="noopener noreferrer">Mail</a>
                </div>
                <div class="contact-links">
                    <a href="https://github.com/garamburor" target="_blank" rel="noopener noreferrer">Github</a>
                </div>
            </div>
            <footer>
            <span>Hecho con amor en tiempos de desamor © 2026</span>
            </footer>
        </section>
        `;
    }
}

customElements.define('contact-page', ContactPage);