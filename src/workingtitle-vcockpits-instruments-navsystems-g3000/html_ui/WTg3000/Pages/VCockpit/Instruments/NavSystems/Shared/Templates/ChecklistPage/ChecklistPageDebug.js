class ChecklistPageDebug extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h1>Hello, World!</h1>`;
    }
}
customElements.define('checklist-page-debug', ChecklistPageDebug);
