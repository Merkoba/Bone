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

    let theme_version = 1
    let presets_version = 1
    let auto_hide_panel_version = 1
    let resize_handle_size_version = 1
    let wrap_on_webview_cycle_version = 1
    let wrap_on_space_cycle_version = 1
    let global_history_version = 1
    let download_locations_version = 1
    let startpage_version = 1

    if(obj.theme_version !== theme_version)
    {
        obj.theme = '#464f6c'
        obj.theme_version = theme_version
        save = true
    }

    if(obj.presets_version !== presets_version)
    {
        obj.presets = []
        obj.presets_version = presets_version
        save = true
    }

    if(obj.auto_hide_panel_version !== auto_hide_panel_version)
    {
        obj.auto_hide_panel = false
        obj.auto_hide_panel_version = auto_hide_panel_version
        save = true
    }

    if(obj.resize_handle_size_version !== resize_handle_size_version)
    {
        obj.resize_handle_size = 8
        obj.resize_handle_size_version = resize_handle_size_version
        save = true
    }

    if(obj.wrap_on_webview_cycle_version !== wrap_on_webview_cycle_version)
    {
        obj.wrap_on_webview_cycle = true
        obj.wrap_on_webview_cycle_version = wrap_on_webview_cycle_version
        save = true
    }

    if(obj.wrap_on_space_cycle_version !== wrap_on_space_cycle_version)
    {
        obj.wrap_on_space_cycle = true
        obj.wrap_on_space_cycle_version = wrap_on_space_cycle_version
        save = true
    }

    if(obj.global_history_version !== global_history_version)
    {
        obj.global_history = []
        obj.global_history_version = global_history_version
        save = true
    }

    if(obj.download_locations_version !== download_locations_version)
    {
        obj.download_locations = []
        obj.download_locations_version = download_locations_version
        save = true
    }

    if(obj.startpage_version !== startpage_version)
    {
        obj.startpage = 'https://www.startpage.com'
        obj.startpage_version = startpage_version
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
Bone.reset_storage = function()
{
    let presets = Bone.clone_object(Bone.storage.presets)
    localStorage.removeItem(Bone.ls_name)
    Bone.get_local_storage()
    Bone.storage.presets = presets
    Bone.save_local_storage()
    Bone.update_menu_widgets()
    Bone.apply_theme()
    Bone.info('Settings resetted to defaults')
}