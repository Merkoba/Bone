// Setups top panel
Bone.setup_top_panel = function()
{
    Bone.$('#menu_icon').addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            Bone.cycle_presets()
        }
    })

    let top_panel = Bone.$('#top_panel')

    top_panel.addEventListener('mouseenter', function()
    {
        clearInterval(Bone.top_panel_autohide_timeout)

        if(!Bone.top_panel_active)
        {
            Bone.show_top_panel()
        }
    })

    top_panel.addEventListener('mouseleave', function()
    {
        if(Bone.top_panel_active)
        {
            Bone.start_top_panel_auto_hide()
        }
    })

    top_panel.style.height = `${Bone.config.top_panel_height}px`
}

// Starts a timeout to automatically hide the top panel
Bone.start_top_panel_auto_hide = function()
{
    if(!Bone.storage.auto_hide_top_panel)
    {
        return false
    }

    clearInterval(Bone.top_panel_autohide_timeout)

    Bone.top_panel_autohide_timeout = setTimeout(function()
    {
        Bone.hide_top_panel()
    }, Bone.config.top_panel_auto_hide_delay)
}

// Shows the top panel
Bone.show_top_panel = function()
{
    clearInterval(Bone.top_panel_autohide_timeout)

    let tp = Bone.$('#top_panel')
    tp.style.top = '0'
    Bone.top_panel_active = true
}

// Hides the top panel
Bone.hide_top_panel = function()
{
    clearInterval(Bone.top_panel_autohide_timeout)

    let tp = Bone.$('#top_panel')
    tp.style.top = `-${Bone.config.top_panel_height - Bone.config.top_panel_hidden_height}px`
    Bone.top_panel_active = false
}

// Makes changes depending on auto hide top panel setting
Bone.apply_auto_hide_top_panel = function()
{
    if(Bone.storage.auto_hide_top_panel)
    {
        Bone.$('#webview_container').style.top = `${Bone.config.top_panel_hidden_height}px`
        Bone.start_top_panel_auto_hide()
    }
    
    else
    {
        Bone.$('#webview_container').style.top = `${Bone.config.top_panel_height}px`
        Bone.show_top_panel()
    }    
}