import {NCRSEditor} from "../editor.js";
import {Sortable} from '@shopify/draggable';


const layerList = document.createElement('ncrs-layer-list')
document.getElementById('layers').append(layerList)

NCRSEditor.addEventListener('layer-add', event => {
  layerList.addLayer(event.detail.newLayer)
})

NCRSEditor.addEventListener('layer-remove', event => {
  layerList.deleteLayer(event.detail.layerId)
})

NCRSEditor.addEventListener('layer-reorder', event => {
  layerList.reorderLayer(event.detail.from, event.detail.to)
})

const layerButtons = document.getElementById('layer-buttons')

const addLayerButton = document.createElement('button')
addLayerButton.innerText = "\ue802"
addLayerButton.classList.add("btn-ncs", "w-8", "rounded-bl-lg", "rounded-br-none", "font-icon")
addLayerButton.addEventListener("click", () => {
  NCRSEditor.AddBlankLayer();
})

const removeLayerButton = document.createElement('button')
removeLayerButton.innerText = "\ue828"
removeLayerButton.classList.add("btn-ncs", "w-8", "rounded-bl-none", "rounded-br-lg", "font-icon")
removeLayerButton.addEventListener("click", () => {
  layerList.removeCurrentLayer()
})

layerButtons.append(addLayerButton)
layerButtons.append(removeLayerButton)

const sortable = new Sortable(document.querySelectorAll('.sortable'), {
  draggable: '.draggable',
  distance: 2
});

sortable.on("sortable:stop", event => {
  let layerId = event.dragEvent.data.source.getAttribute('layer-id')
  NCRSEditor.ReorderLayer(layerId, event.data.newIndex)
})