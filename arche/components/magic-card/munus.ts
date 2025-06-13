class MagicCard extends HTMLElement {
  static get observedAttributes() {
    return ['image', 'title'];
  }

  image: string = '';
  title: string = '';

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('bento-card');
    this.render();
  }

  attributeChangedCallback(name:string, _old:string, value:string) {
    if (name === 'image') this.image = value || '';
    if (name === 'title') this.title = value || '';
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="card-inner">
        ${this.image ? `<img src="${this.image}" alt="${this.title}" />` : ''}
        <h2>${this.title}</h2>
        <div class="card-content"></div>
      </div>
    `;
  }
}

customElements.define('magic-card', MagicCard);