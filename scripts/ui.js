import {EventBus} from "./events.js"
import van from "vanjs-core"
import * as vanX from "vanjs-ext"
import {NCRSEditor} from "./editor.js";
import {Sortable} from '@shopify/draggable';

const {a, div, li, p, ul, button} = van.tags
const state = vanX.reactive({
  currentTool: "brush",
  currentLayer: 0,
  layers: []
})

let reorderedLayers = [];

NCRSEditor.addEventListener('layer-add', event => {
  layerList.addLayer(event.detail.newLayer)
})

function classHelper(classes, activeClasses, condition) {
  if (condition) { return classes.concat(activeClasses).join(" "); }
  return classes.join(" ");
}

const ToolPanel = (tool, body) => div(
  {    
    class: () => { return classHelper([], ["hidden"], state.currentTool != tool);}
  },
  body
)

const ToolButton = (tool, body, opts = {}) => button(
  {
    onclick: () => { 
      state.currentTool = tool;
      EventBus.signal("ui-tool-change", {tool: tool});
    },
    title: `Switch to ${tool}.`,
    class: () => { return classHelper(["btn-ncs font-icon w-12"], ["btn-ncs-active"], state.currentTool == tool);}
  },
  body
)

const BrushPanel = () => ToolPanel(
  "brush",
  "Brush"
)

function addFromID(id, ...tools) {
  van.add(
    document.getElementById(id),
    ...tools
  )
}

addFromID(
  "toolbox-buttons",
  ToolButton("brush", "\ue80b"),
  ToolButton("square", "\ue817"),
  ToolButton("bucket", "\ue811")
)

addFromID(
  "tool-config",
  BrushPanel,
  ToolPanel("bucket", "World")
)

addFromID(
  "layer-buttons",
  button(
    {
      class: "btn-ncs w-8 rounded-bl-lg rounded-br-none font-icon",
      onclick: () => { EventBus.signal("ui-layer-add", {}) }
    },
    "\ue802"
  ),
  button(
    {
      class: "btn-ncs w-8 rounded-br-lg rounded-bl-none font-icon",
      onclick: () => {
        // EventBus.signal("ui-layer-remove", {layerIndex: ClampedIndex(state.currentLayer)})
        layerList.removeCurrentLayer()
      }
    },
    "\ue828"
  )
)

const layerList = document.createElement('ncrs-layer-list')
document.getElementById('layers').append(layerList)


const sortable = new Sortable(document.querySelectorAll('.sortable'), {
  draggable: '.draggable',
  distance: 2
});

sortable.on("sortable:stop", event => {
  if (state.currentLayer == event.data.oldIndex) {
    state.currentLayer = event.data.newIndex;
  }
  let layerId = event.dragEvent.data.source.dataset.id
  NCRSEditor.ReorderLayer(layerId, event.data.newIndex)
})