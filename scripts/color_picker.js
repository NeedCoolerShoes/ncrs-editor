import { EventBus } from "./events";

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
    if (!value.startsWith('#')) {
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
  console.log(hexToRGB(color));
  EventBus.signal("color-set", hexToRGB(color));
}

// https://stackoverflow.com/questions/21646738/convert-hex-to-rgba#28056903
function hexToRGB(hex) {
  let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
  
  let a = 255;

  if (hex.length > 7) {
    a = parseInt(hex.slice(7, 9), 16);
  }

  return {r: r / 255, g: g / 255, b: b / 255, a: a / 255 }
}

const resizeHandler = new ResizeObserver( () => {
  Coloris.updatePosition();
})

resizeHandler.observe(document.body);