import { call } from "three/examples/jsm/nodes/Nodes.js"
import {NCRSEditorSettings} from "../editor.js"

function configToggle(title, name, data, callback) {
  const configField = document.createElement('fieldset')
  configField.classList.add('flex')
  
  const configTitle = document.createElement('legend')
  configTitle.innerText = title
  configTitle.classList.add('text-xs', 'text-gray-400')
  configField.append(configTitle)

  data.forEach(value => {
    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.innerText = value[0]
    radio.setAttribute('name', name)
    if (value == data.at(0)) {
      radio.checked = true
      radio.classList.add('rounded-bl-lg')
    }
    if (value == data.at(-1)) {
      radio.classList.add('rounded-br-lg')
    }
    radio.classList.add('btn-ncs', 'font-icon', 'appearance-none', 'select-none')

    callback(value, radio)

    configField.append(radio)
  });

  return configField;
}

function sizeInput(name, sizes) {
  const sizeInput = configToggle("Size", name, sizes, (value, radio) => {
    radio.setAttribute('title', `Set brush size of ${value[1]}.`)
    radio.setAttribute('data-size', value[1])
    radio.addEventListener('click', event => {
      NCRSEditorSettings.setBrushSize(Number(event.target.dataset.size))
    })
    NCRSEditorSettings.addEventListener("brushSize", event => {
      console.log(event)
      if (value[1] == event.detail.size) {
        radio.checked = true
      } else {
        radio.checked = false
      }
    })
  })
  return sizeInput;
}

function effectField(title = "Effects") {
  const effects = document.createElement('fieldset')
  effects.classList.add('flex', 'gap-1')

  const effectsTitle = document.createElement('legend')
  effectsTitle.innerText = title
  effectsTitle.classList.add('text-xs', 'text-gray-400')
  effects.append(effectsTitle)
  return effects
}

function effectToggle(effect, icon, title = "") {
  const effectToggle = document.createElement('button')
  effectToggle.classList.add('btn-ncs', 'rounded-full', 'font-icon', 'py-2', 'w-6', 'text-center', 'text-sm')
  effectToggle.innerText = icon
  effectToggle.title = title

  effectToggle.addEventListener('click', () => {
    NCRSEditorSettings.toggleEffect(effect);
  })

  NCRSEditorSettings.addEventListener("effect", event => {
    if (event.detail.effect != effect) { return }
    if (event.detail.value) {
      effectToggle.classList.add('btn-ncs-active')
    } else {
      effectToggle.classList.remove('btn-ncs-active')
    }
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

  panel.append(sizeInput("brush-size", brushSizes))

  const effects = effectField()

  effects.append(effectToggle("camo", "\ue821", "Toggle camo mode"))
  effects.append(effectToggle("blend", "\ue810", "Pick colors from the blend palette at random."))
  const mirrorEffect = effectToggle("mirror", "\ue815", "Toggle mirror mode (WIP)")
  mirrorEffect.disabled = true
  effects.append(mirrorEffect)
  panel.append(effects)
}

function bucketConfig() {
  const panel = document.getElementById('bucket-config');

  const effects = effectField()

  effects.append(effectToggle("camo", "\ue821", "Toggle camo mode"))
  effects.append(effectToggle("blend", "\ue810", "Pick colors from the blend palette at random."))
  panel.append(effects)
}

function shadeConfig() {
  const panel = document.getElementById('shade-config');
  const subPanel = document.createElement('div');
  subPanel.classList.add('flex', 'gap-2')
  const brushSizes = [
    ["\ue80e", 1],
    ["\ue824", 2],
    ["\ue813", 3]
  ]
  const stepSizes = [
    ["1", 1],
    ["3", 3],
    ["5", 5]
  ]

  const effects = effectField("Settings")

  effects.append(effectToggle("darken", "\ue827", "Darken mode."))
  effects.append(effectToggle("shadeOnce", "\ue812", "Only shade a pixel once in a given stroke."))

  subPanel.append(sizeInput("shade-size", brushSizes))
  subPanel.append(
    configToggle("Shade Steps", "shade-steps", stepSizes, (value, radio) => {
      radio.setAttribute('title', `Set shade steps to ${value[1]}.`)
      radio.setAttribute('data-step', value[1])
      radio.addEventListener('click', event => {
        NCRSEditorSettings.shadeStep = Number(event.target.dataset.step)
      })
    })
  )
  panel.append(subPanel)
  panel.append(effects)
}

window.addEventListener('load', () => {
  brushConfig();
  bucketConfig();
  shadeConfig();
})