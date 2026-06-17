class ContactPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.handleState(true);
    }
    
    unload() {
        this.handleState(false);
        return this.currentAnim.finished;
    }

    handleState(page) {
        let children = this.shadowRoot.querySelector('#container').children;
        if (page) {
            for (let i = 0; i < children.length; i++) {
                this.currentAnim = children[i].animate(
                    [
                        { opacity: 0},
                        { opacity: 1}
                    ], {
                        duration: 300,
                        easing: 'ease-in',
                        iterations: 1,
                        fill: 'both',
                });
            }
        } else {
            for (let i = 0; i < children.length; i++) {
                this.currentAnim = children[i].animate(
                    [
                        { opacity: 1},
                        { opacity: 0}
                    ], {
                        duration: 300,
                        easing: 'ease-in',
                        iterations: 1,
                        fill: 'both',
                });
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/contact.css">
        <section id="container">
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
            <span>Hecho con amor © 2026</span>
            </footer>
        </section>
        `;
    }
}

customElements.define('contact-page', ContactPage);