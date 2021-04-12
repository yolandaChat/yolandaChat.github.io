class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        YomYomYom
      </p>`;
  }
}

customElements.define(
  "mi-footer", MiFooter);
