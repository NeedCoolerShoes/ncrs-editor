class NCRSTabList extends HTMLElement {
  constructor() {
    super();
  }

  deselectAll() {
    this.childNodes.forEach(element => {
      if (element instanceof NCRSTab) {
        element.deselect();
      }
    })
  }

  selectedElement() {
    this.childNodes.forEach(element => {
      if (element instanceof NCRSTab && element.isSelected()) {
        return element();
      }
    })
  }
}

class NCRSTab extends HTMLElement {
  constructor() {
    super();
  }

  tabPanel;

  connectedCallback() {
    if (this.dataset.selected) {
      window.addEventListener('load', () => {
        this.select();
      })
    } else {
      window.addEventListener('load', () => {
        this.deselect();
      })
    }
    if (this.dataset.panel) {
      const panel = document.querySelector(this.dataset.panel);
      if (panel instanceof NCRSTabPanel) {
        this.tabPanel = panel; 
      }
    }
    this.classList.add('btn-ncs', 'btn-ncs-text', 'select-none')
    this.addEventListener('click', event => {
      if (event.target.parentElement instanceof NCRSTabList) {
        event.target.parentElement.deselectAll();
      }
      event.target.select()
    })
  }

  select() {
    this.setAttribute('data-selected', true)
    this.classList.add('btn-ncs-active')
    if (this.tabPanel) {
      this.tabPanel.show();
    }
  }

  deselect() {
    this.setAttribute('data-selected', '')
    this.classList.remove('btn-ncs-active')
    if (this.tabPanel) {
      this.tabPanel.hide();
    }
  }

  isSelected() {
    return !!(this.dataset.selected)
  }
}

class NCRSTabPanel extends HTMLElement {
  constructor() {
    super();
  }

  show() {
    this.classList.remove('hidden');
  }

  hide() {
    this.classList.add('hidden');
  }
}


window.customElements.define("ncrs-tab-list", NCRSTabList);
window.customElements.define("ncrs-tab-panel", NCRSTabPanel);
window.customElements.define("ncrs-tab", NCRSTab);