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

    let layout_version = 1
    let theme_version = 1
    let presets_version = 1
    let webview_version = 1
    let auto_hide_panel_version = 1
    let resize_handle_size_version = 1
    let cycle_spaces_on_wheel_version = 1
    let wrap_spaces_on_wheel_version = 1
    let special_version = 1
    let global_history_version = 1
    let download_locations_version = 1
    
    if(obj.layout_version !== layout_version)
    {
        obj.layout = '2_column'
        obj.layout_version = layout_version
        save = true
    }

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

    if(obj.webview_version !== webview_version)
    {
        obj.webview_1 = Bone.create_webview_object(1, 'https://mastodon.social')
        obj.webview_2 = Bone.create_webview_object(2, 'https://www.dubtrack.fm/join/the-underground')
        obj.webview_3 = Bone.create_webview_object(3, 'http://lab.serotoninphobia.info/')
        obj.webview_4 = Bone.create_webview_object(4, 'https://arisuchan.jp/')
        obj.webview_version = webview_version
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

    if(obj.cycle_spaces_on_wheel_version !== cycle_spaces_on_wheel_version)
    {
        obj.cycle_spaces_on_wheel = true
        obj.cycle_spaces_on_wheel_version = cycle_spaces_on_wheel_version
        save = true
    }

    if(obj.wrap_spaces_on_wheel_version !== wrap_spaces_on_wheel_version)
    {
        obj.wrap_spaces_on_wheel = true
        obj.wrap_spaces_on_wheel_version = wrap_spaces_on_wheel_version
        save = true
    }

    if(obj.special_version !== special_version)
    {
        obj.special = Bone.create_special_object()
        obj.special_version = special_version
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

    return save
}

// Save the local storage data
Bone.save_local_storage = function()
{
    let space = Bone.space()

    if(space)
    {
        Bone.storage.webview_1 = Bone.clone_object(space.webview_1)
        Bone.storage.webview_2 = Bone.clone_object(space.webview_2)
        Bone.storage.webview_3 = Bone.clone_object(space.webview_3)
        Bone.storage.webview_4 = Bone.clone_object(space.webview_4)
        Bone.storage.layout = space.layout
        Bone.storage.special = space.special
    }

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
    Bone.destroy_spaces()
    Bone.create_space(Bone.storage)
}

// Creates a default special object
Bone.create_special_object = function()
{
    let obj = {}
    obj.row_1 = 1
    return obj
}