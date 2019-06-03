// Setups the url bar
Bone.setup_url_input = function()
{
    let url = Bone.$('#url')

    url.addEventListener('keydown', function(e)
    {
        if(!Bone.url_suggest_on)
        {
            Bone.show_url_suggest()
        }

        if(e.key === 'ArrowDown')
        {
            Bone.url_suggest_move_down()
            e.preventDefault()
            return false
        }

        else if(e.key === 'ArrowUp')
        {
            Bone.url_suggest_move_up()
            e.preventDefault()
            return false
        }

        else if(e.key === 'Enter')
        {
            if(Bone.url_suggest_selected)
            {
                Bone.apply_url_suggest_selected()
            }

            else
            {
                Bone.change_url(this.value)
                Bone.hide_url_suggest()
            }
            
            e.preventDefault()
            return false
        }

        else
        {
            Bone.update_url_suggest()
        }
    })

    url.addEventListener('input', function(e)
    {
        if(!Bone.url_suggest_on)
        {
            Bone.show_url_suggest()
        }

        Bone.update_url_suggest()
    })

    url.addEventListener('blur', function()
    {
        if(Bone.url_suggest_on)
        {
            if(Bone.url_suggest_clicked)
            {
                return false
            }

            Bone.hide_url_suggest()
        }

        Bone.input_selected = false
    })

    url.addEventListener('click', function()
    {
        if(!Bone.input_selected)
        {
            Bone.move_cursor_to_end(this)
            this.select()
            Bone.input_selected = true
        }
    })
}

// Setups the url suggest box
Bone.setup_url_suggest = function()
{
    let box = Bone.$('#url_suggest')

    box.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('url_suggest_item'))
        {
            return false
        }

        Bone.change_url_suggest_selected(e.target)
        Bone.apply_url_suggest_selected()
    })

    box.addEventListener('mousedown', function()
    {
        Bone.url_suggest_clicked = true
    })
}

// Changes the selected url suggest item
Bone.change_url_suggest_selected = function(item)
{
    if(Bone.url_suggest_selected)
    {
        Bone.url_suggest_selected.classList.remove('url_suggest_selected')
    }

    item.classList.add('url_suggest_selected')
    Bone.url_suggest_selected = item
}

// Sets the url in the panel
Bone.update_url = function()
{
    let input = Bone.$('#url')
    input.value = Bone.swv().url
}

// Setups the url suggestion box
Bone.show_url_suggest = function()
{
    let box = Bone.$('#url_suggest')
    let url = Bone.$('#url')

    box.style.top = `${Bone.config.panel_height}px`
    box.style.left = `${url.offsetLeft + 10}px`
    box.style.display = 'grid'
    Bone.url_suggest_selected = false
    Bone.url_suggest_clicked = false
    Bone.url_suggest_on = true
}

// Hides the url suggestion box
Bone.hide_url_suggest = function()
{
    let box = Bone.$('#url_suggest')
    box.style.display = 'none'
    Bone.url_suggest_on = false
}

// Updates the url suggest box
Bone.update_url_suggest = function()
{
    let url = Bone.$('#url')
    let value = url.value.trim()
    let box = Bone.$('#url_suggest')
    Bone.url_suggest_selected = false
    box.innerHTML = ''

    if(!value)
    {
        return false
    }

    let matches = Bone.find_url_matches(value)

    if(matches.length === 0)
    {
        return false
    }
    
    for(let url of matches.slice(0, 20))
    {
        let item = document.createElement('div')
        item.classList.add('url_suggest_item')
        item.classList.add('action')
        item.textContent = url
        item.dataset.url = url
        box.append(item)
    }
}

// Moves down a step in the url suggest box
Bone.url_suggest_move_down = function()
{
    let items = Bone.$$('.url_suggest_item')
    
    if(items.length === 0)
    {
        return false
    }

    let n = 0

    if(Bone.url_suggest_selected)
    {
        n = Bone.get_child_index(Bone.url_suggest_selected) + 1
    }

    if(n > items.length - 1)
    {
        return false
    }

    let item = Bone.get_child_at_index(Bone.$('#url_suggest'), n)
    Bone.change_url_suggest_selected(item)
}

// Moves up a step in the url suggest box
Bone.url_suggest_move_up = function()
{
    let items = Bone.$$('.url_suggest_item')

    if(items.length === 0)
    {
        return false
    }

    let n = Bone.get_child_index(Bone.url_suggest_selected) - 1

    if(n < 0)
    {
        return false
    }

    let item = Bone.get_child_at_index(Bone.$('#url_suggest'), n)
    Bone.change_url_suggest_selected(item)
}

// Applies the action for the selected url suggest item
Bone.apply_url_suggest_selected = function()
{
    if(!Bone.url_suggest_selected)
    {
        return false
    }

    Bone.change_url(Bone.url_suggest_selected.dataset.url)
    Bone.hide_url_suggest()
}