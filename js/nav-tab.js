class NavTab extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('click', this.handleEvent);
        this.shadowRoot.addEventListener('mouseover', this.handleEvent);
        this.shadowRoot.addEventListener('mouseout', this.handleEvent);
    }

    disconnectedCallback() {
        this.shadowRoot.removeEventListener('click', this.handleEvent);
        this.shadowRoot.removeEventListener('mouseover', this.handleEvent);
        this.shadowRoot.removeEventListener('mouseout', this.handleEvent);
    }

    handleState(state) {
        this.shadowRoot.querySelectorAll('a').forEach(link => {
            if(link.getAttribute("href") === state){
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    handleEvent = (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute("href");

        if (e.type === 'click') {
            e.preventDefault();
            this.dispatch('nav-page', href);
        } else if (e.type === 'mouseover') {
            this.dispatch('enter-hover', href);
        } else if (e.type === 'mouseout') {
            this.dispatch('leave-hover', href);
        }
    }

    dispatch(name, link) {
        this.dispatchEvent(new CustomEvent(name, {
            detail: { link },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="../css/navtab.css">
        <div></div>
        <nav>
            <ul>
                <li><a href="work">WORK</a></li>
                <li><a href="about">ABOUT</a></li>
                <li><a href="contact">CONTACT</a></li>
            </ul>
        </nav>
        `;
    }
}

customElements.define('nav-tab', NavTab);