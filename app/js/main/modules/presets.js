// Setups the create preset window
Bone.setup_create_preset = function()
{
    Bone.$('#create_preset_submit').addEventListener('click', function()
    {
        Bone.do_create_preset()
    })

    Bone.$('#create_preset_name').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.do_create_preset()
        }
    })
}

// Does the create preset action
Bone.do_create_preset = function(name)
{
    let obj = {}
    obj.name = Bone.$('#create_preset_name').value
    obj.autostart = Bone.$('#create_preset_autostart').checked
    obj.autoupdate = Bone.$('#create_preset_autoupdate').checked

    if(!Bone.save_preset(obj))
    {
        return false
    }

    Bone.update_presets()
    Bone.msg_create_preset.close()
    Bone.msg_handle_preset.close()
    Bone.info(`Preset '${obj.name}' created`)

    if(obj.autostart)
    {
        Bone.update_autostart_order()
    }

    Bone.space().name = obj.name
    Bone.space_modified()
    Bone.update_spaces()
}

// Setups the edit preset window
Bone.setup_handle_preset = function()
{
    Bone.$('#handle_preset_open').addEventListener('click', function()
    {
        Bone.open_preset(Bone.handled_preset, true)
        Bone.close_all_windows()
    })

    Bone.$('#handle_preset_submit').addEventListener('click', function()
    {
        Bone.do_handle_preset_update(Bone.$('#handle_preset_name').value)
    })

    Bone.$('#handle_preset_save').addEventListener('click', function()
    {
        Bone.show_create_preset()
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
                Bone.show_open_preset()
            }
        }
    })
    
    Bone.$('#handle_preset_autostart').addEventListener('click', function(e)
    {
        let preset = Bone.get_preset(Bone.handled_preset)
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
    
    Bone.$('#handle_preset_autoupdate').addEventListener('click', function(e)
    {
        let preset = Bone.get_preset(Bone.handled_preset)
        preset.autoupdate = !preset.autoupdate
        Bone.save_local_storage()
        Bone.update_handle_preset_autoupdate(Bone.handled_preset)
    })
}

// Does the edit preset action
Bone.do_handle_preset_update = function(name)
{
    let oname = Bone.handled_preset

    if(name !== oname)
    {
        Bone.replace_preset(oname, name)
    }

    Bone.save_preset({name:name}, false)
    Bone.update_presets()
    Bone.msg_handle_preset.close()
    Bone.info(`Preset '${name}' updated`)
}

// Updates the presets container
Bone.update_presets = function()
{
    let c = Bone.$('#menu_presets_select')
    let c_2 = Bone.$('#handle_new_space_presets')
    c.innerHTML = ''

    Bone.storage.presets.sort(function(a, b)
    {
        return a.last_used - b.last_used
    })

    for(let preset of Bone.storage.presets)
    {
        let el = document.createElement('option')
        el.textContent = preset.name
        el.value = preset.name
        let el_2 = el.cloneNode(true)
        c.prepend(el)
        c_2.prepend(el_2)
    }

    let el = document.createElement('option')
    el.textContent = '-- Presets --'
    el.value = ''
    el.selected = true
    let el_2 = el.cloneNode(true)
    el_2.selected = true
    c.prepend(el)
    c_2.prepend(el_2)

    if(Bone.storage.presets.length > 0)
    {
        Bone.$('#menu_clear_presets').classList.remove('disabled')
    }
    
    else
    {
        Bone.$('#menu_clear_presets').classList.add('disabled')
    }
}

// Saves a preset based on current state
Bone.save_preset = function(obj, warn_replace=true, space_num=false)
{
    obj.name = obj.name.trim()
    
    if(!obj.name)
    {
        return false
    }
    
    let preset = Bone.get_preset(obj.name)
    let autostart = true
    let autoupdate = true
    let replace = false

    if(preset)
    {
        autostart = preset.autostart
        autoupdate = preset.autoupdate

        if(warn_replace)
        {
            if(!confirm('A preset with this name already exists. Are you sure you want to overwrite it?'))
            {
                return false
            }
        }

        replace = true
    }

    let prst = {}

    if(replace)
    {
        prst = preset
    }

    if(!space_num)
    {
        space_num = Bone.current_space
    }

    let space = obj.is_space ? obj : Bone.space(space_num)

    prst.name = obj.name
    prst.autostart = autostart
    prst.autoupdate = autoupdate
    prst.webviews = Bone.clone_object(space.webviews)
    prst.container_sizes = Bone.clone_object(space.container_sizes)
    prst.layout = space.layout
    prst.last_used = Date.now()
    prst.version = Bone.config.preset_version

    if(!replace)
    {
        Bone.storage.presets.push(prst)
    }

    Bone.save_local_storage()
    return true
}

// Changes settings to a specified preset
Bone.open_preset = function(name, new_space=false)
{
    let preset = Bone.get_preset(name)

    if(!preset)
    {
        return false
    }

    preset.last_used = Date.now()
    preset.name = name

    if(new_space)
    {
        Bone.create_space(preset)
    }
    
    else
    {
        Bone.change_space(Bone.current_space, preset)
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

    Bone.do_delete_preset(name)
    
    let changed = false
    
    for(let space of Bone.get_spaces())
    {
        if(space.name === name)
        {
            space.name = ''
            changed = true
        }
    }
    
    if(changed)
    {
        Bone.update_spaces()
    }
    
    Bone.update_autostart_presets()
    Bone.save_local_storage()
}

// Shows and prepares the edit preset window
Bone.show_handle_preset = function(name)
{
    let preset = Bone.get_preset(name)

    if(!preset)
    {
        return false
    }

    Bone.handled_preset = name
    Bone.$('#handle_preset_name').value = name
    Bone.update_handle_preset_autostart(name)
    Bone.update_handle_preset_autoupdate(name)
    
    Bone.msg_handle_preset.show(function()
    {
        Bone.$('#handle_preset_container').focus()
    })
}

// Clears saved presets
Bone.clear_presets = function()
{
    if(confirm('Are you sure you want to delete all the saved presets?'))
    {
        Bone.storage.presets_version = -1
        Bone.check_local_storage(Bone.storage)
        Bone.save_local_storage()
        Bone.update_presets()

        for(let space of Bone.get_spaces())
        {
            space.name = ''
        }

        Bone.update_spaces()
        Bone.info('All the presets have been deleted')
    }
}

// Setups the open preset window
Bone.setup_open_preset = function()
{
    Bone.$('#open_preset_here').addEventListener('click', function(e)
    {
        Bone.open_preset(Bone.handled_preset, false)
        Bone.close_all_windows()
    })
 
    Bone.$('#open_preset_space').addEventListener('click', function(e)
    {
        Bone.open_preset(Bone.handled_preset, true)
        Bone.close_all_windows()
    })

    Bone.$('#open_preset_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.open_preset(Bone.handled_preset, true)
            Bone.close_all_windows()
        }
    })
}

