// Create a webview from a template
Bone.create_webview = function(num)
{
    let h = Bone.template_webview({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wv = el.querySelector('webview')
    wv.dataset.num = num
    wv.dataset.space = Bone.current_space

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

        Bone.push_to_history(wv, e.url)
        Bone.swv(wv.dataset.num, wv.dataset.space).url = e.url
        Bone.space_modified()
        Bone.save_local_storage()
        Bone.update_url()
        Bone.add_url_to_global_history(e.url)
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
    let rep = Bone.create_webview(num, Bone.space(space_num))

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
        Bone.focus_webview(num)
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
    Bone.save_local_storage()

    if(apply)
    {
        Bone.apply_layout(false)
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
        item.textContent = `Swap With: (${i}) ${swv.url.substring(0, Bone.config.swap_max_url_length)}`
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
    Bone.apply_url(num_1)
    Bone.apply_url(num_2)
}

// What to do when a webview is dom ready
Bone.on_webview_dom_ready = function(webview)
{
    let num = parseInt(webview.dataset.num)
    let space_num = parseInt(webview.dataset.space)

    if(num === Bone.num() && space_num === Bone.current_space)
    {
        Bone.focus_webview(num, space_num)
    }
}

// Creates a resize handle based on a given direction
Bone.create_resize_handle = function(direction, owner, siblings, group, mode='after')
{
    let handle = document.createElement('div')
    handle.classList.add(`resize_handle`)
    handle.classList.add(`resize_handle_${direction}`)
    handle.dataset.direction = direction
    handle.dataset.owner = owner
    handle.dataset.siblings = siblings.join(',')
    handle.dataset.group = group
    handle.dataset.mode = mode

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
                let siblings = Bone.active_resize_handle.dataset.siblings
                let mode = Bone.active_resize_handle.dataset.mode
                let elements

                if(siblings.length === 1)
                {
                    elements = [owner, ...siblings]
                }

                else
                {
                    elements = [owner]
                }

                if(mode.includes('special'))
                {
                    Bone.reset_size(num, true, mode)
                }

                else
                {
                    for(let num of elements)
                    {
                        Bone.reset_size(num, true)
                    }
                }

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

// Creates a webview container from a given template
Bone.setup_webview_container = function(num, amount)
{
    let c = Bone.webview_container()
    c.innerHTML = ''

    if(num === 1)
    {
        c.appendChild(Bone.create_webview(1, Bone.current_space))
    }

    else if(num === 2)
    {
        for(let i=1; i<=amount; i++)
        {
            c.appendChild(Bone.create_webview(i, Bone.current_space))
        }
    }

    else if(num === 3)
    {
        let top = document.createElement('div')
        top.classList.add('webview_top')
        top.appendChild(Bone.create_webview(1, Bone.current_space))

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')
        
        for(let i=2; i<=amount; i++)
        {
            bottom.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }

        c.prepend(bottom)
        c.prepend(top)
    }

    else if(num === 4)
    {
        let top = document.createElement('div')
        top.classList.add('webview_top')

        for(let i=1; i<=amount-1; i++)
        {
            top.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')
        bottom.appendChild(Bone.create_webview(amount, Bone.current_space))
        
        c.prepend(bottom)
        c.prepend(top)
    }

    else if(num === 5)
    {
        let top = document.createElement('div')
        top.classList.add('webview_top')

        for(let i=1; i<=amount/2; i++)
        {
            top.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }

        let resize = document.createElement('div')
        resize.classList.add('webview_resize')

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')

        for(let i=amount/2+1; i<=amount; i++)
        {
            bottom.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }
        
        c.prepend(bottom)
        c.prepend(resize)
        c.prepend(top)
    }

    else if(num === 6)
    {
        let left = document.createElement('div')
        left.classList.add('webview_left')
        left.appendChild(Bone.create_webview(1, Bone.current_space))

        let right = document.createElement('div')
        right.classList.add('webview_right')
        
        for(let i=2; i<=amount; i++)
        {
            right.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }

        c.prepend(right)
        c.prepend(left)
    }

    else if(num === 7)
    {
        let left = document.createElement('div')
        left.classList.add('webview_left')

        for(let i=1; i<=amount-1; i++)
        {
            left.appendChild(Bone.create_webview(i, Bone.current_space)) 
        }

        let right = document.createElement('div')
        right.classList.add('webview_right')
        right.appendChild(Bone.create_webview(amount, Bone.current_space))
        
        c.prepend(right)
        c.prepend(left)
    }
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
    let siblings_list = Bone.active_resize_handle.dataset.siblings.split(',')
    let owner = Bone.active_resize_handle.dataset.owner.split(',')
    let group = Bone.active_resize_handle.dataset.group
    let mode = Bone.active_resize_handle.dataset.mode
    let diff_x = e.clientX - Bone.initial_resize_x
    let diff_y = e.clientY - Bone.initial_resize_y
    let elements

    if(siblings_list.length === 1)
    {
        elements = [...owner, ...siblings_list]
    }

    else
    {
        elements = [...owner]
    }

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

    
    for(let num of elements)
    {
        let owned = false
        let el = Bone.wv(num)
        let nsize

        if(owner.includes(num) && mode.startsWith('after'))
        {
            nsize = el[oname] + diff
            owned = true
        }
        
        else
        {
            nsize = el[oname] - diff
        }

        let size = Bone.round((nsize / c[oname]) * group, 3)
        let space = Bone.space()

        if(mode.includes('special'))
        {
            if(owned)
            {
                space.special[mode.replace(/.*special_/, '')] = size
            }
        }

        else
        {
            space[`webview_${num}`].size = size
        }
    }

    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_layout(false, false, 'no')
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
    return obj
}

// Returns the number of the focused webview
Bone.num = function()
{
    return parseInt(Bone.focused().dataset.num)
}

// Focuses current webview
Bone.focus_webview = function(num=false, space_num=false)
{
    if(space_num)
    {
        if(space_num !== Bone.current_space)
        {
            return false
        }
    }

    document.activeElement.blur()
    Bone.wv(num).focus()
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

// Cycles webview focus
Bone.cycle_webview = function(direction='right')
{
    let new_num
    let num = Bone.num()
    let wvs = Bone.wvs()

    if(direction === 'right')
    {
        new_num = num + 1
    
        if(new_num > wvs.length)
        {
            new_num = 1
        }
    }
    
    else if(direction === 'left')
    {
        new_num = num - 1
    
        if(new_num <= 0)
        {
            new_num = wvs.length
        }
    }
    
    Bone.focus_webview(new_num)
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
}

// Does a ghost webviews for an instant
Bone.ghost_webviews_shot = function()
{
    Bone.ghost_webviews()
    Bone.ghost_webviews_shot_on = true

    Bone.ghost_webviews_shot_timeout = setTimeout(function()
    {
        Bone.remove_ghost_webviews()
    }, 800)
}

// Checks how to apply or remove ghost webviews
Bone.check_ghost_webviews = function()
{
    if(Bone.mouse_on_panel)
    {
        Bone.ghost_webviews()
    }

    else
    {
        if(Bone.ghost_webviews_shot_on)
        {
            Bone.ghost_webviews_shot()
        }
        
        else
        {
            Bone.remove_ghost_webviews()
        }
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
    Bone.check_ghost_webviews()
}

// Refreshes a webview with configured url
Bone.refresh_webview = function(num=false)
{
    if(!num)
    {
        num = Bone.num()
    }

    let url = Bone.swv(num).url
    Bone.remake_webview(num, false, url, false)
}