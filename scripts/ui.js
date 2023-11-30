import {EventBus} from "./events.js"
import van from "vanjs-core"
import * as vanX from "vanjs-ext"
import {Sortable} from '@shopify/draggable';

const {a, div, li, p, ul, button} = van.tags
const state = vanX.reactive({
  currentTool: "brush",
  currentLayer: 0,
  layers: []
})

let reorderedLayers = [];

EventBus.on("editor-layer-remove", event => {
  let index = GetLayerIndex(event.layerId);
  state.layers.splice(index, 1);
  SwitchLayer(ClampedIndex(state.currentLayer));
})
EventBus.on("editor-layer-reorder", event => {
  reorderedLayers = event.layers;
})

EventBus.on("editor-layer-update", event => {
  console.log(event)
  if (event.parentEvent == "layer-reorder") { return; }
  if (event.parentEvent == "layer-remove") { return; }
  vanX.replace(state.layers, () => { return event.layers; });
})

function classHelper(classes, activeClasses, condition) {
  if (condition) { return classes.concat(activeClasses).join(" "); }
  return classes.join(" ");
}

function ClampedIndex(index) {
  if (index > (state.layers.length - 1)) { return state.layers.length - 1; }
  if (index < 0) { return 0; }
  return index;
}

function GetLayerIndex(layerId) {
  return state.layers.findIndex(layer => {return layer.id == layerId;});
}

function SwitchLayerById(layerId) {
  let layerIndex = GetLayerIndex(layerId);
  SwitchLayer(layerIndex);
}

function SwitchLayer(index) {
  if (state.currentLayer == index) { return; }
  state.currentLayer = ClampedIndex(index);
  EventBus.signal("ui-layer-change", {layerIndex: state.currentLayer})
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

const Layer = (layer) => {
  const bgState = van.state(layer.val.texture.layerURL);
  var cooldown = false;
  layer.val.texture.events.on("blob", event => {
    if (cooldown == true) { return; }
    cooldown = true;
    setTimeout(() => { cooldown = false; console.log("finished!") }, 1000)
    bgState.val = event.url;
  })
  return div(
    {
      class: () => {
        let classes = "h-12 w-16 draggable"
        if (state.currentLayer == GetLayerIndex(layer.val.id)) { return classes + " bg-green-200"; }
        return classes + " bg-white";
      },
      "data-layer-id": layer.val.id,
      onclick: () => {
        SwitchLayerById(layer.val.id);
        bgState.val = layer.val.texture.layerURL;
      },
      style: () => { return 'background-image: url(' + bgState.val + ');'}
    },
    p(
      {class: "text-black pointer-events-none"},
      layer.val.id
    )
  );
}

const LayerList = () => {
  return vanX.list(
      () => div({class: "flex flex-col-reverse justify-start gap-1 h-full sortable"}),
      state.layers,
      Layer
  )
}

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
      onclick: () => { EventBus.signal("ui-layer-remove", {layerIndex: ClampedIndex(state.currentLayer)}) }
    },
    "\ue828"
  )
)

addFromID(
  "layers",
  LayerList()
)

const sortable = new Sortable(document.querySelectorAll('.sortable'), {
  draggable: '.draggable',
  distance: 2
});

sortable.on("sortable:stop", event => {
  if (state.currentLayer == event.data.oldIndex) {
    state.currentLayer = event.data.newIndex;
  }
  let layerId = event.dragEvent.data.source.dataset.layerId
  EventBus.signal("ui-layer-reorder", {layerId: layerId, layerIndex: event.data.newIndex})
})

sortable.on("drag:stopped", event => {
  vanX.replace(state.layers, () => { return reorderedLayers; })
})