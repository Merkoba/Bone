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

    Bone.msg_swap_webviews = Msg.factory(Object.assign({}, common,
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

    Bone.msg_open_preset = Msg.factory(Object.assign({}, common,
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

    Bone.msg_handle_close_space = Msg.factory(Object.assign({}, common,
    {
        id: 'handle_close_space'
    }))

    Bone.msg_space_options = Msg.factory(Object.assign({}, common,
    {
        id: 'space_options'
    }))

    Bone.msg_handle_new_space = Msg.factory(Object.assign({}, common,
    {
        id: 'handle_new_space'
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
    Bone.msg_handle_close_space.set(Bone.template_handle_close_space())
    Bone.msg_space_options.set(Bone.template_space_options())
    Bone.msg_handle_new_space.set(Bone.template_handle_new_space())

    Bone.msg_create_preset.set_title('Save Preset')
    Bone.msg_autostart.set_title('AutoStart Presets')
    Bone.msg_handle_preset.set_title('Handle Preset')
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

// Setups the find functionality and widget
Bone.setup_find = function()
{
    Bone.find = new FindInPage(remote.getCurrentWebContents())
}

// Setups signals between the main process and here
Bone.setup_signals = function()
{
    ipcRenderer.on('on-find', (e, args) => 
    {
        Bone.find.openFindWindow()
    })
    
    ipcRenderer.on('on-new-space', (e, args) => 
    {
        Bone.new_space()
    })
}