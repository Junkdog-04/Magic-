const magicRegistry: Record<string, string[]> = {
  'magic-card': ['image']
};

const sanitizeText = (text: string): string => {
  const risky = /<(script|img|iframe|object|embed|svg|on\w+)[^>]*?>/gi;
  return risky.test(text)
    ? text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    : text;
};

const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, "0")).join("");
};

const renderMagicError = (el: Element, missingAttr: string, context: string, hint: string) => {
  if (el.previousElementSibling?.tagName.toLowerCase() === 'magic-error') return;

  const tagName = el.tagName.toLowerCase();
  const descriptor = Array.from(el.attributes)
    .map(attr => `${attr.name}="${attr.value}"`)
    .join(' ');

  const error = document.createElement('magic-error') as any;
  (error as any)._message = `Missing "${missingAttr}" attribute in ${tagName} ${descriptor}`;
  (error as any)._hint = hint;
  el.classList.add('magic-error-target');
  el.insertAdjacentElement('beforebegin', error);
};


const clearMagicError = (el: Element) => {
  if (el.previousElementSibling?.tagName.toLowerCase() === 'magic-error') {
    el.previousElementSibling.remove();
  }
  el.classList.remove('magic-error-target'); 
};

const validateMagicComponent = (el: Element, requiredAttrs: string[], context: string) => {
  const missing = requiredAttrs.find(attr => !el.getAttribute(attr));
  if (missing) {
    const tagName = el.tagName.toLowerCase();
    renderMagicError(
      el,
      `Missing "${missing}" attribute in ${tagName}`,
      context,
      `Add a ${missing}="..." attribute to your ${tagName}.`
    );
  } else {
    clearMagicError(el);
  }
};

const observeMagicComponents = (tagName: string, requiredAttrs: string[]) => {
  customElements.whenDefined(tagName).then(() => {
    const elements = document.querySelectorAll(tagName);
    elements.forEach(el => {
      const validate = () => validateMagicComponent(el, requiredAttrs, tagName);
      const observer = new MutationObserver(() => setTimeout(validate, 0));
      observer.observe(el, { attributes: true });
      setTimeout(validate, 0);
    });
  });
};

Object.entries(magicRegistry).forEach(([tag, attrs]) => {
  observeMagicComponents(tag, attrs);
});

customElements.define('magic-error', class extends HTMLElement {
  _message = '';
  _hint = '';

  connectedCallback() {
    this.style.cssText = `
      display: block;
      background: #3e0066;
      color: #00ff90;
      border: 1px solid #7400b8;
      border-left: 6px solid #ff00cc;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
    `;

    this.innerHTML = `
      ⚠️ <strong>${this._message}</strong><br/>
      <small style="color:#cccccc">${this._hint}</small>
    `;
  }
});
