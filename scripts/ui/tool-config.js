import {NCRSEditorSettings} from "../editor.js"

function sizeInput(sizes) {
  const sizeInput = document.createElement('fieldset')
  sizeInput.classList.add('flex')
  
  const sizeTitle = document.createElement('legend')
  sizeTitle.innerText = "Size"
  sizeTitle.classList.add('text-xs', 'text-gray-400')
  sizeInput.append(sizeTitle)

  sizes.forEach(size => {
    const sizeRadio = document.createElement('input')
    sizeRadio.type = 'radio'
    sizeRadio.innerText = size[0]
    sizeRadio.setAttribute('name', 'size')
    if (size == sizes.at(0)) {
      sizeRadio.checked = true
      sizeRadio.classList.add('rounded-bl-lg')
    }
    if (size == sizes.at(-1)) {
      sizeRadio.classList.add('rounded-br-lg')
    }
    sizeRadio.setAttribute('data-size', size[1])
    sizeRadio.setAttribute('title', `Set brush size of ${size[1]}.`)
    sizeRadio.classList.add('btn-ncs', 'font-icon', 'appearance-none', 'select-none')
    sizeRadio.addEventListener('click', event => {
      NCRSEditorSettings.brushSize = Number(event.target.dataset.size)
    })
    sizeInput.append(sizeRadio)
  });

  return sizeInput;
}

function effectToggle(effect, icon, title = "") {
  const effectToggle = document.createElement('button')
  effectToggle.classList.add('btn-ncs', 'rounded-full', 'font-icon', 'py-2', 'w-6', 'text-center', 'text-sm')
  effectToggle.innerText = icon
  effectToggle.title = title

  effectToggle.addEventListener('click', (event) => {
    let eventState = NCRSEditorSettings.effects[effect]
    if (eventState) {
      event.target.classList.remove('btn-ncs-active')
    } else {
      event.target.classList.add('btn-ncs-active')
    }
    NCRSEditorSettings.effects[effect] = !eventState
  })

  return effectToggle
}

function brushConfig() {
  const panel = document.getElementById('brush-config');
  const brushSizes = [
    ["\ue80e", 1],
    ["\ue824", 2],
    ["\ue813", 3]
  ]

  panel.append(sizeInput(brushSizes))

  const effects = document.createElement('fieldset')
  effects.classList.add('flex', 'gap-1')

  const effectsTitle = document.createElement('legend')
  effectsTitle.innerText = "Effects"
  effectsTitle.classList.add('text-xs', 'text-gray-400')
  effects.append(effectsTitle)

  effects.append(effectToggle("camo", "\ue821", "Toggle camo mode"))
  effects.append(effectToggle("blend", "\ue810", "Pick colors from the blend palette at random."))
  const mirrorEffect = effectToggle("mirror", "\ue815", "Toggle mirror mode (WIP)")
  mirrorEffect.disabled = true
  effects.append(mirrorEffect)
  panel.append(effects)
}

window.addEventListener('load', () => {
  brushConfig();
})