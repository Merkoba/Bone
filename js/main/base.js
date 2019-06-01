// T:2

// Node imports

const fs = require('fs')
const path = require('path')
const contextMenu = require('electron-context-menu')
const remote = require('electron').remote
const main = remote.require('./index.js')
const Msg = require('msg-modal')
const ColorLib = require('colorlib2')
const Handlebars = require('handlebars')

// Init main object and some properties

let Bone = {}

Bone.ls_name = 'boneless_v20'

Bone.layouts =
[
    'single', '2_column', '3_column', '4_column', '2_row', '3_row', '4_row',
    '1_top_2_bottom', '1_top_3_bottom', '2_top_1_bottom', '3_top_1_bottom',
    '2_top_2_bottom', '1_left_2_right', '1_left_3_right', '2_left_1_right', '3_left_1_right'
]

Bone.colorlib = ColorLib()
Bone.preset_index = -1
Bone.panel_active = true
Bone.active_resize_handle = false
Bone.spaces = []
Bone.current_space = 0

Bone.history =
{
    webview_1: [],
    webview_2: [],
    webview_3: [],
    webview_4: []
}

Bone.config =
{
    num_webviews: 4,
    zoom_step: 0.05,
    zoom_default: 1,
    size_step: 0.05,
    size_default: 1,
    panel_height: 36,
    panel_hidden_height: 4,
    panel_auto_hide_delay: 1000,
    history_max_url_length: 50,
    swap_max_url_length: 50,
    modules_path: './js/main/modules/',
    resize_double_click_delay: 350
}

// This gets called when body loads
// First function that is called
Bone.init = function()
{
    Bone.load_files()
    Bone.setup_templates()
    Bone.get_local_storage()
    Bone.create_windows()
    Bone.setup_menu()
    Bone.start_spaces()
    Bone.setup_panel()
    Bone.setup_create_preset()
    Bone.setup_handle_preset()
    Bone.setup_open_preset()
    Bone.update_presets()
    Bone.apply_theme()
    Bone.apply_layout(false)
    Bone.setup_swap_webviews()
    Bone.start_panel_auto_hide()
    Bone.apply_auto_hide_panel()
    Bone.setup_info()
    Bone.setup_history()
    Bone.activate_resize_listener()
    Bone.setup_autostart()

    console.info('Boneless started')
}

Bone.load_files = function()
{
    let normalized_path = path.join(__dirname, 'js/main/modules')

    fs.readdirSync(normalized_path).forEach(function(file) 
    {
        require(Bone.config.modules_path + file)
    })
}