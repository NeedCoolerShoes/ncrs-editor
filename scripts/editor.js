import {CopperOre} from "./vendor/copper_ore/src/copper_ore.js"
import {clamp, hexToRGB, sample, getRandomInt, shadeColor} from "./helpers.js"

const NCRSEditorSettings = {
  currentColor: {r: 255, b: 0, g: 0, a: 255},
  blendPalette: [],
  effects: {
    camo: false,
    mirror: false,
    blend: false
  },
  brushSize: 1
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

function ApplyBrush(intermediateTexture, point, color){
  const size = NCRSEditorSettings.brushSize;
  const square = size ** 2;
  const center = Math.floor(size / 2);
  for (let i = 0; i < square; i++) {
    let useColor;
    if (typeof color === "function") {
      let newColor = color();
      useColor = [newColor.r, newColor.g, newColor.b, newColor.a]
    } else {
      useColor = color;
    }
    const row = i % size;
    const col = Math.floor(i / size);

    const offsetX = row - center;
    const offsetY = col - center;

    const pointX = clamp(point.x + offsetX, 0, NCRSEditor.IMAGE_WIDTH)
    const pointY = clamp(point.y + offsetY, 0, NCRSEditor.IMAGE_HEIGHT)

    intermediateTexture.ChangePixelAtArray({x: pointX, y: pointY}, useColor);
  }
}

function FillColor(intermediateTexture, point, newColor){
  intermediateTexture.visitedTable = {}; // this should be in the intermediate texture class
  var originalPixel = intermediateTexture.PixelAt(point);
  intermediateTexture.Fill(point, originalPixel, newColor);
  // intermediateTexture.ChangePixelAt(point, newColor);
}

function UseBrush(part, canvasTexture, pixel) {
  ApplyBrush(canvasTexture, pixel, getColor);
}

function UseBucket(part, canvasTexture, pixel) {
  FillColor(canvasTexture, pixel, () => {
    let newColor = getColor();
    return {r: newColor.r / 255, g: newColor.g / 255, b: newColor.b / 255, a: newColor.a / 255}
  });
}

function getColor() {
  const settings = NCRSEditorSettings;
  let color = settings.currentColor;
  if (settings.effects.blend && settings.blendPalette.length > 0) {
    const hex = sample(settings.blendPalette);
    color = hexToRGB(hex, 1)
  }
  if (settings.effects.camo) {
    const percent = getRandomInt(50) - 25;
    const newColor = shadeColor(color.r, color.g, color.b, percent)
    return {r: newColor.r, g: newColor.g, b: newColor.b, a: color.a}
  }
  return color;
}

NCRSEditor.camera.zoom = 1.6;
NCRSEditor.settings.grid = true;

export {NCRSEditor, NCRSEditorSettings};