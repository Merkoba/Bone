// T:2

// Node imports

const fs = require('fs')
const path = require('path')
const contextMenu = require('electron-context-menu')

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
Bone.top_panel_active = true
Bone.active_resize_handle = false

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
    zoom_step: 0.1,
    zoom_default: 1,
    size_step: 0.1,
    size_default: 1,
    top_panel_height: 36,
    top_panel_hidden_height: 4,
    top_panel_auto_hide_delay: 1000,
    history_max_url_length: 50,
    swap_max_url_length: 50,
    modules_path: './js/main/modules/',
    resize_handle_size: 4,
    resize_double_click_delay: 350
}

// This gets called when body loads
// First function that is called
Bone.init = function()
{
    Bone.load_files()
    Bone.get_local_storage()
    Bone.setup_templates()
    Bone.create_windows()
    Bone.setup_menu_window()
    Bone.update_menu_window_widgets()
    Bone.setup_top_panel()
    Bone.setup_create_preset()
    Bone.setup_handle_preset()
    Bone.update_presets()
    Bone.apply_theme()
    Bone.apply_layout(false)
    Bone.setup_swap_webviews()
    Bone.start_top_panel_auto_hide()
    Bone.apply_auto_hide_top_panel()
    Bone.setup_info()
    Bone.setup_history()
    Bone.setup_resize_handles()
    Bone.activate_resize_listener()

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