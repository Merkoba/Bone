// Setups the recent window
Bone.setup_recent = function()
{
    let c = Bone.$('#recent_container')

    c.addEventListener('click', function(e)
    {
        let item = e.target.closest('.recent_item')

        if(!item)
        {
            return false
        }

        Bone.submit_recent(item.dataset.url)
    })

    Bone.$('#recent_search').addEventListener('keydown', function(e)
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

    Bone.$('#recent_search').addEventListener('input', Bone.debounce(function(e)
    {
        Bone.generate_recent(this.value.trim())
    }, 250))
}

// Shows the recent window
Bone.show_recent = function()
{
    Bone.generate_recent()
    Bone.$('#recent_search').value = ''

    Bone.msg_recent.show(function()
    {
        Bone.$('#recent_search').focus()
    })
}

// Generates a list of global history items based on their weight
Bone.generate_recent = function(search_term=false)
{
    let c = Bone.$('#recent_container')
    c.innerHTML = ''
    let items

    if(!search_term)
    {
        items = Bone.storage.global_history.slice(0, Bone.config.max_recent_items)
    }

    else
    {
        items = Bone.find_global_history_matches(search_term, Bone.config.max_recent_items, true)
    }

    for(let item of items)
    {
        let el = document.createElement('div')
        el.classList.add('recent_item')
        el.classList.add('action')
        el.dataset.url = item.url
        el.title = item.url

        if(item.favicon_url)
        {
            let favicon_el = document.createElement('img')
            favicon_el.classList.add('recent_item_favicon')
            favicon_el.src = item.favicon_url

            favicon_el.addEventListener('error', function()
            {
                this.style.display = 'none'
            })

            el.append(favicon_el)
        }

        let url_el = document.createElement('div')
        url_el.classList.add('recent_item_url')

        let content = 
            item.title ? 
            item.title.substring(0, Bone.config.small_title_length) : 
            item.url.substring(0, Bone.config.small_url_length)

        url_el.textContent = content
        el.append(url_el)

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
    Bone.recent_item_selected.scrollIntoView({block:'center'})
}

// Uses the selected recent item to change the url
Bone.submit_recent = function(url)
{
    url = url.trim()

    let spaces = Bone.get_spaces()

    for(let space of spaces)
    {
        if(space.num === Bone.current_space)
        {
            continue
        }

        let swvs = Bone.swvs(space.num)
        let n = 1

        for(let swv of swvs)
        {
            if(swv.url === url)
            {
                Bone.show_handle_open_recent(n, space.num, url)
                return false
            }

            n += 1
        }
    }

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

// Setups the handle open recent window
Bone.setup_handle_open_recent = function()
{
    Bone.$('#handle_open_recent_here').addEventListener('click', function(e)
    {
        Bone.change_url(Bone.handle_open_recent_url)
        Bone.close_all_windows()
    })
    
    Bone.$('#handle_open_recent_existing').addEventListener('click', function(e)
    {
        Bone.change_space(Bone.handle_open_recent_space_num)
        Bone.focus(Bone.handle_open_recent_num)
        Bone.close_all_windows()
    })

    Bone.$('#handle_open_recent_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.change_url(Bone.handle_open_recent_url)
            Bone.close_all_windows()
        }
    })
}

// Shows the handle open recent wi
Bone.show_handle_open_recent = function(num, space_num, url)
{
    Bone.handle_open_recent_num = num
    Bone.handle_open_recent_space_num = space_num
    Bone.handle_open_recent_url = url

    Bone.msg_handle_open_recent.show(function()
    {
        Bone.$('#handle_open_recent_container').focus()
    })
}