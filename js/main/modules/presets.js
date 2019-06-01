// Setups the create preset window
Bone.setup_create_preset = function()
{
    Bone.$('#create_preset_submit').addEventListener('click', function()
    {
        Bone.do_create_preset(Bone.$('#create_preset_name').value)
    })

    Bone.$('#create_preset_name').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.do_create_preset(this.value)
        }
    })
}

// Does the create preset action
Bone.do_create_preset = function(name)
{
    if(!Bone.save_preset(name))
    {
        return false
    }

    Bone.update_presets()
    Bone.msg_create_preset.close()
    Bone.info(`Preset '${name}' created`)
}

// Setups the edit preset window
Bone.setup_handle_preset = function()
{
    Bone.$('#handle_preset_apply').addEventListener('click', function()
    {
        Bone.msg_open_preset.show()
    })

    Bone.$('#handle_preset_submit').addEventListener('click', function()
    {
        Bone.do_handle_preset_update(Bone.$('#handle_preset_name').value)
    })
    
    Bone.$('#handle_preset_delete').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to delete this preset?'))
        {
            let name = Bone.handled_preset
            Bone.delete_preset(name)
            Bone.update_presets()
            Bone.msg_handle_preset.close()
            Bone.info(`Preset '${name}' deleted`)
        }
    })
    
    Bone.$('#handle_preset_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            if(document.activeElement === Bone.$('#handle_preset_name'))
            {
                Bone.do_handle_preset_update(Bone.$('#handle_preset_name').value)
            }

            else
            {
                Bone.msg_open_preset.show()
            }
        }
    })
    
    Bone.$('#handle_preset_autostart').addEventListener('click', function(e)
    {
        let preset = Bone.storage.presets[Bone.handled_preset]
        preset.autostart = !preset.autostart

        if(preset.autostart)
        {
            preset.autostart_index = 0
        }

        else
        {
            preset.autostart_index = undefined
        }

        Bone.save_local_storage()
        Bone.update_handle_preset_autostart(Bone.handled_preset)
        Bone.update_autostart_order()
    })
}

// Does the edit preset action
Bone.do_handle_preset_update = function(name)
{
    if(confirm('Are you sure you want to update this preset with the current settings?'))
    {
        let oname = Bone.handled_preset
        Bone.save_preset(name, oname)
        Bone.update_presets()
        Bone.msg_handle_preset.close()
        Bone.info(`Preset '${name}' updated`)
    }
}

// Updates the presets container
Bone.update_presets = function()
{
    let c = Bone.$('#menu_presets_select')
    c.innerHTML = ''

    let keys_sorted = Object.keys(Bone.storage.presets).sort(function(a, b)
    {
        return Bone.storage.presets[a].last_used - Bone.storage.presets[b].last_used
    })

    for(let name of keys_sorted)
    {
        let el = document.createElement('option')
        el.textContent = name
        el.value = name
        c.prepend(el)
    }

    let el = document.createElement('option')
    el.textContent = '-- Presets --'
    el.value = ''
    el.selected = true
    c.prepend(el)

    if(keys_sorted.length > 0)
    {
        Bone.$('#menu_clear_presets').classList.remove('disabled')
    }
    
    else
    {
        Bone.$('#menu_clear_presets').classList.add('disabled')
    }
}

// Saves a preset based on current state
Bone.save_preset = function(name, replace=false)
{
    name = name.trim()
    
    if(!name)
    {
        return false
    }
    
    let preset = Bone.storage.presets[name]
    let autostart = false

    if(preset)
    {
        autostart = preset.autostart
    }

    if(replace && name !== replace)
    {
        delete Bone.storage.presets[replace]
        oname = replace
    }
    
    let obj = {}
    let space = Bone.space()
    obj.autostart = autostart
    obj.webview_1 = Bone.clone_object(space.webview_1)
    obj.webview_2 = Bone.clone_object(space.webview_2)
    obj.webview_3 = Bone.clone_object(space.webview_3)
    obj.webview_4 = Bone.clone_object(space.webview_4)
    obj.layout = space.layout
    obj.last_used = Date.now()
    Bone.storage.presets[name] = obj
    Bone.save_local_storage()

    return true
}

// Changes settings to a specified preset
Bone.open_preset = function(name, new_space=false)
{
    if(!Bone.storage.presets[name])
    {
        return false
    }

    let preset = Bone.storage.presets[name]
    Bone.check_local_storage(preset)
    preset.last_used = Date.now()
    preset.name = name

    if(new_space === false)
    {
        Bone.change_space(Bone.current_space, preset)
    }

    else
    {
        Bone.create_space(preset)
    }
    
    Bone.save_local_storage()
    Bone.update_presets()
}

