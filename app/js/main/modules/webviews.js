// Create a webview from a template
Bone.create_webview = function(num, space_num)
{
    let h = Bone.template_webview({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wv = el.querySelector('webview')
    wv.id = `webview_${Date.now().toString().slice(-8)}_${Bone.random_sequence(4)}`
    wv.dataset.num = num
    wv.dataset.space = space_num

    wv.addEventListener('dom-ready', function()
    {
        Bone.on_webview_dom_ready(this)
    })

    wv.addEventListener('focus', function()
    {
        Bone.on_webview_focus(wv)
    })

    wv.addEventListener('will-navigate', function(e)
    {
        Bone.handle_navigation(this, e)
    })

    wv.addEventListener('will-redirect', function(e)
    {
        Bone.handle_navigation(this, e)
    })

    wv.addEventListener('new-window', function(e)
    {
        Bone.handle_navigation(this, e)
    })

    wv.addEventListener('found-in-page', function(e)
    {
        if(e.result.finalUpdate)
        {
            Bone.update_find_results(e.result)
        }
    })

    wv.addEventListener('did-navigate', function(e)
    {
        if(!e.url)
        {
            return false
        }

        let num = parseInt(wv.dataset.num)
        let space_num = parseInt(wv.dataset.space)
        Bone.push_to_history(wv, e.url)
        Bone.swv(num, space_num).url = e.url
        Bone.space_modified(space_num)
        Bone.update_url(space_num)
        Bone.add_to_global_history(e.url)
    })

    wv.addEventListener('context-menu', function(e)
    {
        Bone.handle_context_menu(e)
    })

    wv.addEventListener('page-favicon-updated', function(e)
    {
        let swv = Bone.swv(parseInt(wv.dataset.num), parseInt(wv.dataset.space))
        Bone.update_favicon(swv.url, e.favicons[0])
    })

    wv.addEventListener('page-title-updated', function(e)
    {
        let swv = Bone.swv(parseInt(wv.dataset.num), parseInt(wv.dataset.space))
        Bone.update_title(swv.url, e.title)
    })

    wv.addEventListener('did-fail-load', function(e)
    {
        if(e.errorCode === -3)
        {
            return false
        }

        let num = parseInt(wv.dataset.num)
        let space_num = parseInt(wv.dataset.space_num)
        let swv = Bone.swv(num, space_num)

        if(swv.url.startsWith('https://'))
        {
            let new_url = swv.url.replace('https://', 'http://')
            Bone.change_url(new_url, num, space_num)
        }
    })

    return wv
}

// Replaces a webview with a new one
// This is to destroy its content
Bone.remake_webview = function(num, space_num=false, url='', no_display=true, reset_history=true)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    let wv = Bone.wv(num)
    let rep = Bone.create_webview(num, space_num)

    if(no_display)
    {
        rep.style.display = 'none'
    }

    else
    {
        rep.style.display = ''
    }

    rep.style.width = wv.style.width
    rep.style.height = wv.style.height

    if(url)
    {
        rep.src = url
    }

    if(reset_history)
    {
        Bone.space(space_num).history[`webview_${num}`] = []
    }

    let focused = Bone.focused() === wv

    Bone.replace_element(rep, wv)

    if(focused && space_num === Bone.current_space)
    {
        Bone.focus(num)
    }
}

// Decreases a webview zoom level by config.zoom_step
Bone.decrease_zoom = function(num, mode='normal')
{
    let step = Bone.config.zoom_step

    if(mode === 'double')
    {
        step *= 2
    }

    let wv = Bone.wv(num)
    let zoom = Bone.round(wv.getZoomFactor() - step, 2)
    wv.setZoomFactor(zoom)
}

// Increases a webview zoom level by config.zoom_step
Bone.increase_zoom = function(num, mode='normal')
{
    let step = Bone.config.zoom_step

    if(mode === 'double')
    {
        step *= 2
    }

    let wv = Bone.wv(num)
    let zoom = Bone.round(wv.getZoomFactor() + step, 2)
    wv.setZoomFactor(zoom)
}

// Resets a webview zoom level to zoom_default
Bone.reset_zoom = function(num)
{
    Bone.wv(num).setZoomFactor(Bone.config.zoom_default)
}

// Resets a webview size to default
Bone.reset_size = function(num, apply=true, mode='')
{
    if(mode.includes('special'))
    {
        Bone.space().special[mode.replace(/.*special_/, '')] = 1
    }

    else
    {
        Bone.swv(num).size = 1
    }

    Bone.space_modified()

    if(apply)
    {
        Bone.apply_layout()
    }  
}

// Opens a window to swap a webview config with another one
Bone.swap_webview = function(num)
{
    let wvs = Bone.wvs()
    
    if(wvs.length < 2)
    {
        return false
    }
    
    let c = Bone.$('#swap_webviews_container')
    c.innerHTML = ''

    for(let i=1; i<=wvs.length; i++)
    {
        if(i === num)
        {
            continue
        }

        let swv = Bone.swv(i)
        let item = document.createElement('div')
        item.classList.add('swap_webviews_item')
        item.classList.add('action')
        item.textContent = `Swap With: (${i}) ${swv.url.substring(0, Bone.config.small_url_length)}`
        item.dataset.num = i
        item.dataset.url = swv.url

        c.append(item)
    }

    Bone.swapping_webview = num
    Bone.msg_swap_webviews.set_title(`Swap Webview ${num}`)
    Bone.msg_swap_webviews.show()
}

// Setups the swap webview window
Bone.setup_swap_webviews = function()
{
    Bone.$('#swap_webviews_container').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('swap_webviews_item'))
        {
            return false
        }

        let num = parseInt(e.target.dataset.num)
        Bone.do_webview_swap(Bone.swapping_webview, num)
        Bone.msg_swap_webviews.close()
    })
}

