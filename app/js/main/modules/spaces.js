// Creates a space and adds it to the spaces array
Bone.create_space = function(obj={})
{
    let space = Bone.create_space_from_object(obj)
    Bone.spaces.push(space)
    Bone.create_webview_container(space.num)
    Bone.change_space(space.num)
    Bone.update_spaces()
}

// Gets the current space or a specified space
Bone.space = function(space_num=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    return Bone.spaces[space_num - 1]
}

// Changes a specified space
Bone.change_space = function(n, obj=false)
{
    if(!Bone.spaces[n - 1])
    {
        Bone.create_space(obj)
        return false
    }

    let c = Bone.webview_container()

    if(c)
    {
        c.style.display = 'none'
    }

    Bone.$(`#webview_container_${n}`).style.display = 'grid'
    
    if(obj)
    {
        Bone.spaces[n - 1] = Bone.create_space_from_object(obj, n)
    }

    Bone.current_space = n

    let space = Bone.space()
    let wvs = Bone.wvs()

    if(wvs.length === 0)
    {
        Bone.apply_layout(n)
    }

    Bone.update_spaces()

    if(space.focused_webview)
    {
        Bone.focus_wv(space.focused_webview)
    }

    else
    {
        Bone.focus(1)
    }

    Bone.update_focused_webview()
    Bone.check_ghost_webviews()
    Bone.check_titles()
}

// Updates spaces in the top panel
Bone.update_spaces = function()
{
    let spaces = Bone.get_spaces()
    let name = ''
    let c = Bone.$('#spaces')
    c.innerHTML = ''

    if(spaces.length === 1)
    {
        if(!spaces[0].name)
        {
            name = 'Default Space'
        }
    }

    let n = 1

    for(let space of spaces)
    {   
        let el = document.createElement('div')
        el.classList.add('spaces_item')
        el.classList.add('action')
        el.textContent = space.name || name || n
        el.dataset.num = space.num
        c.append(el)
        n += 1
    }

    Bone.update_active_space()
}

// Adds a class to active space in the top panel
Bone.update_active_space = function()
{
    let items = Bone.$$('.spaces_item')

    for(let item of items)
    {
        if(parseInt(item.dataset.num) === Bone.current_space)
        {
            item.classList.add('spaces_item_selected')
        }
        
        else
        {
            item.classList.remove('spaces_item_selected')
        }
    }
}

// Creates and prepares a space object
Bone.create_space_from_object = function(obj, n=false)
{
    if(!n)
    {
        n = Bone.spaces.length + 1
    }

    let space = {}

    if(Object.keys(obj).length > 0)
    {
        space.webviews = Bone.clone_object(obj.webviews)
        space.container_sizes = Bone.clone_object(obj.container_sizes)
        space.layout = obj.layout
        space.name = obj.name || ''
    }

    else
    {
        space.webviews = [Bone.create_webview_object(1, Bone.storage.startpage)]
        space.container_sizes = {}
        space.layout = ''
        space.name = ''
    }

    space.num = n
    space.is_space = true
    return space
}

// Gets the space to the right of current space
Bone.get_space_right = function(wrap=true)
{
    let spaces = Bone.get_spaces()

    if(spaces.length === 1)
    {
        return false
    }

    for(let i=0; i<spaces.length; i++)
    {
        let space = spaces[i]

        if(space.num === Bone.current_space)
        {
            new_space = spaces[i + 1]
            break
        }
    }
        
    if(!new_space)
    {
        if(wrap)
        {
            new_space = spaces[0]
        }

        else
        {
            return false
        }
    }

    return new_space
}

// Gets the space to the right of current space
Bone.get_space_left = function(wrap=true)
{
    let spaces = Bone.get_spaces()

    if(spaces.length === 1)
    {
        return false
    }

    for(let i=0; i<spaces.length; i++)
    {
        let space = spaces[i]

        if(space.num === Bone.current_space)
        {
            new_space = spaces[i - 1]
            break
        }
    }
        
    if(!new_space)
    {
        if(wrap)
        {
            new_space = spaces[spaces.length - 1]
        }

        else
        {
            return false
        }
    }

    return new_space
}