// Changes the autostart label depending on state
Bone.update_handle_preset_autostart = function(name)
{
    let preset = Bone.get_preset(name)

    if(preset.autostart)
    {
        Bone.$('#handle_preset_autostart').textContent = 'Disable AutoStart'
    }
        
    else
    {
        Bone.$('#handle_preset_autostart').textContent = 'Enable AutoStart'
    }
}

// Changes the autoupdate label depending on state
Bone.update_handle_preset_autoupdate = function(name)
{
    let preset = Bone.get_preset(name)

    if(preset.autoupdate)
    {
        Bone.$('#handle_preset_autoupdate').textContent = 'Disable AutoUpdate'
    }
        
    else
    {
        Bone.$('#handle_preset_autoupdate').textContent = 'Enable AutoUpdate'
    }
}

// Gets a list of autostarted presets
Bone.get_autostart_presets = function()
{
    let autostart = []

    for(let preset of Bone.storage.presets)
    {
        if(preset.autostart)
        {
            autostart.push(preset)
        }
    }

    autostart.sort(function(a, b)
    {
        return a.autostart_index - b.autostart_index
    })

    return autostart
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
                let el = e.target.parentNode.children[e.target.parentNode.children.length - 1]
                el.after(e.target)
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
                let el = e.target.parentNode.children[0]
                el.before(e.target)
            }
        }

        Bone.update_autostart_order()
    })

    Bone.$('#autostart_disable').addEventListener('click', function(e)
    {
        Bone.disable_all_autostart()
    })

    Bone.$('#autostart_restart').addEventListener('click', function(e)
    {
        Bone.restart_autostart_spaces()
    })

    Bone.update_autostart_order()
}

