// Menu options object
Bone.menu_options = 
{
    'theme':
    {
        type: 'color',
        action: (value) =>
        {
            Bone.storage.theme = value
            Bone.apply_theme()
        }
    },
    'auto_hide_panel':
    {
        type: 'checkbox',
        action: (value) =>
        {
            Bone.storage.auto_hide_panel = value
            Bone.apply_auto_hide_panel()
        }
    },
    'resize_handle_size':
    {
        type: 'number',
        action: (value) =>
        {
            Bone.storage.resize_handle_size = value
            Bone.update_resize_handle_style()
        }
    },
    'wrap_on_webview_cycle':
    {
        type: 'checkbox',
        action: (value) =>
        {
            Bone.storage.wrap_on_webview_cycle = value
        }
    },
    'wrap_on_space_cycle':
    {
        type: 'checkbox',
        action: (value) =>
        {
            Bone.storage.wrap_on_space_cycle = value
        }
    },
    'startpage':
    {
        type: 'text',
        action: (value) =>
        {
            Bone.storage.startpage = value
        }
    },
    'searchpage':
    {
        type: 'text',
        action: (value) =>
        {
            Bone.storage.searchpage = value
        }
    }
}

// Setup the menu window
Bone.setup_menu = function()
{
    Bone.$('#menu_back').addEventListener('click', function()
    {
        Bone.go_back()
    })

    Bone.$('#menu_history').addEventListener('click', function()
    {
        let space = Bone.space()

        if(space.focused_webview)
        {
            Bone.show_history()
        }
    })

    Bone.$('#menu_copy_url').addEventListener('click', function()
    {
        let url = Bone.get_current_url()

        if(url)
        {
            Bone.copy_string(url)
            Bone.info('URL copied to clipboard')
        }
    })

    Bone.$('#menu_autostart').addEventListener('click', function()
    {
        Bone.show_autostart_presets()
    })

    Bone.$('#menu_save_preset').addEventListener('click', function()
    {
        Bone.show_create_preset()
    })

    Bone.$('#menu_clear_presets').addEventListener('click', function()
    {
        Bone.clear_presets()
    })

    Bone.$('#menu_presets_select').addEventListener('change', function(e)
    {
        let selected = this.options[this.selectedIndex]

        if(!selected.value)
        {
            return false
        }

        Bone.show_handle_preset(selected.value)

        this.selectedIndex = 0
    })

    Bone.$('#menu_reset').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to reset the settings? This will not delete saved presets.'))
        {
            Bone.reset_storage()
        }
    })

    Bone.$('#menu_exit').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to exit?'))
        {
            Bone.exit()
        }
    })

    Bone.$('#menu_close_space').addEventListener('click', function()
    {
        Bone.show_handle_close_space()
    })

    Bone.$('#menu_duplicate_space').addEventListener('click', function()
    {
        Bone.duplicate_space()
    })

    Bone.$('#menu_new_space').addEventListener('click', function()
    {
        Bone.new_space()
        Bone.close_all_windows()
    })

    Bone.$('#menu_create_layout').addEventListener('click', function()
    {
        Bone.show_create_layout()
    })

    for(let option in Bone.menu_options)
    {
        let obj = Bone.menu_options[option]
        let el = Bone.$(`#menu_option_${option}`)

        if(obj.type === 'text' || obj.type === 'number')
        {
            el.addEventListener('blur', function(e)
            {
                obj.action(this.value)
                Bone.save_local_storage()
            })
        }

        else if(obj.type === 'color')
        {
            el.addEventListener('change', function(e)
            {
                obj.action(this.value)
                Bone.save_local_storage()
            })        
        }

        else if(obj.type === 'checkbox')
        {
            el.addEventListener('change', function(e)
            {
                obj.action(this.checked)
                Bone.save_local_storage()
            })
        }
    }

    Bone.update_menu_options_widgets()
}

// Updates widgest in the menu window
Bone.update_menu_options_widgets = function()
{
    for(let option in Bone.menu_options)
    {
        let obj = Bone.menu_options[option]
        let el = Bone.$(`#menu_option_${option}`)

        if(obj.type === 'text' || obj.type === 'number' || obj.type === 'color')
        {
            el.value = Bone.storage[option]
        }

        else if(obj.type === 'checkbox')
        {
            el.checked = Bone.storage[option]
        }
    }
}

// Calls the action function of every menu option
Bone.call_menu_options_actions = function()
{
    for(let option in Bone.menu_options)
    {
        let obj = Bone.menu_options[option]
        obj.action(Bone.storage[option])
    }  
}

// Shows the menu window
Bone.show_menu = function()
{
    Bone.msg_menu.show(function()
    {
        let disable_back = true

        if(Bone.focused())
        {
            let history = Bone.history()

            if(history && history.length > 1)
            {
                Bone.$('#menu_back').classList.remove('disabled')
                disable_back = false
            }
        }

        if(disable_back)
        {
            Bone.$('#menu_back').classList.add('disabled')
        }
    })
}