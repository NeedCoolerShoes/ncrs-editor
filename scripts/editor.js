import {CopperOre} from "./vendor/copper_ore/src/copper_ore.js"
import {clamp, hexToRGB, sample, getRandomInt, shadeColor} from "./helpers.js"
import { texture } from "three/examples/jsm/nodes/Nodes.js";

class NCRSEditorSettingsClass extends EventTarget {
  currentColor = {r: 255, b: 0, g: 0, a: 255};
  blendPalette = [];
  effects = {
    camo: false,
    mirror: false,
    blend: false,
    darken: false,
    shadeOnce: false
  };
  brushSize = 1;
  brushStyle = "square";
  shadeStep = 1;

  toggleEffect(effect) {
    this.effects[effect] = !this.effects[effect];
    this.dispatchEvent(new CustomEvent("effect", {detail: {effect: effect, value: this.effects[effect]}}));
  }

  setBrushSize(size) {
    this.brushSize = size;
    this.dispatchEvent(new CustomEvent("brushSize", {detail: {size: size}}));
  }

  setBrushStyle(style) {
    this.brushStyle = style;
    this.dispatchEvent(new CustomEvent("brushStyle", {detail: {style: style}}));
  }
}

const NCRSEditorSettings = new NCRSEditorSettingsClass;

const NCRSEditor = new CopperOre({
  texture: '/mncs-mascot.png',
  bind: this,
  parent: document.getElementById("editor"),
  tools: {
      brush: UseBrush,
      bucket: UseBucket,
      shade: UseShade,
      // eraser: UseEraser,
      // color_picker: UseColorPicker
  }
});

let shadeHistory = [];

function ApplyBrush(intermediateTexture, point, color){
  const size = NCRSEditorSettings.brushSize;
  const square = size ** 2;
  const center = Math.floor(size / 2);
  for (let i = 0; i < square; i++) {
    const row = i % size;
    const col = Math.floor(i / size);

    const offsetX = row - center;
    const offsetY = col - center;

    const pointX = clamp(point.x + offsetX, 0, NCRSEditor.IMAGE_WIDTH);
    const pointY = clamp(point.y + offsetY, 0, NCRSEditor.IMAGE_HEIGHT);

    const newColor = TransformColor(intermediateTexture, {x: pointX, y: pointY}, color);
    if (!newColor) { return }

    intermediateTexture.ChangePixelAtArray({x: pointX, y: pointY}, newColor);
  }
}

function ApplyCircleBrush(intermediateTexture, point, color) {
  let r = Math.floor(NCRSEditorSettings.brushSize + 1 / 2);
  DrawFilledCircle(intermediateTexture, point.x, point.y, r, color);
}

function TransformColor(intermediateTexture, point, color) {
  if (typeof color === "function") {
    const newColor = color(intermediateTexture, {x: point.x, y: point.y});
    if (!newColor) { return false }
    return [newColor.r, newColor.g, newColor.b, newColor.a]
  } else {
    return color;
  }
}

// https://stackoverflow.com/questions/1201200/fast-algorithm-for-drawing-filled-circles
// https://zingl.github.io/bresenham.html
function DrawFilledCircle(texture, x0, y0, radius, color) {
  let r = radius;
  let x = -radius;
  let y = 0;
  let err = 2 - 2 * r;

  do {
      for (let i = x0 - x; i <= x0 + x; i++)
      {
          SetPixel(texture, i, y0 + y, color);
          SetPixel(texture, i, y0 - y, color);
      }
      for (let i = x0 - y; i <= x0 + y; i++)
      {
          SetPixel(texture, i, y0 + x, color);
          SetPixel(texture, i, y0 - x, color);
      }

    r = err;
    if (r <= y) err += ++y * 2 + 1;
    if (r > x || err > y) err += ++x * 2 + 1;
  } while (x < 1)
}

function SetPixel(texture, x, y, color) {
  const newColor = TransformColor(texture, {x: x, y: y}, color);
  texture.ChangePixelAtArray({x: x, y: y}, newColor);
}

function FillColor(intermediateTexture, point, newColor){
  intermediateTexture.visitedTable = {}; // this should be in the intermediate texture class
  var originalPixel = intermediateTexture.PixelAt(point);
  intermediateTexture.Fill(point, originalPixel, newColor);
  // intermediateTexture.ChangePixelAt(point, newColor);
}

function UseBrush(part, canvasTexture, pixel) {
  if (NCRSEditorSettings.brushStyle == "circle") {
    ApplyCircleBrush(canvasTexture, pixel, getColor);
  } else {
    ApplyBrush(canvasTexture, pixel, getColor);
  }
}

function UseBucket(part, canvasTexture, pixel) {
  FillColor(canvasTexture, pixel, () => {
    let newColor = getColor();
    return {r: newColor.r / 255, g: newColor.g / 255, b: newColor.b / 255, a: newColor.a / 255}
  });
}

function UseShade(_, canvasTexture, pixel) {
  ApplyBrush(canvasTexture, pixel, shadePixel)
}

function shadePixel(texture, point) {
  const color = texture.GetRGBA(point)
  if (color.a <= 0) { return false }
  if (NCRSEditorSettings.effects.shadeOnce) {
    if (NCRSEditor.firstClick) { shadeHistory = [] }
    const pointStr = `${point.x}:${point.y}`
    if ( shadeHistory.includes(pointStr) ) { return false }
    shadeHistory.push(pointStr)
  }
  const threeColor = texture.GetColorAt(point)
  let hsl = {}
  threeColor.getHSL(hsl)
  const lightness = hsl.l + ((NCRSEditorSettings.shadeStep / 255) * (NCRSEditorSettings.effects.darken ? -1 : 1))
  threeColor.setHSL(hsl.h, hsl.s, lightness)
  let newColor = {}
  threeColor.getRGB(newColor)
  newColor.a = 255
  return {r: newColor.r * 255, b: newColor.b * 255, g: newColor.g * 255, a: color.a}
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