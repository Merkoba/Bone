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
    
    Bone.storage = obj

    if(save)
    {
        Bone.save_local_storage()
    }
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
        obj.webview_1 = {}
        save = true
    }

    if(obj.webview_1.url === undefined)
    {
        obj.webview_1.url = 'https://mastodon.social'
        save = true
    }

    if(obj.webview_1.zoom === undefined)
    {
        obj.webview_1.zoom = 1
        save = true
    }

    if(obj.webview_1.size === undefined)
    {
        obj.webview_1.size = 1
        save = true
    }

    if(obj.webview_2 === undefined)
    {
        obj.webview_2 = {}
        save = true
    }

    if(obj.webview_2.url === undefined)
    {
        obj.webview_2.url = 'https://www.dubtrack.fm/join/the-underground'
        save = true
    }

    if(obj.webview_2.zoom === undefined)
    {
        obj.webview_2.zoom = 1
        save = true
    }

    if(obj.webview_2.size === undefined)
    {
        obj.webview_2.size = 1
        save = true
    }

    if(obj.webview_3 === undefined)
    {
        obj.webview_3 = {}
        save = true
    }

    if(obj.webview_3.url === undefined)
    {
        obj.webview_3.url = 'http://lab.serotoninphobia.info/'
        save = true
    }

    if(obj.webview_3.zoom === undefined)
    {
        obj.webview_3.zoom = 1
        save = true
    }

    if(obj.webview_3.size === undefined)
    {
        obj.webview_3.size = 1
        save = true
    }

    if(obj.webview_4 === undefined)
    {
        obj.webview_4 = {}
        save = true
    }

    if(obj.webview_4.url === undefined)
    {
        obj.webview_4.url = 'https://arisuchan.jp/'
        save = true
    }

    if(obj.webview_4.zoom === undefined)
    {
        obj.webview_4.zoom = 1
        save = true
    }

    if(obj.webview_4.size === undefined)
    {
        obj.webview_4.size = 1
        save = true
    }

    if(obj.auto_hide_top_panel === undefined)
    {
        obj.auto_hide_top_panel = true
        save = true
    }

    if(obj.resize_handle_size === undefined)
    {
        obj.resize_handle_size = 4
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
    Bone.update_menu_window_widgets()
    Bone.apply_theme()
    Bone.apply_layout(true, true, 'yes')
}