import {NCRSEditor} from "../editor.js"

class NCRSToolList extends HTMLElement {
  constructor() {
    super();
  }

  deselectAll() {
    this.childNodes.forEach(element => {
      if (element instanceof NCRSTool) {
        element.deselect();
      }
    })
  }

  selectedElement() {
    this.childNodes.forEach(element => {
      if (element instanceof NCRSTool && element.isSelected()) {
        return element();
      }
    })
  }
}

class NCRSToolConfig extends HTMLElement {
  constructor() {
    super();
  }

  show() {
    this.classList.add('flex');
    this.classList.remove('hidden');
  }

  hide() {
    this.classList.remove('flex');
    this.classList.add('hidden');
  }
}

class NCRSTool extends HTMLElement {
  constructor() {
    super();
  }

  toolConfig;
  
  connectedCallback() {
    if (this.hasAttribute("selected")) {
      window.addEventListener('load', () => {
        this.select();
      })
    } else {
      window.addEventListener('load', () => {
        this.deselect();
      })
    }
    if (this.hasAttribute("config")) {
      const config = document.querySelector(this.getAttribute("config"));
      if (config instanceof NCRSToolConfig) {
        this.toolConfig = config; 
      }
    }
    this.addEventListener('click', event => {
      if (event.target.parentElement instanceof NCRSToolList) {
        event.target.parentElement.deselectAll();
      }
      event.target.select()
    })
  }

  select() {
    this.setAttribute('selected', true)
    this.classList.add('btn-ncs-active')
    this.dispatchEvent(new CustomEvent('select'))
    if (this.toolConfig) {
      this.toolConfig.show();
    }
    if (this.hasAttribute("tool")) {
      NCRSEditor.SetCurrentTool(this.getAttribute("tool"));
    }
  }

  deselect() {
    this.setAttribute('selected', '')
    this.classList.remove('btn-ncs-active')
    if (this.toolConfig) {
      this.toolConfig.hide();
    }
    this.dispatchEvent(new CustomEvent('deselect'))
  }

  isSelected() {
    return !!(this.getAttribute("selected"))
  }
}

window.customElements.define("ncrs-tool-list", NCRSToolList);
window.customElements.define("ncrs-tool-config", NCRSToolConfig);
window.customElements.define("ncrs-tool", NCRSTool);