// Shows a list of autostarted presets
Bone.show_autostart_presets = function()
{
    Bone.msg_autostart.show()
}

// Updates the autostart presets window
Bone.update_autostart_presets = function()
{
    let autostart = Bone.get_autostart_presets()
    let c = Bone.$('#autostart_items')
    c.innerHTML = ''
    
    if(autostart.length > 0)
    {
        for(let preset of autostart)
        {
            let el = document.createElement('div')
            el.classList.add('autostart_item')
            el.classList.add('action')
            el.textContent = preset.name
            el.dataset.name = preset.name
            el
    
            c.append(el)
        }

        Bone.$('#autostart_info').style.display = 'block'
        Bone.$('#autostart_buttons').style.display = 'flex'
    }
    
    else
    {
        c.textContent = `You haven't set any preset to autostart yet`
        Bone.$('#autostart_info').style.display = 'none'
        Bone.$('#autostart_buttons').style.display = 'none'
    }
}

// Updates the order of the enabled autostart presets
Bone.update_autostart_order = function()
{
    let items = Bone.$$('.autostart_item')

    for(let i=0; i<items.length; i++)
    {
        let item = items[i]
        let preset = Bone.get_preset(item.dataset.name)
        preset.autostart_index = i
    }

    Bone.update_autostart_presets()
    Bone.save_local_storage()
}

// Shows the open preset window
Bone.show_open_preset = function()
{
    Bone.msg_open_preset.show(function()
    {
        Bone.$('#open_preset_container').focus()
    })
}

// Shows the create preset window
Bone.show_create_preset = function()
{
    Bone.$('#create_preset_autostart').checked = true
    Bone.$('#create_preset_autoupdate').checked = true

    Bone.msg_create_preset.show(function()
    {
        Bone.$('#create_preset_name').focus()
    })
}

// Deletes a preset
Bone.replace_preset = function(oname, name)
{
    Bone.get_preset(name)

    let changed = false

    for(let space of Bone.get_spaces())
    {
        if(space.name === oname)
        {
            space.name = name
            changed = true
        }
    }

    if(changed)
    {
        Bone.update_spaces()
    }
}

// Disables all autostart presets from autostarting
Bone.disable_all_autostart = function()
{
    if(!confirm('Are you sure you want to disable all AutoStart presets?'))
    {
        return false
    }
    
    let autostart = Bone.get_autostart_presets()

    for(let preset of autostart)
    {
        preset.autostart = false
    }

    Bone.save_local_storage()
    Bone.update_autostart_presets()
}

// Checks for outdated presets
Bone.check_presets = function()
{
    let presets = []
    let changed = false

    for(let preset of Bone.storage.presets)
    {
        if(preset.version === Bone.config.preset_version)
        {
            presets.push(preset)
        }

        else
        {
            changed = true
        }
    }

    if(changed)
    {
        Bone.storage.presets = presets
        Bone.save_local_storage()
    }
}

// Gets a preset by name
Bone.get_preset = function(name)
{
    for(let preset of Bone.storage.presets)
    {
        if(preset.name === name)
        {
            return preset
        }
    }

    return false
}

// Deletes a preset
Bone.do_delete_preset = function(name)
{
    for(let i=0; i<Bone.storage.presets.length; i++)
    {
        let preset = Bone.storage.presets[i]

        if(preset.name === name)
        {
            Bone.storage.presets.splice(i, 1)
            break
        }
    }
}