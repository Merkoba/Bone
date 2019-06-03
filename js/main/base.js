// T:7

// Node imports

const fs = require('fs')
const path = require('path')
// const remote = require('electron').remote
const {remote, ipcRenderer} = require('electron')
const main = remote.require('./index.js')
const contextMenu = require('electron-context-menu')
const {FindInPage} = require('electron-find')
const Msg = require('msg-modal')
const ColorLib = require('mad-colorlib')
const Separator = require('mad-separator')
const Handlebars = require('handlebars')

// Init main object and some properties

let Bone = {}

Bone.ls_name = 'bone_v1'

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
Bone.input_selected = false

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
    resize_double_click_delay: 350,
    startpage: 'https://www.startpage.com',
    max_global_history_items: 1000
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
    Bone.start_autostart_spaces()
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
    Bone.setup_handle_history()
    Bone.setup_separator()
    Bone.setup_url_input()
    Bone.setup_url_suggest()
    Bone.setup_find()
    Bone.setup_signals()
    Bone.setup_handle_close_space()
    Bone.setup_space_options()

    Bone.remove_splash()

    console.info('Bone started')
}

Bone.load_files = function()
{
    let normalized_path = path.join(__dirname, 'js/main/modules')

    fs.readdirSync(normalized_path).forEach(function(file) 
    {
        require(Bone.config.modules_path + file)
    })
}