// Setups top panel
Bone.setup_panel = function()
{
    let panel = Bone.$('#panel')

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
            Bone.cycle_space('left')
        }

        else
        {
            Bone.cycle_space('right')
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
                Bone.show_create_preset()                
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

    spaces.addEventListener('wheel', function(e)
    {
        if(!e.target.classList.contains('spaces_item'))
        {
            return false
        }

        if(e.shiftKey)
        {
            if(e.deltaY < 0)
            {
                Bone.move_space_left(e.target)
            }
    
            else
            {
                Bone.move_space_right(e.target)
            }

            e.stopPropagation()
            return false
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
        Bone.cycle_webview('right')
    })

    let panel_menu_container = Bone.$('#panel_menu_container')

    panel_menu_container.addEventListener('click', function(e)
    {
        Bone.show_menu()
    })

    panel_menu_container.addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            Bone.show_about()
        }
    })

    Bone.$('#panel_space_options_container').addEventListener('click', function(e)
    {
        Bone.show_space_options()
    })

    Bone.$('#panel_space_options_container').addEventListener('auxclick', function(e)
    {
        Bone.new_space()
    })

    Bone.$('#panel_zoom_container').addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            Bone.reset_zoom(Bone.num())
        }
    })

    Bone.$('#panel_refresh').addEventListener('click', function(e)
    {
        Bone.refresh_webview(Bone.num())
    })

    Bone.$('#panel_recent').addEventListener('click', function(e)
    {
        Bone.show_recent()
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

    for(let webview of Bone.wvs())
    {
        webview.classList.remove('webview_focused')
    }

    Bone.focused().classList.add('webview_focused')
}