import './components/layers.js'
import './components/palettes.js'
import './components/tabs.js'
import './components/tools.js'

import "./color_picker.js"
import {NCRSEditor, NCRSEditorSettings, exportToNCRS} from "./editor.js"
import "./ui.js"

window.NCRSEditor = NCRSEditor;
window.NCRSEditorSettings = NCRSEditorSettings;
window.exportToNCRS = exportToNCRS;