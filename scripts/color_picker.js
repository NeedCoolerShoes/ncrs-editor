import { EventBus } from "./events";

var NCRSColorPicker;
NCRSColorPicker = new ColorPicker({
  appendTo: document.getElementById("color-picker"),
  color: 'ff0000',
  mode: 'hsv-h',
  noResize: true,
  size: 2,
  actionCallback: onColorChange
})

function onColorChange(event) {
  if (typeof NCRSColorPicker == 'undefined') { return; }
  let rgb = NCRSColorPicker.color.colors.rgb;
  EventBus.signal("color-set", {r: rgb.r, g: rgb.g, b: rgb.b, a: NCRSColorPicker.color.colors.alpha});
}

export {NCRSColorPicker};