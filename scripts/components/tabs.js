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

  selectedClasses = ['bg-ncs-gray-600', 'tab-ncs-active']
  deselectedClasses = ['bg-ncs-gray-800']
  tabPanel;

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
    if (this.hasAttribute("panel")) {
      const panel = document.querySelector(this.getAttribute("panel"));
      if (panel instanceof NCRSTabPanel) {
        this.tabPanel = panel; 
      }
    }
    this.classList.add('select-none')
    this.addEventListener('click', event => {
      if (event.target.parentElement instanceof NCRSTabList) {
        event.target.parentElement.deselectAll();
      }
      event.target.select()
    })
  }

  select() {
    this.setAttribute('selected', true)
    this.classList.add(...this.selectedClasses)
    this.classList.remove(...this.deselectedClasses)
    if (this.tabPanel) {
      this.tabPanel.show();
    }
  }

  deselect() {
    this.setAttribute('selected', '')
    this.classList.add(...this.deselectedClasses)
    this.classList.remove(...this.selectedClasses)
    if (this.tabPanel) {
      this.tabPanel.hide();
    }
  }

  isSelected() {
    return !!(this.getAttribute("selected"))
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