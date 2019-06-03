// Setups top panel
Bone.setup_panel = function()
{
    let menu_icon = Bone.$('#menu_icon')

    menu_icon.addEventListener('click', function(e)
    {
        Bone.show_menu()
    })

    menu_icon.addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            Bone.new_space()
        }
    })

    let panel = Bone.$('#panel')

    panel.addEventListener('click', function(e)
    {
        if(e.target === this)
        {
            Bone.show_menu()
        }
    })

    panel.addEventListener('mouseenter', function()
    {
        clearInterval(Bone.panel_autohide_timeout)

        if(!Bone.panel_active)
        {
            Bone.show_panel()
        }
    })

    panel.addEventListener('mouseleave', function()
    {
        if(Bone.panel_active)
        {
            Bone.start_panel_auto_hide()
        }
    })

    panel.addEventListener('wheel', function(e)
    {
        if(!Bone.storage.cycle_spaces_on_wheel)
        {
            return false
        }

        if(e.deltaY < 0)
        {
            Bone.switch_space('left')
        }

        else
        {
            Bone.switch_space('right')
        }
    })

    let spaces = Bone.$('#spaces')

    spaces.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('spaces_item'))
        {
            return false
        }

        if(parseInt(e.target.dataset.num) === Bone.current_space)
        {
            let space = Bone.space()

            if(space.name)
            {
                Bone.show_handle_preset(space.name)
            }

            else
            {
                Bone.info('You can create presets based on current settings. You can open them in different spaces, as well as setting them to autostart.')
            }
        }

        else
        {
            Bone.change_space(parseInt(e.target.dataset.num))
        }
    })

    spaces.addEventListener('auxclick', function(e)
    {
        if(!e.target.classList.contains('spaces_item'))
        {
            return false
        }

        if(e.which === 2)
        {
            Bone.close_space(parseInt(e.target.dataset.num))
        }
    })

    Bone.$('#panel_history').addEventListener('click', function(e)
    {
        Bone.show_history()
    })

    Bone.$('#panel_zoom_in').addEventListener('click', function(e)
    {
        Bone.increase_zoom(Bone.num())
    })

    Bone.$('#panel_zoom_out').addEventListener('click', function(e)
    {
        Bone.decrease_zoom(Bone.num())
    })

    Bone.$('#panel_focused').addEventListener('click', function(e)
    {
        let num = Bone.num() + 1

        if(num > Bone.wvs().length)
        {
            num = 1
        }

        Bone.focus_webview(num)
    })

    panel.style.height = `${Bone.config.panel_height}px`
}

// Starts a timeout to automatically hide the top panel
Bone.start_panel_auto_hide = function()
{
    if(!Bone.storage.auto_hide_panel)
    {
        return false
    }

    clearInterval(Bone.panel_autohide_timeout)

    Bone.panel_autohide_timeout = setTimeout(function()
    {
        Bone.hide_panel()
    }, Bone.config.panel_auto_hide_delay)
}

// Shows the top panel
Bone.show_panel = function()
{
    clearInterval(Bone.panel_autohide_timeout)

    let tp = Bone.$('#panel')
    tp.style.top = '0'
    Bone.panel_active = true
}

// Hides the top panel
Bone.hide_panel = function()
{
    clearInterval(Bone.panel_autohide_timeout)

    let tp = Bone.$('#panel')
    tp.style.top = `-${Bone.config.panel_height - Bone.config.panel_hidden_height}px`
    Bone.panel_active = false
}

// Makes changes depending on auto hide top panel setting
Bone.apply_auto_hide_panel = function()
{
    if(Bone.storage.auto_hide_panel)
    {
        Bone.$('#webview_containers').style.top = `${Bone.config.panel_hidden_height}px`
        Bone.start_panel_auto_hide()
    }
    
    else
    {
        Bone.$('#webview_containers').style.top = `${Bone.config.panel_height}px`
        Bone.show_panel()
    }    
}

// Updates the webview indicator in the panel
Bone.update_focused_webview = function()
{
    Bone.$('#panel_focused').textContent = `Focused: ${Bone.num()}`
}