// Compile all Handlebars templates
Bone.setup_templates = function()
{
    let templates = Bone.$$('.template')

    for(let template of templates)
    {
        Bone[template.id] = Handlebars.compile(Bone.$(`#${template.id}`).innerHTML)
    }
}

// Create Msg modal windows
Bone.create_windows = function()
{
    let common =
    {
        show_effect: 'none',
        close_effect: 'none'
    }

    let titlebar =
    {
        enable_titlebar: true,
        center_titlebar: true,
        titlebar_class: '!custom_titlebar !unselectable',
        window_inner_x_class: '!titlebar_inner_x'
    }

    Bone.msg_menu = Msg.factory(Object.assign({}, common, 
    {
        id: 'menu'
    }))

    Bone.msg_create_preset = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'create_preset',
        after_close: function()
        {
            Bone.$('#create_preset_name').value = ''
            Bone.$('#create_preset_autostart').checked = true
        }
    }))

    Bone.msg_handle_preset = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'handle_preset',
        after_close: function()
        {
            Bone.$('#handle_preset_name').value = ''
        }
    }))

    Bone.msg_swap_webviews = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'swap_webviews'
    }))

    Bone.msg_info = Msg.factory(Object.assign({}, common,
    {
        id: 'info'
    }))

    Bone.msg_history = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'history'
    }))

    Bone.msg_open_preset = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'open_preset'
    }))

    Bone.msg_autostart = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'autostart'
    }))

    Bone.msg_handle_history = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'handle_history'
    }))

    Bone.msg_space_options = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'space_options'
    }))

    Bone.msg_handle_new_space = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'handle_new_space'
    }))

    Bone.msg_handle_close_space = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'handle_close_space'
    }))

    Bone.msg_about = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'about'
    }))

    Bone.msg_recent = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'recent'
    }))

    Bone.msg_handle_download = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'handle_download'
    }))

    Bone.msg_create_layout = Msg.factory(Object.assign({}, common, titlebar,
    {
        id: 'create_layout'
    }))

    Bone.msg_menu.set(Bone.template_menu())
    Bone.msg_create_preset.set(Bone.template_create_preset())
    Bone.msg_handle_preset.set(Bone.template_handle_preset())
    Bone.msg_swap_webviews.set(Bone.template_swap_webviews())
    Bone.msg_info.set(Bone.template_info())
    Bone.msg_history.set(Bone.template_history())
    Bone.msg_open_preset.set(Bone.template_open_preset())
    Bone.msg_autostart.set(Bone.template_autostart())
    Bone.msg_handle_history.set(Bone.template_handle_history())
    Bone.msg_space_options.set(Bone.template_space_options())
    Bone.msg_handle_new_space.set(Bone.template_handle_new_space())
    Bone.msg_handle_close_space.set(Bone.template_handle_close_space())
    Bone.msg_about.set(Bone.template_about())
    Bone.msg_recent.set(Bone.template_recent())
    Bone.msg_handle_download.set(Bone.template_handle_download())
    Bone.msg_create_layout.set(Bone.template_create_layout())

    Bone.msg_create_preset.set_title('Save Preset')
    Bone.msg_autostart.set_title('AutoStart Presets')
    Bone.msg_handle_preset.set_title('Handle Preset')
    Bone.msg_space_options.set_title('Space Options')
    Bone.msg_handle_new_space.set_title('New Space')
    Bone.msg_handle_close_space.set_title('Close Space')
    Bone.msg_swap_webviews.set_title('Swap Webviews')
    Bone.msg_open_preset.set_title('Open Preset')
    Bone.msg_recent.set_title('Recent Websites')
    Bone.msg_handle_download.set_title('Download Location')
    Bone.msg_create_layout.set_title('Create Layout')
}

// Closes all modal windows
Bone.close_all_windows = function()
{
    Bone.msg_menu.close_all()
}

// Setups the info window
Bone.setup_info = function()
{
    Bone.$('#info_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.msg_info.close()
        }
    })
}

// Shows a message in the info window
Bone.info = function(message)
{
    let c = Bone.$('#info_container')
    c.textContent = message

    Bone.msg_info.show(function()
    {
        c.focus()
    })    
}

// Activates the main window resize listener
Bone.activate_resize_listener = function()
{
    let on_resize = Bone.debounce(function()
    {
        // Do nothing for now
    }, 500)

    window.addEventListener('resize', on_resize)
}

// Closes the application
Bone.exit = function()
{
    remote.getCurrentWindow().close()
}

// Starts removing the splash and showing the main container
Bone.remove_splash = function()
{
    setTimeout(function()
    {
        let container = Bone.$('#main_container')
        container.style.display = 'block'
        
        let splash = Bone.$('#splash')
        splash.style.opacity = 0
    
        setTimeout(function()
        {
            splash.style.display = 'none'
            container.style.backgroundColor = 'white'
        }, 1500)
    }, 500)
}

