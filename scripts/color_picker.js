import {NCRSEditor, NCRSEditorSettings} from "./editor";
import {hexToRGB} from "./helpers";

window.addEventListener('load', () => {
  Coloris({
    parent: '#color-picker',
    defaultColor: '#ff0000',
    theme: 'large',
    themeMode: 'dark',
    inline: true,
    format: 'hex',
    onChange: onColorChange
  })

  const colorValue = document.getElementById('clr-color-value')
  const closeButton = document.getElementById('clr-close')
  const nativePicker = document.createElement('input')

  closeButton.setAttribute('title', 'Use system color picker.')
  nativePicker.setAttribute('type', 'color')
  nativePicker.setAttribute('class', 'hidden')
  closeButton.appendChild(nativePicker)

  colorValue.addEventListener('input', event => {
    const value = event.target.value
    if (value.match(/#moxvallix/i)) {
      NCRSEditor.camera.up.set(0, -NCRSEditor.camera.up.y, 0)
    } else if (!value.startsWith('#')) {
      event.target.value = '#' + value
    }
  })

  closeButton.addEventListener('click', () => {
    nativePicker.click()
  })

  nativePicker.addEventListener('change', event => {
    colorValue.value = event.target.value

    const newEvent = new Event('change')
    colorValue.dispatchEvent(newEvent)
  })
})

function onColorChange(color) {
  NCRSEditorSettings.currentColor = hexToRGB(color, 1);
}

function changeColor(color) {
  const colorValue = document.getElementById('clr-color-value');
  colorValue.value = color;
  colorValue.dispatchEvent(new Event('change'));
}

const resizeHandler = new ResizeObserver( () => {
  Coloris.updatePosition();
})

resizeHandler.observe(document.body);

export {changeColor};