// Goes to the next or previous space
Bone.cycle_space = function(direction='right')
{
    let spaces = Bone.get_spaces()

    if(spaces.length === 1)
    {
        return false
    }

    let new_space

    if(direction === 'right')
    {
        new_space = Bone.get_space_right(Bone.storage.wrap_on_space_cycle)
        
        if(!new_space)
        {
            return false
        }
    }

    else if(direction === 'left')
    {
        new_space = Bone.get_space_left(Bone.storage.wrap_on_space_cycle)
        
        if(!new_space)
        {
            return false
        }
    }

    if(new_space.num === Bone.current_space)
    {
        return false
    }

    Bone.change_space(new_space.num)
}

Bone.start_autostart_spaces = function()
{
    let autostart = Bone.get_autostart_presets()

    if(autostart.length > 0)
    {
        for(let preset of autostart)
        {
            preset.last_used = Date.now()
            Bone.create_space(preset)
        }

        Bone.save_local_storage()
        Bone.change_space(1)
    }

    else
    {
        Bone.create_space()
    }
}

// Closes current or specified space
Bone.close_space = function(n=false)
{
    if(n === false)
    {
        n = Bone.current_space
    }

    if(Bone.get_spaces().length === 1)
    {
        Bone.new_space()
    }

    if(n === Bone.current_space)
    {
        let new_space = Bone.get_space_left() || Bone.get_space_right()

        if(new_space)
        {
            Bone.change_space(new_space.num)
        }
    }

    Bone.remove_element(Bone.$(`#webview_container_${n}`))
    Bone.spaces[n - 1] = undefined
    Bone.update_spaces()
}

// Returns defined spaces
Bone.get_spaces = function()
{
    let spaces = []

    for(let space of Bone.spaces)
    {
        if(space)
        {
            spaces.push(space)
        }
    }

    return spaces
}

// Space modified signal
Bone.space_modified = function(space_num=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }
    
    let space = Bone.space(space_num)

    if(space.name)
    {
        if(Bone.get_preset(space.name).autoupdate)
        {
            Bone.save_preset(space, false)
        }
    }
}

// Destroys all spaces
Bone.destroy_spaces = function()
{
    let containers = Bone.$$('.webview_container')

    for(let container of containers)
    {
        Bone.remove_element(container)
    }

    Bone.spaces = []
    Bone.current_space = 0
}

// Duplicates current space
Bone.duplicate_space = function()
{
    let space = Bone.space()

    if(space.name)
    {
        let preset = Bone.get_preset(space.name)
        Bone.create_space(preset)
    }

    else
    {
        Bone.create_space()
    }
}

// Creates a new empty space
Bone.new_space = function()
{
    Bone.create_space()
}

Bone.swv = function(num=false, space_num=false)
{
    if(!num)
    {
        num = Bone.num()
    }

    return Bone.space(space_num).webviews[num - 1]
}

Bone.swvs = function(space_num=false)
{
    return Bone.space(space_num).webviews
}

// Setups the handle close space window
Bone.setup_handle_close_space = function()
{
    Bone.$('#handle_close_space_close').addEventListener('click', function(e)
    {
        Bone.close_space(Bone.handled_close_space)
        Bone.msg_handle_close_space.close()
    })
 
    Bone.$('#handle_close_space_close_left').addEventListener('click', function(e)
    {
        Bone.close_space_left(Bone.handled_close_space)
        Bone.msg_handle_close_space.close()
    })
 
    Bone.$('#handle_close_space_close_right').addEventListener('click', function(e)
    {
        Bone.close_space_right(Bone.handled_close_space)
        Bone.msg_handle_close_space.close()
    })
 
    Bone.$('#handle_close_space_close_others').addEventListener('click', function(e)
    {
        Bone.close_space_others(Bone.handled_close_space)
        Bone.msg_handle_close_space.close()
    })
 
    Bone.$('#handle_close_space_close_all').addEventListener('click', function(e)
    {
        Bone.close_space_all(Bone.handled_close_space)
        Bone.msg_handle_close_space.close()
    })
}

