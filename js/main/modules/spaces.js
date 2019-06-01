// Creates a space and adds it to the spaces array
Bone.create_space = function(obj)
{
    if(!obj.name)
    {
        obj.name = ''
    }

    let space = Bone.create_space_from_object(obj, Bone.spaces.length + 1)
    Bone.spaces.push(space)
    Bone.create_webview_container(Bone.spaces.length)
    Bone.change_space(Bone.spaces.length)
    Bone.update_spaces()
}

// Gets the current space or a specified space
Bone.space = function(n=-1)
{
    if(n === -1)
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
    Bone.update_menu_widgets()
}

// Returns the active webview container
Bone.webview_container = function(n=0)
{   
    if(!n)
    {
        n = Bone.current_space
    }

    return Bone.$(`#webview_container_${n}`)
}

// Gets a webview by its number
Bone.wv = function(num)
{
    return Bone.webview_container().querySelector(`.webview_${num}`)
}

// Updates spaces in the top panel
Bone.update_spaces = function()
{
    let spaces = Bone.get_spaces()
    let c = Bone.$('#spaces')
    c.innerHTML = ''

    for(let space of spaces)
    {   
        let el = document.createElement('div')
        el.classList.add('spaces_item')
        el.classList.add('action')
        el.textContent = space.name || 'Default Space'
        el.dataset.num = space.num
        c.append(el)
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
            item.classList.add('underline')
        }
        
        else
        {
            item.classList.remove('underline')
        }
    }
}

// Gets all the webviews from the current container
Bone.wvs = function()
{
    return Bone.webview_container().querySelectorAll('.webview')
}

// Creates and prepares a space object
Bone.create_space_from_object = function(obj, n)
{
    let space = {}
    space.webview_1 = Bone.clone_object(obj.webview_1)
    space.webview_2 = Bone.clone_object(obj.webview_2)
    space.webview_3 = Bone.clone_object(obj.webview_3)
    space.webview_4 = Bone.clone_object(obj.webview_4)
    space.layout = obj.layout
    space.name = obj.name
    space.num = n
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

Bone.start_spaces = function()
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
    if(Bone.get_spaces().length === 1)
    {
        return false
    }

    if(n === false)
    {
        n = Bone.current_space
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