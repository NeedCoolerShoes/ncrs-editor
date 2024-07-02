import './components/layers.js'
import './components/palettes.js'
import './components/tabs.js'
import './components/tools.js'

import "./color_picker.js"
import {NCRSEditor, NCRSEditorSettings, exportToNCRS} from "./editor.js"
import "./ui.js"

import "./vendor/copper_ore/src/history/delete_layer_entry.js"

window.NCRSEditor = NCRSEditor;
window.NCRSEditorSettings = NCRSEditorSettings;
window.exportToNCRS = exportToNCRS;

window.addEventListener("keydown", event => {
  if (event.ctrlKey) {
    switch (event.key) {
      case 'z': NCRSEditor.history.undo(); break;
      case 'y': NCRSEditor.history.redo(); break;
    }
  }
})