Bone.show_handle_close_space = function(n=false)
{
    if(!n)
    {
        n = Bone.current_space
    }

    Bone.handled_close_space = n
    Bone.msg_handle_close_space.show()
}

Bone.close_space_left = function(n)
{
    let spaces = Bone.get_spaces()
    
    for(let space of spaces)
    {
        if(space.num !== n)
        {
            Bone.close_space(space.num)
        }

        else
        {
            break
        }
    }
}

Bone.close_space_right = function(n)
{
    let spaces = Bone.get_spaces()
    
    for(let space of spaces.slice(0).reverse())
    {
        if(space.num !== n)
        {
            Bone.close_space(space.num)
        }

        else
        {
            break
        }
    }
}

Bone.close_space_others = function(n)
{
    let spaces = Bone.get_spaces()
    
    for(let space of spaces.slice(0).reverse())
    {
        if(space.num !== n)
        {
            Bone.close_space(space.num)
        }
    }
}

Bone.close_space_all = function()
{
    let spaces = Bone.get_spaces()
    
    for(let space of spaces.slice(0).reverse())
    {
        Bone.close_space(space.num)
    }
}

// Closes all spaces and restarts using the autostart presets
Bone.restart_autostart_spaces = function()
{
    if(!confirm('Are you sure you want to restart using the AutoStart presets?'))
    {
        return false
    }

    Bone.destroy_spaces()
    Bone.start_autostart_spaces()
    Bone.close_all_windows()
}

// Setups the space options window
Bone.setup_space_options = function()
{
    Bone.$('#space_options_new').addEventListener('click', function(e)
    {
        Bone.show_handle_new_space()
        Bone.msg_space_options.close()
    })
    
    Bone.$('#space_options_close').addEventListener('click', function(e)
    {
        Bone.show_handle_close_space()
        Bone.msg_space_options.close()
    })
}

// Shows the space options window
Bone.show_space_options = function()
{
    Bone.msg_space_options.show()
}

// Setups the handle new space window
Bone.setup_handle_new_space = function()
{
    Bone.$('#handle_new_space_empty').addEventListener('click', function(e)
    {
        Bone.new_space()
        Bone.close_all_windows() 
    })

    Bone.$('#handle_new_space_presets').addEventListener('change', function(e)
    {
        let selected = this.options[this.selectedIndex]

        if(!selected.value)
        {
            return false
        }

        let preset = Bone.get_preset(selected.value)
        preset.name = selected.value

        Bone.create_space(preset)

        this.selectedIndex = 0

        Bone.close_all_windows()
    })
}

// Shows the handle new space window
Bone.show_handle_new_space = function()
{
    Bone.msg_handle_new_space.show()
}

// Moves a space to the left in the panel
Bone.move_space_left = function(item)
{
    let items = Bone.$$('.spaces_item')

    if(items.length < 2)
    {
        return false
    }

    let index = Bone.get_element_index(item)
    let n
    
    if(index === 0)
    {
        n = items.length - 1
        let el = item.parentNode.children[n]
        el.after(item)
    }

    else
    {
        n = index - 1
        let el = item.parentNode.children[n]
        el.before(item)
    }
}

// Moves a space to the right in the panel
Bone.move_space_right = function(item)
{
    let items = Bone.$$('.spaces_item')

    if(items.length < 2)
    {
        return false
    }

    let index = Bone.get_element_index(item)
    let n
    
    if(index >= items.length - 1)
    {
        n = 0
        let el = item.parentNode.children[n]
        el.before(item)
    }

    else
    {
        n = index + 1
        let el = item.parentNode.children[n]
        el.after(item)
    }
}

// Sets the size of a container
Bone.set_container_size = function(n, value, space_num=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    if(isNaN(n) && n.startsWith('c_'))
    {
        n = parseInt(n.replace('c_', ''))
    }

    Bone.space(space_num).container_sizes[n] = value
}

// Gests the size of a container
Bone.get_container_size = function(n, space_num=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    if(isNaN(n) && n.startsWith('c_'))
    {
        n = parseInt(n.replace('c_', ''))
    }

    return Bone.space(space_num).container_sizes[n]
}