// Deletes a preset
Bone.delete_preset = function(name)
{
    name = name.trim()

    if(!name)
    {
        return false
    }

    delete Bone.storage.presets[name]
    Bone.save_local_storage()
}

// Shows and prepares the edit preset window
Bone.show_handle_preset = function(name)
{
    let preset = Bone.storage.presets[name]

    if(!preset)
    {
        return false
    }

    Bone.handled_preset = name
    Bone.$('#handle_preset_name').value = name
    Bone.update_handle_preset_autostart(name)
    Bone.$('#handle_preset_container').focus()
    Bone.msg_handle_preset.show()
}

// Cycles between presets
Bone.cycle_presets = function()
{
    let presets = Object.keys(Bone.storage.presets)

    if(presets.length === 0)
    {
        return false
    }

    if(Bone.preset_index >= presets.length - 1)
    {
        Bone.preset_index = 0
    }

    else
    {
        Bone.preset_index += 1
    }

    Bone.open_preset(presets[Bone.preset_index])
}

// Clears saved presets
Bone.clear_presets = function()
{
    if(confirm('Are you sure you want to delete all the saved presets?'))
    {
        Bone.storage.presets = {}
        Bone.save_local_storage()
        Bone.update_presets()
        Bone.info('All the presets have been deleted')
    }
}

// Setups the apply preset window
Bone.setup_open_preset = function()
{
    Bone.$('#open_preset_here').addEventListener('click', function()
    {
        Bone.open_preset(Bone.handled_preset, false)
        Bone.close_all_windows()
    })
 
    Bone.$('#open_preset_space').addEventListener('click', function()
    {
        Bone.open_preset(Bone.handled_preset, 0)
        Bone.close_all_windows()
    })
}

// Changes the autostart label depending on state
Bone.update_handle_preset_autostart = function(name)
{
    let preset = Bone.storage.presets[name]

    if(preset.autostart)
    {
        Bone.$('#handle_preset_autostart').textContent = 'Disable AutoStart'
    }
        
    else
    {
        Bone.$('#handle_preset_autostart').textContent = 'Enable AutoStart'
    }
}

// Gets a list of autostarted presets
Bone.get_autostart_presets = function()
{
    let autostart = []

    for(let name in Bone.storage.presets)
    {
        let preset = Bone.storage.presets[name]

        if(preset.autostart)
        {
            preset.name = name
            autostart.push(preset)
        }
    }

    let sorted = autostart.sort(function(a, b)
    {
        return a.autostart_index - b.autostart_index
    })

    let names = []

    sorted.map(preset => names.push(preset.name))

    return names
}

// Setups the presets autostart window
Bone.setup_autostart = function()
{
    Bone.$('#autostart_items').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('autostart_item'))
        {
            return false
        }

        Bone.show_handle_preset(e.target.textContent)
    })

    Bone.$('#autostart_items').addEventListener('wheel', function(e)
    {
        if(!e.target.classList.contains('autostart_item'))
        {
            return false
        }
        
        let index = Bone.get_element_index(e.target)

        if(e.deltaY < 0)
        {
            if(index > 0)
            {
                let el = e.target.parentNode.children[index - 1]
                el.before(e.target)
            }

            else
            {
                return false
            }
        }

        else
        {
            if(index < e.target.parentNode.children.length - 1)
            {
                let el = e.target.parentNode.children[index + 1]
                el.after(e.target)
            }

            else
            {
                return false
            }
        }

        Bone.update_autostart_order()
    })

    Bone.update_autostart_order()
}

// Shows a list of autostarted presets
Bone.show_autostart_presets = function()
{
    let autostart = Bone.get_autostart_presets()
    let c = Bone.$('#autostart_items')
    c.innerHTML = ''

    for(let name of autostart)
    {
        let el = document.createElement('div')
        el.classList.add('autostart_item')
        el.classList.add('action')
        el.textContent = name
        el.dataset.name = name
        el

        c.append(el)
    }

    Bone.msg_autostart.show()
}

// Updates the order of the enabled autostart presets
Bone.update_autostart_order = function()
{
    let items = Bone.$$('.autostart_item')

    for(let i=0; i<items.length; i++)
    {
        let item = items[i]
        let preset = Bone.storage.presets[item.dataset.name]
        preset.autostart_index = i
    }

    Bone.save_local_storage()
}