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
        Bone.do_handle_preset_apply(Bone.handled_preset)
    })

    Bone.$('#handle_preset_submit').addEventListener('click', function()
    {
        Bone.do_handle_preset_update(Bone.$('#handle_preset_name').value)
    })
    
    Bone.$('#handle_preset_delete').addEventListener('click', function()
    {
        if(confirm('Are you sure?'))
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
                Bone.do_handle_preset_apply(Bone.handled_preset)
            }
        }
    })
}

// Does the apply preset action
Bone.do_handle_preset_apply = function(name)
{
    Bone.apply_preset(name)
    Bone.close_all_windows()
}

// Does the edit preset action
Bone.do_handle_preset_update = function(name)
{
    let oname = Bone.handled_preset
    Bone.save_preset(name, oname)
    Bone.update_presets()
    Bone.msg_handle_preset.close()
    Bone.info(`Preset '${name}' updated`)
}

// Updates the presets container
Bone.update_presets = function()
{
    let c = Bone.$('#menu_window_presets_select')
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
        Bone.$('#menu_window_clear_presets').classList.remove('disabled')
    }
    
    else
    {
        Bone.$('#menu_window_clear_presets').classList.add('disabled')
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

    if(replace && name !== replace)
    {
        delete Bone.storage.presets[replace]
    }

    let obj = Bone.clone_object(Bone.storage)
    obj.presets = undefined
    obj.last_used = Date.now()
    Bone.storage.presets[name] = obj
    Bone.save_local_storage()

    return true
}

// Changes settings to a specified preset
Bone.apply_preset = function(name)
{
    if(!Bone.storage.presets[name])
    {
        return false
    }

    Bone.storage.presets[name].last_used = Date.now()
    let obj = Bone.clone_object(Bone.storage.presets[name])
    obj.presets = Bone.clone_object(Bone.storage.presets)
    Bone.storage = obj
    
    Bone.save_local_storage()
    Bone.update_menu_window_widgets()
    Bone.apply_layout(false, true)
    Bone.apply_theme()
    Bone.apply_size()
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
    Bone.handled_preset = name
    Bone.$('#handle_preset_name').value = name
    Bone.$('#handle_preset_container').focus()
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

    Bone.apply_preset(presets[Bone.preset_index])
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