# MAGIC: Language Code Not Included ✨

**MAGIC** is an experimental frontend micro-framework designed to prove that magic exists in simplicity. Built with only HTML, CSS, and TypeScript, it focuses on clarity, security, and developer empowerment.

---

## 💡 Philosophy

* **No virtual DOM**
* **No framework dependencies**
* **No frontend libraries**
* **No runtime bloat**
* Just your components, your logic, and a little bit of magic.

---

## 🔹 Stack

* HTML5
* CSS3
* TypeScript (compiled via Bun)
* No JSON APIs, no fetch, no routing

---

## 🧰 Folder Architecture

```plaintext
arche/
├ index.html         -> Entry point (DEV)
├ styles/            -> Global styles
├ images/            -> Static images
├ components/
│  └ bento-card/
│     ├ munus.ts     -> Component logic
└ core/
   └ LIBRIS.ts       -> Central validation, security and rules

scripts/
├ nexus.ts           -> Dev/Prod runner + file watcher + builder
└ build.ts (optional legacy build file)

calvaria/              -> PROD output (compiled and ready)
```

---

## 📚 How To Use

### 1. Install [Bun](https://bun.sh)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Init the project (first time)

```bash
bun init
```

### 3. Run MAGIC (DEV mode + auto-rebuild)

```bash
bun run scripts/nexus.ts
```

### 4. Build for production (outputs to `calvaria/`)

```bash
bun run scripts/nexus.ts --prod
```

---

## 🚀 Features

### ✈ Custom Component System

Write components like this:

```ts
class MagicCard extends HTMLElement {
  static get observedAttributes() { return ['image', 'title']; }
  ...
}

customElements.define('bento-card', BentoCard);
```

### ⚡ Real-Time Error Validation

Defined in `core/LIBRIS.ts`, the framework validates components based on a registry:

```ts
const magicRegistry = {
  'magic-card': ['image']
};
```

If a required attribute is missing, it injects a friendly error:

```html
<magic-error>
  ⚠️ Missing "image" attribute in <bento-card title="No Image">
</magic-error>
```

### 🔐 Security Included

* Escapes potentially dangerous HTML
* `sanitizeText()` checks against tags like `<script>`, `<iframe>`, etc.
* `hashData()` provides SHA-256 hashing (used for any future integrity checks)

---

## 🔭 Dev Experience

* Live rebuild with `fs.watch`
* Zero configuration build process
* Instant updates to `calvaria/`
* Human-first error reporting

---

## 🌊 Example

```html
<bento-card title="No Image">
  This card is incomplete
</bento-card>

<bento-card title="Rocko" image="./images/sample.png">
  Looks great!
</bento-card>
```

---

## 🔧 Core Spellbook

* `arche/` as development sandbox
* `calvaria/` as production output
* `munus.ts` for per-component logic
* `LIBRIS.ts` with:

  * ✅ Attribute validation
  * ✅ Human-friendly errors
  * ✅ `<magic-error>` rendering
  * ✅ Visual component highlight
* `nexus.ts` unified build + watch + serve
* Static asset copying (images, styles)
* Hashing support (`hashData`)
* Dangerous HTML protection (`sanitizeText`)

---

## 🔠 Principles

* **KISS** – Keep It Simple, Stupid
* **DRY** – Don’t Repeat Yourself
* **YAGNI** – You Ain’t Gonna Need It

---

## 🛡 License

This is an experimental framework by developers, for developers.
Use it, fork it, break it, and make it your own.

---

## ✨ MAGIC: Language Code Not Included.

Because sometimes... **the best code is the one you write yourself.**
