import {NCRSEditorSettings, NCRSEditor} from "../editor.js"

function configToggle(title, name, data, callback) {
  const configField = document.createElement('fieldset')
  configField.classList.add('flex')
  
  const configTitle = document.createElement('legend')
  configTitle.innerText = title
  configTitle.classList.add('text-xs', 'text-gray-400')
  configField.append(configTitle)

  let count = 0

  data.forEach(value => {
    count += 1
    const radio = document.createElement('input')
    const radioLabel = document.createElement('label')
    radio.type = 'radio'
    radio.id = `${name}-${count}}`
    radio.classList.add('hidden', 'btn-ncs')
    radio.setAttribute('name', name)
    radioLabel.htmlFor = radio.id
    radioLabel.textContent = value[0]
    if (value == data[0]) {
      radio.checked = true
      radioLabel.classList.add('rounded-bl-lg')
    }
    if (value == data[data.length - 1]) {
      radioLabel.classList.add('rounded-br-lg')
    }
    radioLabel.classList.add('btn-ncs', 'btn-ncs-label', 'font-icon', 'select-none')

    callback(value, radio, radioLabel)
    configField.append(radio)
    configField.append(radioLabel)
  });

  return configField;
}

function sizeInput(name, sizes) {
  const sizeInput = configToggle("Size", name, sizes, (value, radio, radioLabel) => {
    radioLabel.setAttribute('title', `Set brush size of ${value[1]}.`)
    radio.setAttribute('data-size', value[1])
    radio.addEventListener('click', event => {
      NCRSEditorSettings.setBrushSize(Number(event.target.dataset.size))
    })
    NCRSEditorSettings.addEventListener("brushSize", event => {
      if (value[1] == event.detail.size) {
        radio.checked = true
      } else {
        radio.checked = false
      }
    })
  })
  return sizeInput;
}

function shapeInput(name, shapes) {
  const shapeInput = configToggle("Shape", name, shapes, (value, radio, radioLabel) => {
    radioLabel.setAttribute('title', `Set brush shape of ${value[1]}.`)
    radio.setAttribute('data-shape', value[1])
    radio.addEventListener('click', event => {
      NCRSEditorSettings.setBrushStyle(event.target.dataset.shape)
    })
    NCRSEditorSettings.addEventListener("brushStyle", event => {
      if (value[1] == event.detail.style) {
        radio.checked = true
      } else {
        radio.checked = false
      }
    })
  })
  return shapeInput;
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
  const effectID = "effect-" + effect
  const effectToggle = document.createElement('input')
  const effectLabel = document.createElement('label')
  const effectDiv = document.createElement('div')
  effectToggle.type = "checkbox"
  effectToggle.id = effectID
  effectLabel.htmlFor = effectID
  effectToggle.classList.add('hidden', 'btn-ncs')
  effectLabel.classList.add(
    'btn-ncs', 'btn-ncs-label', 'rounded-full', 'font-icon',
    'py-2', 'w-6', 'text-center', 'text-sm', 'select-none'
  )
  effectLabel.innerText = icon
  effectLabel.title = title

  effectToggle.addEventListener('click', () => {
    NCRSEditorSettings.toggleEffect(effect);
  })

  NCRSEditorSettings.addEventListener("effect", event => {
    if (event.detail.effect != effect) { return }
    effectToggle.checked = event.detail.value
  })

  effectDiv.append(effectToggle)
  effectDiv.append(effectLabel)

  return effectDiv
}

function previewConfig() {
  const tool = document.getElementById('preview-tool');
  tool.addEventListener('select', () => {
    NCRSEditor.disableTools = true
    NCRSEditor.parent.classList.add('cursor-move')
    NCRSEditor.parent.classList.remove('cursor-crosshair')
  })
  tool.addEventListener('deselect', () => {
    NCRSEditor.disableTools = false
    NCRSEditor.parent.classList.remove('cursor-move')
    NCRSEditor.parent.classList.add('cursor-crosshair')
  })
}

function brushConfig() {
  const panel = document.getElementById('brush-config');
  const brushSizes = [
    ["\ue80e", 1],
    ["\ue824", 2],
    ["\ue813", 3]
  ]
  const brushShapes = [
    ["\ue80e", "square"],
    ["\uf111", "circle"]
  ]

  const styleDiv = document.createElement('div')
  styleDiv.classList.add('flex', 'gap-2')
  styleDiv.append(sizeInput("brush-size", brushSizes))
  styleDiv.append(shapeInput("brush-shape", brushShapes))
  panel.append(styleDiv)

  const effects = effectField()

  effects.append(effectToggle("camo", "\ue821", "Toggle camo mode"))
  effects.append(effectToggle("blend", "\ue810", "Pick colors from the blend palette at random."))
  const mirrorEffect = effectToggle("mirror", "\ue815", "Toggle mirror mode (WIP)")
  mirrorEffect.firstChild.disabled = true
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
    configToggle("Shade Steps", "shade-steps", stepSizes, (value, radio, radioLabel) => {
      radio.setAttribute('title', `Set shade steps to ${value[1]}.`)
      radio.setAttribute('data-step', value[1])
      radioLabel.classList.add('font-extrabold')
      radio.addEventListener('click', event => {
        NCRSEditorSettings.shadeStep = Number(event.target.dataset.step);
      })
    })
  )
  panel.append(subPanel)
  panel.append(effects)
}

window.addEventListener('load', () => {
  previewConfig();
  brushConfig();
  bucketConfig();
  shadeConfig();
})