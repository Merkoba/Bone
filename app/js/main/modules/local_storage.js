// Get the local storage data
Bone.get_local_storage = function()
{
    let obj

    if(localStorage[Bone.ls_name])
    {
        try
        {
            obj = JSON.parse(localStorage.getItem(Bone.ls_name))
        }

        catch(err)
        {
            localStorage.removeItem(Bone.ls_name)
            obj = null
        }
    }

    else
    {
        obj = {}
    }

    let save = Bone.check_local_storage(obj)
    
    if(save)
    {
        Bone.save_local_storage()
    }

    Bone.storage = obj
}

// Checks local storage object and assigns defaults if missing
Bone.check_local_storage = function(obj)
{
    let save = false

    let presets_version = 1
    let global_history_version = 1
    let download_locations_version = 1
    
    let settings_version = 1
    let theme_version = 1
    let auto_hide_panel_version = 1
    let resize_handle_size_version = 1
    let wrap_on_webview_cycle_version = 1
    let wrap_on_space_cycle_version = 1
    let startpage_version = 1
    let searchpage_version = 1

    if(obj.presets === undefined || obj.presets_version !== presets_version)
    {
        obj.presets = []
        obj.presets_version = presets_version
        save = true
    }

    if(obj.global_history_version === undefined || obj.global_history_version !== global_history_version)
    {
        obj.global_history = []
        obj.global_history_version = global_history_version
        save = true
    }

    if(obj.download_locations_version === undefined || obj.download_locations_version !== download_locations_version)
    {
        obj.download_locations = []
        obj.download_locations_version = download_locations_version
        save = true
    }

    if(obj.settings === undefined || obj.settings_version !== settings_version)
    {
        obj.settings = {}
        obj.settings_version = settings_version
        save = true
    }

    if(obj.settings.theme === undefined || obj.theme_version !== theme_version)
    {
        obj.settings.theme = '#31343e'
        obj.theme_version = theme_version
        save = true
    }

    if(obj.settings.auto_hide_panel === undefined || obj.auto_hide_panel_version !== auto_hide_panel_version)
    {
        obj.settings.auto_hide_panel = false
        obj.auto_hide_panel_version = auto_hide_panel_version
        save = true
    }

    if(obj.settings.resize_handle_size === undefined || obj.resize_handle_size_version !== resize_handle_size_version)
    {
        obj.settings.resize_handle_size = 8
        obj.resize_handle_size_version = resize_handle_size_version
        save = true
    }

    if(obj.settings.wrap_on_webview_cycle === undefined || obj.wrap_on_webview_cycle_version !== wrap_on_webview_cycle_version)
    {
        obj.settings.wrap_on_webview_cycle = true
        obj.wrap_on_webview_cycle_version = wrap_on_webview_cycle_version
        save = true
    }

    if(obj.settings.wrap_on_space_cycle === undefined || obj.wrap_on_space_cycle_version !== wrap_on_space_cycle_version)
    {
        obj.settings.wrap_on_space_cycle = true
        obj.wrap_on_space_cycle_version = wrap_on_space_cycle_version
        save = true
    }

    if(obj.settings.startpage === undefined || obj.startpage_version !== startpage_version)
    {
        obj.settings.startpage = 'https://www.startpage.com'
        obj.startpage_version = startpage_version
        save = true
    }

    if(obj.settings.searchpage === undefined || obj.searchpage_version !== searchpage_version)
    {
        obj.settings.searchpage = 'https://www.startpage.com/do/search?query='
        obj.searchpage_version = searchpage_version
        save = true
    }

    return save
}

// Save the local storage data
Bone.save_local_storage = function()
{
    localStorage.setItem(Bone.ls_name, JSON.stringify(Bone.storage))
}

// Resets storage object except presets
Bone.reset_settings = function()
{
    Bone.storage.settings = {}
    Bone.check_local_storage(Bone.storage)
    Bone.save_local_storage()
    Bone.call_menu_settings_actions()
    Bone.update_menu_settings_widgets()
    Bone.info('Settings resetted to defaults')
}