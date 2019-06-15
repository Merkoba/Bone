// Menu settings object
Bone.menu_settings = 
{
    'theme':
    {
        type: 'color',
        process: (value) => 
        {
            return value
        },
        action: (value) =>
        {
            Bone.apply_theme()
        }
    },
    'auto_hide_panel':
    {
        type: 'checkbox',
        process: (value) => 
        {
            return value
        },
        action: (value) =>
        {
            Bone.apply_auto_hide_panel()
        }
    },
    'resize_handle_size':
    {
        type: 'number',
        process: (value) =>
        {
            let num = parseInt(value)

            if(isNaN(num))
            {
                num = 8
            }

            if(num < 0)
            {
                num = 1
            }

            else if(num > 100)
            {
                num = 100
            }
            
            Bone.$('#menu_setting_resize_handle_size').value = num
            return num
        },
        action: (value) =>
        {
            Bone.update_resize_handle_style()
        }
    },
    'wrap_on_webview_cycle':
    {
        type: 'checkbox',
        process: (value) => 
        {
            return value
        },
        action: (value) => {}
    },
    'wrap_on_space_cycle':
    {
        type: 'checkbox',
        process: (value) => 
        {
            return value
        },
        action: (value) => {}
    },
    'startpage':
    {
        type: 'text',
        process: (value) =>
        {
            value = value.trim()
            Bone.$('#menu_setting_startpage').value = value
            return value
        },
        action: (value) => {}
    },
    'searchpage':
    {
        type: 'text',
        process: (value) =>
        {
            value = value.trim()
            Bone.$('#menu_setting_searchpage').value = value
            return value
        },
        action: (value) => {}
    }
}

// Setup the menu window
Bone.setup_menu = function()
{
    Bone.$('#menu_autostart').addEventListener('click', function()
    {
        Bone.show_autostart_presets()
    })

    Bone.$('#menu_create_preset').addEventListener('click', function()
    {
        Bone.show_create_preset()
    })

    Bone.$('#menu_clear_presets').addEventListener('click', function()
    {
        Bone.clear_presets()
    })

    Bone.$('#menu_presets_select').addEventListener('change', function(e)
    {
        let selected = this.settings[this.selectedIndex]

        if(!selected.value)
        {
            return false
        }

        Bone.show_handle_preset(selected.value)

        this.selectedIndex = 0
    })

    Bone.$('#menu_exit').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to exit?'))
        {
            Bone.exit()
        }
    })

    Bone.$('#menu_create_layout').addEventListener('click', function()
    {
        Bone.show_create_layout()
    })

    Bone.$('#menu_reset').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to reset the settings? This will not delete saved presets, history, or download locations.'))
        {
            Bone.reset_settings()
        }
    })

    for(let setting in Bone.menu_settings)
    {
        let obj = Bone.menu_settings[setting]
        let el = Bone.$(`#menu_setting_${setting}`)

        if(obj.type === 'text' || obj.type === 'number')
        {
            el.addEventListener('blur', function(e)
            {
                let value = obj.process(this.value)
                Bone.storage.settings[setting] = value
                obj.action(value)
                Bone.save_local_storage()
            })
        }

        else if(obj.type === 'color')
        {
            el.addEventListener('change', function(e)
            {
                let value = obj.process(this.value)
                Bone.storage.settings[setting] = value
                obj.action(value)
                Bone.save_local_storage()
            })        
        }

        else if(obj.type === 'checkbox')
        {
            el.addEventListener('change', function(e)
            {
                let value = obj.process(this.checked)
                Bone.storage.settings[setting] = value
                obj.action(value)
                Bone.save_local_storage()
            })
        }
    }

    Bone.update_menu_settings_widgets()
}

// Updates widgest in the menu window
Bone.update_menu_settings_widgets = function()
{
    for(let setting in Bone.menu_settings)
    {
        let obj = Bone.menu_settings[setting]
        let el = Bone.$(`#menu_setting_${setting}`)

        if(obj.type === 'text' || obj.type === 'number' || obj.type === 'color')
        {
            el.value = Bone.storage.settings[setting]
        }

        else if(obj.type === 'checkbox')
        {
            el.checked = Bone.storage.settings[setting]
        }
    }
}

// Calls the action function of every menu setting
Bone.call_menu_settings_actions = function()
{
    for(let setting in Bone.menu_settings)
    {
        let obj = Bone.menu_settings[setting]
        obj.action(Bone.storage.settings[setting])
    }  
}

// Shows the menu window
Bone.show_menu = function()
{
    Bone.msg_menu.show()
}