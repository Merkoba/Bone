// Setups the recent window
Bone.setup_recent = function()
{
    let c = Bone.$('#recent_container')

    c.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('recent_item'))
        {
            return false
        }

        Bone.submit_recent(e.target.dataset.url)
    })

    Bone.$('#recent_filter').addEventListener('keydown', function(e)
    {
        if(e.key === 'Enter')
        {
            if(Bone.recent_item_selected)
            {
                Bone.submit_recent(Bone.recent_item_selected.dataset.url)
            }
            
            e.preventDefault()
            return false
        }

        else if(e.key === 'ArrowDown')
        {
            Bone.recent_move_down()
            e.preventDefault()
            return false
        }

        else if(e.key === 'ArrowUp')
        {
            Bone.recent_move_up()
            e.preventDefault()
            return false
        }
    })
}

// Shows the recent window
Bone.show_recent = function()
{
    Bone.generate_recent()
    Bone.$('#recent_filter').value = ''

    Bone.msg_recent.show(function()
    {
        Bone.$('#recent_filter').focus()
    })
}

// Generates a list of global history items based on their weight
Bone.generate_recent = function()
{
    let c = Bone.$('#recent_container')
    c.innerHTML = ''

    for(let item of Bone.storage.global_history)
    {
        let el = document.createElement('div')
        el.classList.add('recent_item')
        el.classList.add('filter_item')
        el.classList.add('action')
        el.dataset.url = item.url
        el.dataset.filter_content = item.url
        el.textContent = item.url.substring(0, 100)
        c.append(el)
    }

    Bone.visible_recent_items = Bone.$$('.recent_item')
    Bone.recent_item_index = 0
    Bone.change_recent_item_selected(Bone.visible_recent_items[0])
}

// Changes the selected recent window item
Bone.change_recent_item_selected = function(item)
{
    if(Bone.recent_item_selected)
    {
        Bone.recent_item_selected.classList.remove('modal_item_selected')
    }

    if(!item)
    {
        Bone.recent_item_selected = false
        return false
    }

    item.classList.add('modal_item_selected')
    Bone.recent_item_selected = item
}

// Uses the selected recent item to change the url
Bone.submit_recent = function(url)
{
    Bone.change_url(url)
    Bone.close_all_windows()
}

// Goes down in the recent list
Bone.recent_move_down = function()
{
    let items = Bone.visible_recent_items
    
    if(items.length === 0)
    {
        return false
    }

    let n = 0

    n = Bone.recent_item_index + 1

    if(n > items.length - 1)
    {
        return false
    }

    let item = items[n]
    Bone.recent_item_index = n
    Bone.change_recent_item_selected(item) 
}

// Goes up in the recent list
Bone.recent_move_up = function()
{
    let items = Bone.visible_recent_items

    if(items.length === 0)
    {
        return false
    }

    let n = Bone.recent_item_index - 1

    if(n < 0)
    {
        return false
    }

    let item = items[n]
    Bone.recent_item_index = n
    Bone.change_recent_item_selected(item)
}

// Updates the recent list on filter changes
Bone.update_recent = function(args)
{
    Bone.visible_recent_items = args.visible
    Bone.recent_item_index = 0
    Bone.change_recent_item_selected(Bone.visible_recent_items[0])
}