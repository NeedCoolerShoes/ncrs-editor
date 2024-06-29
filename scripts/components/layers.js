class NCRSLayerList extends HTMLElement {
  constructor() {
    super();
  }

  layers = [];
  selectedLayer;

  connectedCallback() {
    this.setAttribute('class', 'flex flex-col-reverse grow justify-start gap-1 min-h-min overflow-auto sortable')
    this.style.setProperty('scrollbar-width', 'none')
  }

  addLayer(skinLayer) {
    const layer = document.createElement('ncrs-layer');
    layer.setAttribute('selected', true);
    layer.skinLayer = skinLayer;
    this.layers.push(layer);    

    layer.addEventListener('ncrs-select', event => {
      this.layers.forEach(layer => {
        if (layer == event.target) { return; }
        layer.deselect();
      })
      this.selectedLayer = event.target;
    })

    this.appendChild(layer);
  }

  removeCurrentLayer() {
    if (!this.selectedLayer) { return; };
    const newSelected = this.selectedLayer.previousElementSibling || this.selectedLayer.nextElementSibling;
    this.selectedLayer.removeLayer();
    if (newSelected) {
      this.selectedLayer = newSelected;
      this.selectedLayer.select();
    }
  }
}

class NCRSLayer extends HTMLElement {
  constructor () {
    super();
  }

  skinLayer;
  selectEvent = new Event('ncrs-select')

  removeLayer() {
    this.skinLayer.remove();
    this.remove();
  }

  select() {
    if (this.skinLayer) { this.skinLayer.select(); }
    this.classList.remove('border-ncs-gray-700');
    this.classList.add('border-gray-600');
    this.setAttribute('selected', true);
    this.dispatchEvent(this.selectEvent);
  }

  deselect() {
    if (this.skinLayer) { this.skinLayer.deselect(); }
    this.classList.remove('border-gray-600');
    this.classList.add('border-ncs-gray-700');
    this.setAttribute('selected', '');
  }

  connectedCallback() {
    this.setAttribute('class', 'h-12 w-16 shrink-0 border-2 border-ncs-gray-700 border-dashed bg-no-repeat bg-center bg-contain draggable');
    this.addEventListener('click', event => { event.target.select() })
    if (this.skinLayer) {
      this.setAttribute('id', `layer-${this.skinLayer.id}`)
      this.setAttribute('layer-id', this.skinLayer.id)
      this.skinLayer.addEventListener('layer-preview', event => {
        const img = new Image;
        img.src = event.detail.url;
        img.onload = () => {
          this.style.backgroundImage = `url(${event.detail.url})`
          img.remove()
        }
      })
    }
    if (this.hasAttribute("selected")) {
      this.select();
    }
  }
}

window.customElements.define("ncrs-layer-list", NCRSLayerList);
window.customElements.define("ncrs-layer", NCRSLayer);

export {NCRSLayer}