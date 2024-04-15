import {RGBToHex} from "../helpers.js";
import {NCRSEditor, NCRSEditorSettings} from "../editor.js";
import {changeColor} from "../color_picker.js";

const defaultColors = [
  "#ffffff", "#000000", "#c0c0c0", "#808080", "#ff0000", "#ffff00", "#808000", "#00ff00",
  "#008000", "#00ffff", "#008080", "#0000ff", "#000080", "#ff00ff", "#800080"
]
const maxLength = 24

class NCRSRecentPalette extends HTMLElement {
  constructor() {
    super();
  }

  recentColors = [];

  connectedCallback() {
    window.addEventListener('load', () => {
      defaultColors.forEach(color => {
        this.addColor(color);
      })
    })

    NCRSEditor.addEventListener('tool-action', () => {
      const currentColor = NCRSEditorSettings.currentColor;
      const color = RGBToHex(currentColor.r, currentColor.g, currentColor.b);
      this.addColor(color);
    })
  }

  addColor(color) {
    if (this.recentColors.includes(color)) { return; }
    this.recentColors.push(color);
    if (this.recentColors.length > maxLength) {
      this.removeColor(this.recentColors[0]);
    }
    const newColor = document.createElement('ncrs-palette-color');
    newColor.setColor(color);
    this.append(newColor);
    newColor.addEventListener('click', event => {
      changeColor(event.target.getAttribute('color'));
    })
  }

  removeColor(color) {
    const index = this.recentColors.findIndex(element => { return color == element; });
    if (index < 0) { return; }
    this.recentColors.splice(index, 1)
    this.querySelector(`[color="${color}"]`).remove()
  }
}

class NCRSBlendPalette extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    window.addEventListener('load', () => {
      const addButton = document.createElement('ncrs-palette-color');
      addButton.innerText = '+';
      addButton.setColor('#2e2e2e')
      addButton.setAttribute('title', 'Add current color to blend palette.');
      addButton.classList.add('select-none', 'text-center')
      addButton.addEventListener('click', () => {
        const currentColor = NCRSEditorSettings.currentColor;
        this.addColor(RGBToHex(currentColor.r, currentColor.g, currentColor.b));
      })
      this.append(addButton);
    })
  }

  addColor(color) {
    if (NCRSEditorSettings.blendPalette.includes(color)) { return; }
    NCRSEditorSettings.blendPalette.push(color);
    const newColor = document.createElement('ncrs-palette-color');
    newColor.setColor(color);
    newColor.setAttribute('title', 'Remove color from blend palette.');
    newColor.classList.add('text-center', 'hover:border-2', 'hover:border-red-900')
    this.prepend(newColor);
    newColor.addEventListener('click', event => {
      this.removeColor(event.target.getAttribute('color'));
    })
  }

  removeColor(color) {
    const index = NCRSEditorSettings.blendPalette.findIndex(element => { return color == element; });
    if (index < 0) { return; }
    NCRSEditorSettings.blendPalette.splice(index, 1)
    this.querySelector(`[color="${color}"]`).remove()
  }
}

class NCRSPaletteColor extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('block', 'w-5', 'h-5', 'rounded-sm', 'cursor-pointer');
    this.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.25)';
  }

  setColor(color) {
    this.setAttribute('color', color);
    this.style.backgroundColor = color;
  }
}

window.customElements.define("ncrs-recent-palette", NCRSRecentPalette);
window.customElements.define("ncrs-blend-palette", NCRSBlendPalette);
window.customElements.define("ncrs-palette-color", NCRSPaletteColor);