// Setups and starts UI separator operations
Bone.setup_separator = function()
{
    Bone.horizontal_separator = Separator.factory(
    {
        mode: 'horizontal'    
    })
    
    Bone.horizontal_separator_2 = Separator.factory(
    {
        mode: 'horizontal',
        class: 'no_opacity',
        margin_left: '10px',
        margin_right: '10px'  
    })

    let horizontal = Bone.$$('.separate_horizontal')

    for(let container of horizontal)
    {
        Bone.horizontal_separator.separate(container)
    }

    let horizontal_2 = Bone.$$('.separate_horizontal_2')

    for(let container of horizontal_2)
    {
        Bone.horizontal_separator_2.separate(container)
    }
}

// Setups signals between the main process and here
Bone.setup_signals = function()
{
    ipcRenderer.on('on-find', (e, args) => 
    {
        Bone.show_find()
    })
    
    ipcRenderer.on('on-new-space', (e, args) => 
    {
        Bone.new_space()
    })
    
    ipcRenderer.on('on-zoom-in', (e, args) => 
    {
        Bone.increase_zoom()
    })
    
    ipcRenderer.on('on-zoom-out', (e, args) => 
    {
        Bone.decrease_zoom()
    })
    
    ipcRenderer.on('on-zoom-reset', (e, args) => 
    {
        Bone.reset_zoom()
    })
    
    ipcRenderer.on('on-show-recent', (e, args) => 
    {
        Bone.show_recent()
    })
    
    ipcRenderer.on('on-webview-cycle-left', (e, args) => 
    {
        Bone.ghost_webviews_shot_on = true
        Bone.cycle_webview('left')
    })
    
    ipcRenderer.on('on-webview-cycle-right', (e, args) => 
    {
        
        Bone.ghost_webviews_shot_on = true
        Bone.cycle_webview('right')
    })
    
    ipcRenderer.on('on-space-cycle-left', (e, args) => 
    {
        Bone.cycle_space('left')
    })
    
    ipcRenderer.on('on-space-cycle-right', (e, args) => 
    {
        Bone.cycle_space('right')
    })
    
    ipcRenderer.on('on-focus-url', (e, args) => 
    {
        Bone.focus_url_input()
    })
    
    ipcRenderer.on('on-reload', (e, args) => 
    {
        Bone.reload()
    })
    
    ipcRenderer.on('on-hard-reload', (e, args) => 
    {
        Bone.hard_reload()
    })
    
    ipcRenderer.on('download-start', (e, args) => 
    {
        Bone.on_download_start(args)
    })
    
    ipcRenderer.on('download-update', (e, args) => 
    {
        Bone.on_download_update(args)
    })
    
    ipcRenderer.on('download-done', (e, args) => 
    {
        Bone.on_download_done(args)
    })
}

// Gets the project hash if it doesn't exist already and shows the about window
Bone.show_about = function()
{
    if(Bone.calculating_hash)
    {
        return false
    }

    if(Bone.hash_calculated)
    {
        return Bone.msg_about.show()
    }

    Bone.calculating_hash = true
    const HashFiles = require('hash-files')

    HashFiles({files:`${root_path}/app/**`}, function(error, hash)
    {
        Bone.calculating_hash = false
        Bone.hash_calculated = true
        Bone.hash = hash
        Bone.msg_about.set_title(Bone.hash)
        Bone.msg_about.show()
    })
}

// Creates and shows an info popup in the bottom right
Bone.show_info_popup = function(message, icon=false, on_click=false, autoclose=false, id=false)
{
    if(!on_click)
    {
        on_click = function(){}
    }

    let obj =
    {
        preset: 'popup',
        position: 'bottomright',
        autoclose: autoclose,
        autoclose_delay: 5000,
        window_width: 'auto',
        window_height: 'auto',
        on_click: on_click,
        window_class: '!unselectable',
        after_close: function()
        {
            if(id)
            {
                Bone.info_popups[id] = undefined
            }
        }
    }

    if(id)
    {
        obj.id = id
    }

    let popup = Msg.factory(obj)

    let item = document.createElement('div')
    item.classList.add('info_popup_item')
    item.classList.add('unselectable')

    if(icon)
    {
        let icon_el = document.createElement('i')
        icon_el.classList.add('info_popup_icon')
        
        if(icon === 'download')
        {
            icon_el.classList.add('fas')
            icon_el.classList.add('fa-download')
        }

        else if(icon === 'error')
        {
            icon_el.classList.add('fas')
            icon_el.classList.add('fa-exclamation-circle')
        }

        item.append(icon_el)
    }

    let text_el = document.createElement('div')
    text_el.classList.add('info_popup_text')
    text_el.textContent = message

    item.append(text_el)
    popup.show(item)
    return popup
}

// Checks if enable or disable titles
Bone.check_titles = function()
{
    let wvs = Bone.wvs()
    let spaces = Bone.get_spaces()

    if(wvs.length > 1)
    {
        Bone.$('#panel_focused').title = 'Wheel or Ctrl+Tab/Ctrl+Shift+Tab to cycle. Middle click to swap.'
    }
    
    else
    {
        Bone.$('#panel_focused').title = ''
    }
    
    if(spaces.length > 1)
    {
        Bone.$('#spaces').title = 'Wheel or Ctrl+Arrow to cycle. Shift+Wheel to move. Middle click to close.'
    }
    
    else
    {
        Bone.$('#spaces').title = ''
    }
}