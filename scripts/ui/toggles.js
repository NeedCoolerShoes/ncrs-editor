import {NCRSEditorSettings, NCRSEditor} from "../editor.js"

const toggles = document.getElementById('toggles')

function checkboxToggle(icon, name, title, callback) {
  const label = document.createElement('label')
  const checkbox = document.createElement('input')
  const span = document.createElement('span')

  label.title = title
  label.classList.add('font-icon', 'text-lg', 'cursor-pointer', 'h-[18px]')

  checkbox.type = "checkbox"
  checkbox.style = "display: none;"
  checkbox.id = name

  span.textContent = icon + " \ue81d"
  span.classList.add('select-none')
  checkbox.checked = true

  checkbox.addEventListener('change', (event) => {
    if (typeof callback == "function") {
      callback(event)
    }
    if (event.target.checked) {
      span.textContent = icon + " \ue81d"
    } else {
      span.textContent = icon + " \ue81e"
    }
  })

  label.append(checkbox)
  label.append(span)
  return label;
}

const armorToggle = checkboxToggle("\ue818", "armor-toggle", "Toggle armor skin layer.", () => {
  NCRSEditor.ToggleOverlayParts()
})

const skinToggle = checkboxToggle("\ue819", "skin-toggle", "Toggle bottom skin layer.", () => {
  NCRSEditor.ToggleParts()
})

const gridToggle = checkboxToggle("\ue82c", "grid-toggle", "Toggle grid.", (event) => {
  NCRSEditor.SetGridVisibility(event.target.checked)
})

toggles.append(armorToggle)
toggles.append(skinToggle)
toggles.append(gridToggle)

armorToggle.click();