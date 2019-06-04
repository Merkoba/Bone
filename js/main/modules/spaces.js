// Creates a space and adds it to the spaces array
Bone.create_space = function(obj)
{
    let space = Bone.create_space_from_object(obj)
    Bone.spaces.push(space)
    Bone.create_webview_container(Bone.spaces.length)
    Bone.change_space(Bone.spaces.length)
    Bone.update_spaces()
}

// Gets the current space or a specified space
Bone.space = function(n=false)
{
    if(!n)
    {
        n = Bone.current_space
    }

    return Bone.spaces[n - 1]
}

// Changes a specified space
Bone.change_space = function(n, obj=false)
{
    if(!Bone.spaces[n - 1])
    {
        Bone.create_space(obj)
        return false
    }

    if(Bone.current_space >= 1)
    {
        Bone.$(`#webview_container_${Bone.current_space}`).style.display = 'none'
    }

    Bone.$(`#webview_container_${n}`).style.display = 'grid'
    
    if(obj)
    {
        Bone.spaces[n - 1] = Bone.create_space_from_object(obj, n)
    }
    
    Bone.current_space = n
    Bone.update_spaces()
    Bone.apply_layout(false, false)
    Bone.update_webview_widgets()
    Bone.focus_webview()
    Bone.update_focused_webview()
}

// Returns the active webview container
Bone.webview_container = function(n=false)
{   
    if(!n)
    {
        n = Bone.current_space
    }

    return Bone.$(`#webview_container_${n}`)
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

// Gets all the webviews from the current container
Bone.wvs = function()
{
    return Bone.webview_container().querySelectorAll('.webview')
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
        space.webview_1 =Bone.clone_object(obj.webview_1)
        space.webview_2 = Bone.clone_object(obj.webview_2)
        space.webview_3 = Bone.clone_object(obj.webview_3)
        space.webview_4 = Bone.clone_object(obj.webview_4)
        space.special = Bone.clone_object(obj.special)
        space.layout = obj.layout
        space.name = obj.name || ''
    }

    else
    {
        space.webview_1 = Bone.create_webview_object(1, Bone.config.startpage)
        space.webview_2 = Bone.create_webview_object(2, Bone.config.startpage)
        space.webview_3 = Bone.create_webview_object(3, Bone.config.startpage)
        space.webview_4 = Bone.create_webview_object(4, Bone.config.startpage)
        space.special = Bone.create_special_object()
        space.layout = 'single'
        space.name = ''
    }

    space.num = n
    
    space.history =
    {
        webview_1: [],
        webview_2: [],
        webview_3: [],
        webview_4: []
    }

    return space
}

// Goes to the next or previous space
Bone.switch_space = function(direction='right')
{
    let new_space

    if(direction === 'right')
    {
        new_space = Bone.get_space_right(Bone.storage.wrap_spaces_on_wheel)
        
        if(!new_space)
        {
            return false
        }
    }

    else if(direction === 'left')
    {
        new_space = Bone.get_space_left(Bone.storage.wrap_spaces_on_wheel)
        
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
        for(let name of autostart)
        {
            let preset = Bone.storage.presets[name]
            preset.last_used = Date.now()
            Bone.create_space(preset)
        }

        Bone.save_local_storage()
        Bone.change_space(1)
    }

    else
    {
        Bone.create_space(Bone.storage)
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

// Gets the space to the right of current space
Bone.get_space_right = function(wrap=false)
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
Bone.get_space_left = function(wrap=false)
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

// Space modified signal
Bone.space_modified = function()
{
    // Do nothing for now
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
        let preset = Bone.storage.presets[space.name]
        preset.name = space.name
        Bone.create_space(preset)
    }

    else
    {
        Bone.create_space(Bone.storage)
    }
}

// Creates a new empty space
Bone.new_space = function()
{
    Bone.create_space({})
}

Bone.swv = function(num=false, space=false)
{
    if(!num)
    {
        num = Bone.num()
    }

    return Bone.space(space)[`webview_${num}`]
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

        let preset = Bone.storage.presets[selected.value]
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