import {EventBus} from "./events.js"
import {CopperOre} from "./vendor/copper_ore/src/copper_ore.js"
import {NCRSLayer} from "./ui/layers.js"

var currentColor = {r: 1, b: 0, g: 0, a: 1}

function ApplyBrush(intermediateTexture, point, color){
  intermediateTexture.ChangePixelAtArray(point, color);
}

function FillColor(intermediateTexture, point, newColor){
  intermediateTexture.visitedTable = {}; // this should be in the intermediate texture class
  var originalPixel = intermediateTexture.PixelAt(point);
  intermediateTexture.Fill(point, originalPixel, newColor);
  intermediateTexture.ChangePixelAt(point, newColor);
}

function UseBrush(part, canvasTexture, pixel) {
  let arr = [currentColor.r * 255, currentColor.g * 255, currentColor.b * 255, currentColor.a * 255];
  ApplyBrush(canvasTexture, pixel, arr);
}

function UseBucket(part, canvasTexture, pixel) {
  FillColor(canvasTexture, pixel, currentColor);
}

const NCRSEditor = new CopperOre({
  texture: '/mncs-mascot.png',
  bind: this,
  parent: document.getElementById("editor"),
  tools: {
      brush: UseBrush,
      bucket: UseBucket,
      // eraser: UseEraser,
      // color_picker: UseColorPicker
  }
});

NCRSEditor.camera.zoom = 1.6;
NCRSEditor.settings.grid = true;

NCRSEditor.on("layer-update", event => {
  console.log("layer updating")
  EventBus.signal("editor-layer-update", event);
})

NCRSEditor.on("layer-add", event => {
  console.log("layer updating")
  EventBus.signal("editor-layer-add", event);
})

NCRSEditor.on("layer-reorder", event => {
  EventBus.signal("editor-layer-reorder", event);
})

NCRSEditor.on("layer-remove", event => {
  EventBus.signal("editor-layer-remove", event);
})

EventBus.on("color-set", event => { currentColor = event; })

EventBus.on("ui-layer-add", event => {
  NCRSEditor.AddBlankLayer();
})

EventBus.on("ui-layer-remove", event => {
  NCRSEditor.RemoveLayer(event.layerIndex);
})

EventBus.on("ui-layer-change", event => {
  NCRSEditor.currentLayer = event.layerIndex;
})

EventBus.on("ui-layer-reorder", event => {
  NCRSEditor.ReorderLayer(event.layerId, event.layerIndex);
})

EventBus.on("ui-tool-change", event => {
  NCRSEditor.SetCurrentTool(event.tool);
})

export {NCRSEditor};