// Does the webview swapping
Bone.do_webview_swap = function(num_1, num_2)
{
    let w1 = Bone.swv(num_1)
    let w2 = Bone.swv(num_2)
    let ourl_1 = w1.url

    w1.url = w2.url
    w2.url = ourl_1

    Bone.save_local_storage()
    Bone.change_url(w1.url, num_1)
    Bone.change_url(w2.url, num_2)
}

// What to do when a webview is dom ready
Bone.on_webview_dom_ready = function(wv)
{
    if(Bone.storage.custom_scrollbars)
    {
        let style = `
        ::-webkit-scrollbar
        {
            width: ${Bone.storage.custom_scrollbars_width}px !important;
        }
    
        ::-webkit-scrollbar-track-piece
        {
            background-color: ${Bone.storage.custom_scrollbars_track_piece_color} !important;
        }
    
        ::-webkit-scrollbar-thumb
        {
            background-color: ${Bone.storage.custom_scrollbars_thumb_color} !important;
        }
        `
    
        wv.insertCSS(style, 1)
    }
}

// Creates a resize handle based on a given direction
Bone.create_resize_handle = function(args={})
{
    let handle = document.createElement('div')
    handle.classList.add(`resize_handle`)
    handle.classList.add(`resize_handle_${args.direction}`)
    handle.dataset.direction = args.direction
    handle.dataset.owner = args.owner
    handle.dataset.sibling = args.sibling
    handle.dataset.group = args.group
    handle.dataset.affected = args.affected

    return handle
}

// Setups resize handles
Bone.setup_resize_handles = function(num)
{
    let c = Bone.webview_container(num)

    c.addEventListener('mousedown', function(e)
    {
        if(!Bone.active_resize_handle)
        {
            if(e.target.classList.contains('resize_handle'))
            {
                Bone.active_resize_handle = e.target
                Bone.initial_resize_x = e.clientX
                Bone.initial_resize_y = e.clientY
                Bone.resize_mousedown_date = Date.now()
    
                let webviews = Bone.wvs()
    
                for(let webview of webviews)
                {
                    webview.classList.add('disabled')
                }

                c.classList.add(`cursor_resize_${Bone.active_resize_handle.dataset.direction}`)

                e.preventDefault()
                return false
            }
        }

        else
        {
            if(Date.now() - Bone.resize_mousedown_date < Bone.config.resize_double_click_delay)
            {
                let owner = Bone.active_resize_handle.dataset.owner
                let sibling = Bone.active_resize_handle.dataset.sibling
                let elements = [owner, sibling]

                for(let num of elements)
                {
                    if(num.startsWith('c_'))
                    {
                        Bone.set_container_size(num, 1)
                    }

                    else
                    {
                        Bone.swv(num).size = 1
                    }
                }

                Bone.generate_grid_templates(Bone.webview_container())
                Bone.space_modified()
                Bone.leave_resize_mode()
                e.preventDefault()
                return false
            }
        }
    })

    c.addEventListener('mouseup', function(e)
    {
        clearTimeout(Bone.resize_mouse_timeout)

        let diff = Bone.config.resize_double_click_delay - (Date.now() - Bone.resize_mousedown_date)
        let delay = diff < 0 ? 0 : diff

        Bone.resize_mouse_timeout = setTimeout(function()
        {
            Bone.resize_mouseup_function(e)
        }, delay)
    })

    Bone.update_resize_handle_style()
}

