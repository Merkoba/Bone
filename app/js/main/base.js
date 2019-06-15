// T:7

// Node imports

const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')
const electron = require('electron')
const {remote, ipcRenderer, clipboard, shell} = electron
const {dialog} = remote
const Msg = require('msg-modal')
const ColorLib = require('mad-colorlib')
const Separator = require('mad-separator')
const Handlebars = require('handlebars')
const root_path = require('electron-root-path').rootPath

// Init main object and some properties

let Bone = {}

Bone.ls_name = 'bone_v2'

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
Bone.url_input_selected = false
Bone.hash_calculated = false
Bone.hash_calculating = false
Bone.find_on = false
Bone.info_popups = {}

Bone.config =
{
    num_webviews: 4,
    zoom_step: 0.1,
    zoom_default: 1,
    panel_height: 36,
    panel_hidden_height: 4,
    panel_auto_hide_delay: 1000,
    small_url_length: 50,
    small_title_length: 100,
    modules_path: './js/main/modules/',
    resize_double_click_delay: 350,
    max_global_history_items: 2500,
    global_history_url_max_length: 500,
    preset_version: 1,
    max_recent_items: 250,
    max_download_locations: 20,
    max_history_items: 25,
    ghost_webviews_shot_delay: 800,
    ghost_webviews_shot_quick_delay: 250
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
    Bone.check_presets()
    Bone.start_autostart_spaces()
    Bone.setup_panel()
    Bone.setup_create_preset()
    Bone.setup_handle_preset()
    Bone.setup_open_preset()
    Bone.update_presets()
    Bone.apply_theme()
    Bone.setup_swap_webviews()
    Bone.start_panel_auto_hide()
    Bone.apply_auto_hide_panel()
    Bone.setup_info()
    Bone.setup_history()
    Bone.activate_resize_listener()
    Bone.setup_autostart()
    Bone.setup_separator()
    Bone.setup_url_input()
    Bone.setup_url_suggest()
    Bone.setup_find()
    Bone.setup_signals()
    Bone.setup_handle_close_space()
    Bone.setup_space_options()
    Bone.setup_handle_new_space()
    Bone.setup_global_history()
    Bone.setup_recent()
    Bone.setup_filter()
    Bone.setup_context_menu()
    Bone.setup_handle_download()
    Bone.setup_create_layout()
    Bone.setup_handle_history()
    Bone.setup_check_handle_preset()

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