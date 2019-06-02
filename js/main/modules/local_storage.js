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
    
    if(obj.layout === undefined)
    {
        obj.layout = '2_column'
        save = true
    }

    if(obj.theme === undefined)
    {
        obj.theme = '#000000'
        save = true
    }

    if(obj.presets === undefined)
    {
        obj.presets = {}
        save = true
    }

    if(obj.webview_1 === undefined)
    {
        obj.webview_1 = Bone.create_webview_object(1, 'https://mastodon.social')
        save = true
    }

    if(obj.webview_2 === undefined)
    {
        obj.webview_2 = Bone.create_webview_object(2, 'https://www.dubtrack.fm/join/the-underground')
        save = true
    }

    if(obj.webview_3 === undefined)
    {
        obj.webview_3 = Bone.create_webview_object(3, 'http://lab.serotoninphobia.info/')
        save = true
    }

    if(obj.webview_4 === undefined)
    {
        obj.webview_4 = Bone.create_webview_object(4, 'https://arisuchan.jp/')
        save = true
    }

    if(obj.auto_hide_panel === undefined)
    {
        obj.auto_hide_panel = false
        save = true
    }

    if(obj.resize_handle_size === undefined)
    {
        obj.resize_handle_size = 8
        save = true
    }

    if(obj.cycle_spaces_on_wheel === undefined)
    {
        obj.cycle_spaces_on_wheel = true
        save = true
    }

    if(obj.wrap_spaces_on_wheel === undefined)
    {
        obj.wrap_spaces_on_wheel = true
        save = true
    }

    if(obj.special === undefined)
    {
        obj.special = Bone.create_special_object()
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
    obj.row_1 = Bone.config.size_default
    return obj
}