// What happens after a resizing is done or cancelled
Bone.leave_resize_mode = function()
{
    let c = Bone.webview_container()
    c.classList.remove(`cursor_resize_${Bone.active_resize_handle.dataset.direction}`)
    Bone.active_resize_handle = false
    
    let webviews = Bone.wvs()

    for(let webview of webviews)
    {
        webview.classList.remove('disabled')
    }

    clearTimeout(Bone.resize_mouse_timeout)
}

// Function for the mouseup event when resizing
Bone.resize_mouseup_function = function(e)
{
    if(!Bone.active_resize_handle)
    {
        return false
    }

    let c = Bone.webview_container()
    let direction = Bone.active_resize_handle.dataset.direction
    let owner = Bone.active_resize_handle.dataset.owner
    let sibling = Bone.active_resize_handle.dataset.sibling
    let affected = Bone.active_resize_handle.dataset.affected.split(',')
    let group = Bone.active_resize_handle.dataset.group
    let diff_x = e.clientX - Bone.initial_resize_x
    let diff_y = e.clientY - Bone.initial_resize_y

    let diff, oname

    if(direction === 'ns')
    {
        oname = 'clientHeight'
        diff = diff_y
    }

    else if(direction === 'ew')
    {
        oname = 'clientWidth'
        diff = diff_x
    }

    else
    {
        return false
    }

    let nsizes = []

    for(let num of affected)
    {
        let el

        if(num.startsWith('c_'))
        {
            el = Bone.layout_container(num, c)
        }
        
        else
        {
            el = Bone.wv(num)
        }
        
        let nsize
        
        if(owner === num)
        {
            nsize = el[oname] + diff
        }
        
        else if(num === sibling)
        {
            nsize = el[oname] - diff
        }

        else
        {
            nsize = el[oname]
        }

        nsizes.push(nsize)
    }

    let dimsum = nsizes.reduce((a, b) => a + b)

    for(let i=0; i<affected.length; i++)
    {
        let num = affected[i]
        let nsize = nsizes[i]

        let size = Bone.round((nsize / dimsum) * group, 3)

        if(num.startsWith('c_'))
        {
            Bone.set_container_size(num, size)
        }
        
        else
        {
            Bone.swv(num).size = size
        }
    }

    Bone.generate_grid_templates(Bone.webview_container())
    Bone.space_modified()
    Bone.leave_resize_mode()
}

// Adds css declarations for the resize handles
Bone.update_resize_handle_style = function()
{
    let css = `
    .resize_handle_ew
    {
        width: ${Bone.storage.resize_handle_size}px !important;
    }
    
    .resize_handle_ns
    {
        height: ${Bone.storage.resize_handle_size}px !important;
    }
    `

    let styles = Bone.$$('.appended_resize_handle_style')

    for(let style of styles)
    {
        Bone.remove_element(style)
    }

    let style_el = document.createElement('style')
    style_el.classList.add('appended_resize_handle_style')
    style_el.innerHTML = css

    document.head.appendChild(style_el)
}

