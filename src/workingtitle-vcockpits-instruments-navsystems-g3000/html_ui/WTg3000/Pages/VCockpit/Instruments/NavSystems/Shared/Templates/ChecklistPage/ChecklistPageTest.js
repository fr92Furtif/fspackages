class ChecklistPageTest extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<b>I'm an x-foo-with-markup!</b>";
  }
}
customElements.define('checklist-page-test', ChecklistPageTest);