// Creates a webview container
Bone.create_webview_container = function(num)
{
    let h = Bone.template_webview_container({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wvc = el.querySelector('.webview_container')
    Bone.$('#webview_containers').append(wvc)
    Bone.setup_resize_handles(num)
}

// Creates a webview object for storage
Bone.create_webview_object = function(n, url='')
{
    let obj = {}
    obj.url = url
    obj.size = 1
    obj.history = []
    return obj
}

// Returns the number of the focused webview
Bone.num = function()
{
    return parseInt(Bone.focused().dataset.num)
}

// Focuses current webview
Bone.focus = function(num=false, space_num=false)
{
    if(space_num)
    {
        if(space_num !== Bone.current_space)
        {
            return false
        }
    }

    let wv = Bone.wv(num)
    
    if(wv)
    {
        document.activeElement.blur()
        wv.focus()
        Bone.on_webview_focus(wv)
    }
}

// Gets a webview by its number
Bone.wv = function(num=false, space_number=false)
{
    if(!num)
    {
        num = Bone.num()
    }

    return Bone.webview_container(space_number).querySelector(`.webview_${num}`)
}

// Returns the focused webview
Bone.focused = function()
{
    return Bone.space().focused_webview
}

// Gets the webview on the right
Bone.get_webview_right = function(num, wrap=true)
{
    let wvs = Bone.wvs()

    if(wvs.length === 1)
    {
        return false
    }

    let new_num = num + 1
    
    if(new_num > wvs.length)
    {
        if(wrap)
        {
            new_num = 1
        }

        else
        {
            new_num = num
        }
    }

    return new_num
}

// Gets the webview on the left
Bone.get_webview_left = function(num, wrap=true)
{
    let wvs = Bone.wvs()

    if(wvs.length === 1)
    {
        return false
    }

    let new_num = num - 1
    
    if(new_num <= 0)
    {
        if(wrap)
        {
            new_num = wvs.length
        }

        else
        {
            new_num = num
        }
    }

    return new_num
}

// Cycles webview focus
Bone.cycle_webview = function(direction='right')
{
    if(Bone.wvs().length === 1)
    {
        return false
    }
    
    let new_num
    let num = Bone.num()

    if(direction === 'right')
    {
        new_num = Bone.get_webview_right(num, Bone.storage.wrap_on_webview_cycle)
    }
    
    else if(direction === 'left')
    {
        new_num = Bone.get_webview_left(num, Bone.storage.wrap_on_webview_cycle)
    }
    
    Bone.focus(new_num)
}

// Makes all uncofused webviews semi opaque
Bone.ghost_webviews = function()
{
    clearTimeout(Bone.ghost_webviews_shot_timeout)

    let focused = Bone.focused()

    for(let webview of Bone.wvs())
    {
        if(webview === focused)
        {
            webview.classList.remove('ghost_webview')
        }
        
        else
        {
            webview.classList.add('ghost_webview')
        }
    }
}

// Makes all webviews fully opaque
Bone.remove_ghost_webviews = function()
{
    if(Bone.url_input_focused)
    {
        return false
    }

    for(let webview of Bone.wvs())
    {
        webview.classList.remove('ghost_webview')
    }

    Bone.ghost_webviews_shot_on = false
    Bone.ghost_webviews_shot_quick_on = false
}

// Does a ghost webviews for an instant
Bone.ghost_webviews_shot = function(quick=false)
{
    Bone.ghost_webviews()
    Bone.ghost_webviews_shot_on = true

    let delay = quick ? Bone.config.ghost_webviews_shot_quick_delay : Bone.config.ghost_webviews_shot_delay

    Bone.ghost_webviews_shot_timeout = setTimeout(function()
    {
        Bone.remove_ghost_webviews()
    }, delay)
}

// Checks how to apply or remove ghost webviews
Bone.check_ghost_webviews = function()
{
    if(Bone.mouse_on_panel)
    {
        Bone.ghost_webviews()
    }

    else if(Bone.ghost_webviews_shot_on)
    {
        Bone.ghost_webviews_shot()
    }

    else if(Bone.ghost_webviews_shot_quick_on)
    {
        Bone.ghost_webviews_shot(true)
    }
        
    else
    {
        Bone.remove_ghost_webviews()
    }
}

// What to do when a webview gets focus
Bone.on_webview_focus = function(webview)
{
    Bone.space().focused_webview = webview
    Bone.update_focused_webview()
    Bone.update_url()
    Bone.close_find()
    Bone.hide_context_menu()
    Bone.ghost_webviews_shot_quick_on = true
    Bone.check_ghost_webviews()
}

// Reloads a webview
Bone.reload = function(num=false, hard=false)
{
    Bone.wv(num).reload()
}

// Reloads a webview ignoring cache
Bone.hard_reload = function(num=false)
{
    Bone.wv(num).reloadIgnoringCache()
}

// Gets all the webviews from the current container
Bone.wvs = function(space_num=false)
{
    return Bone.$$('.webview', Bone.webview_container(space_num))
}

// Creates resizers to items on a layout
Bone.create_resizers = function(c)
{
    let horizontal = Bone.$$('.horizontal_grid', c)

    for(let container of horizontal)
    {
        Bone.container_create_resizers(container, 'ew')
    }

    let vertical = Bone.$$('.vertical_grid', c)

    for(let container of vertical)
    {
        Bone.container_create_resizers(container, 'ns')
    }
}

// Does a create resize on horizontal or vertical containers
Bone.container_create_resizers = function(container, direction)
{
    let items = Array.from(container.children)

    if(items.length < 2)
    {
        return false
    }

    for(let i=0; i<items.length; i++)
    {
        if(i === items.length - 1)
        {
            break
        }

        let item = items[i]

        let owner_type
        let sibling_type
        let owner = item.dataset.num
        let next = items[i + 1]
        let sibling = next.dataset.num
        let affected
        let group

        if(item.classList.contains('webview'))
        {
            owner_type = 'webview'
        }
        
        else
        {
            owner_type = 'container'
        }

        if(next.classList.contains('webview'))
        {
            group = items.length
            sibling_type = 'webview'
            affected = items.map(o => o.dataset.num)
        }
        
        else
        {
            group = 2
            affected = [owner, sibling]
        }

        Bone.insert_after(Bone.create_resize_handle(
        {
            direction: direction,
            owner: owner,
            sibling: sibling,
            group: group,
            owner_type: owner_type,
            affected: affected
        }), item)
    }
}

// Returns the active webview container
Bone.webview_container = function(space_num=false)
{   
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    return Bone.$(`#webview_container_${space_num}`)
}