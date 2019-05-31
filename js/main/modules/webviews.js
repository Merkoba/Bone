// Create a webview from a template
Bone.create_webview = function(num)
{
    let h = Bone.template_webview({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wv = el.querySelector('webview')

    wv.addEventListener('dom-ready', function()
    {
        Bone.on_webview_dom_ready(this, num)
    })

    wv.addEventListener('focus', function()
    {
        Bone.focused_webview = this
    })

    wv.addEventListener('did-navigate', function(e)
    {
        if(!e.url)
        {
            return false
        }

        let history = Bone.history[`webview_${num}`]
        
        if(history.slice(-1)[0] === e.url)
        {
            return false
        }

        history.push(e.url)
    })

    return wv
}

// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true, force_url_change=false, create='auto')
{
    let layout = Bone.storage.layout
    let rhs = `${Bone.storage.resize_handle_size}px`
    let handles = Bone.$$('.resize_handle')

    for(let handle of handles)
    {
        handle.parentNode.removeChild(handle)
    }

    let css = ''
    let wv = {}

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        if(reset_size)
        {
            Bone.reset_size(i, false)
        }

        wv[i] = {}
        wv[i].size = Bone.storage[`webview_${i}`].size
    }

    let create_elements = true

    if(create === 'auto')
    {
        if(Bone.current_layout === layout)
        {
            create_elements = false
        }
    }

    else if(create === 'no')
    {
        create_elements = false
    }

    else if(create === 'yes')
    {
        create_elements = true
    }

    if(layout === 'single')
    {
        Bone.create_webview_container(1)
    }

    else if(layout === '2_column')
    {
        if(create_elements) Bone.create_webview_container(2, 2)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-areas: '.' '.' '.';
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 2), Bone.$('#webview_1'))
    }

    else if(layout === '3_column')
    {
        if(create_elements) Bone.create_webview_container(2, 3)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' '.' '.' '.';
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.$('#webview_2'))
    }

    else if(layout === '4_column')
    {
        if(create_elements) Bone.create_webview_container(2, 4)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-areas: '.' '.' '.' '.' '.' '.' '.';
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_after(Bone.create_resize_handle('ns', 3, [4], 3), Bone.$('#webview_3'))
    }

    else if(layout === '2_row')
    {
        if(create_elements) Bone.create_webview_container(2, 2)

        css = `
        #webview_container 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.$('#webview_1'))
    }
    
    else if(layout === '3_row')
    {
        if(create_elements) Bone.create_webview_container(2, 3)

        css = `
        #webview_container 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . .';
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.$('#webview_2'))
    }

    else if(layout === '4_row')
    {
        if(create_elements) Bone.create_webview_container(2, 4)

        css = `
        #webview_container 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . . . .';
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 3), Bone.$('#webview_3'))
    }

    else if(layout === '1_top_2_bottom')
    {
        if(create_elements) Bone.create_webview_container(3, 3)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        .webview_top
        { 
            display: grid;
            grid-area: top;
            grid-template-rows: 1fr ${rhs};
        }
    
        .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: bottom;
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2, 3], 2), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 2), Bone.$('#webview_2'))
    }

    else if(layout === '1_top_3_bottom')
    {
        if(create_elements) Bone.create_webview_container(3, 4)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        .webview_top
        { 
            display: grid;
            grid-area: top;
            grid-template-rows: 1fr ${rhs};
        }
    
        .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . .';
            grid-area: bottom;
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2, 3, 4], 2), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 3), Bone.$('#webview_3'))
    }

    else if(layout === '2_top_1_bottom')
    {
        if(create_elements) Bone.create_webview_container(4, 3)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${2 - (wv[3].size)}fr ${wv[3].size}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: top;
        }
    
        .webview_bottom
        {
            display: grid;
            grid-area: bottom;
            grid-template-rows: ${rhs} 1fr;
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.$('#webview_1'))
        Bone.insert_before(Bone.create_resize_handle('ns', 3, [1, 2], 2, 'before'), Bone.$('#webview_3'))
    }

    else if(layout === '3_top_1_bottom')
    {
        if(create_elements) Bone.create_webview_container(4, 4)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${2 - (wv[4].size)}fr ${wv[4].size}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . .';
            grid-area: top;
        }
    
        .webview_bottom
        {
            display: grid;
            grid-area: bottom;
            grid-template-rows: ${rhs} 1fr;
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_before(Bone.create_resize_handle('ns', 4, [1, 2, 3], 2, 'before'), Bone.$('#webview_4'))
    }

    else if(layout === '2_top_2_bottom')
    {
        if(create_elements) Bone.create_webview_container(5, 4)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: top;
        }
    
        .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[3].size}fr ${rhs} ${wv[4].size}fr ${rhs};
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: bottom;
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 2), Bone.$('#webview_3'))
    }

    else if(layout === '1_left_2_right')
    {
        if(create_elements) Bone.create_webview_container(6, 3)

        css = `
        #webview_container
        {
            grid-template-columns: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-rows: 1fr;
            grid-template-areas: 'left right';
        }
    
        .webview_left
        { 
            display: grid;
            grid-area: left;
            grid-template-columns: 1fr ${rhs};
        }
    
        .webview_right
        {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' '.';
            grid-area: right;
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2, 3], 2), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 2), Bone.$('#webview_2'))
    }

    else if(layout === '1_left_3_right')
    {
        if(create_elements) Bone.create_webview_container(6, 4)

        css = `
        #webview_container
        {
            grid-template-columns: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-rows: 1fr;
            grid-template-areas: 'left right';
        }
    
        .webview_left
        { 
            display: grid;
            grid-area: left;
            grid-template-columns: 1fr ${rhs};
        }
    
        .webview_right
        {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-areas: '.' '.' '.' '.';
            grid-area: right;
        }`

        Bone.insert_after(Bone.create_resize_handle('ew', 1, [2, 3], 2), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_after(Bone.create_resize_handle('ns', 3, [4], 3), Bone.$('#webview_3'))
    }

    else if(layout === '2_left_1_right')
    {
        if(create_elements) Bone.create_webview_container(7, 3)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-columns: ${2 - (wv[3].size)}fr ${wv[3].size}fr;
            grid-template-areas: 'left right';
        }
    
        .webview_left
        { 
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-areas: '.' '.' .';
            grid-area: left;
        }
    
        .webview_right
        {
            display: grid;
            grid-area: right;
            grid-template-columns: ${rhs} 1fr;
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 2), Bone.$('#webview_1'))
        Bone.insert_before(Bone.create_resize_handle('ew', 3, [1, 2], 2, 'before'), Bone.$('#webview_3'))
    }

    else if(layout === '3_left_1_right')
    {
        if(create_elements) Bone.create_webview_container(7, 4)

        css = `
        #webview_container
        {
            grid-template-columns: 1fr;
            grid-template-columns: ${2 - (wv[4].size)}fr ${wv[4].size}fr;
            grid-template-areas: 'left right';
        }
    
        .webview_left
        { 
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' .' '.' '.';
            grid-area: left;
        }
    
        .webview_right
        {
            display: grid;
            grid-area: right;
            grid-template-columns: ${rhs} 1fr;
        }`

        Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.$('#webview_1'))
        Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.$('#webview_2'))
        Bone.insert_before(Bone.create_resize_handle('ew', 4, [1, 2, 3], 2, 'before'), Bone.$('#webview_4'))
    }

    let styles = Bone.$$('.appended_layout_style')

    for(let style of styles)
    {
        style.parentNode.removeChild(style)
    }

    let style_el = document.createElement('style')
    style_el.classList.add('appended_layout_style')
    style_el.innerHTML = css

    document.head.appendChild(style_el)

    let webviews = Bone.$$('.webview')

    for(let webview of webviews)
    {
        if(force_url_change || !webview.src)
        {
            Bone.apply_url(webview.id.replace('webview_', ''))
        }
    }

    Bone.current_layout = layout

    if(create_elements)
    {
        Bone.focused_webview = Bone.$('#webview_1')
    }
}

// Changes a webview url
Bone.apply_url = function(num)
{
    let webview = Bone.$(`#webview_${num}`)
    let url = Bone.storage[`webview_${num}`].url

    if(webview.style.display === 'none')
    {
        return false
    }

    else
    {
        if(!url)
        {
            Bone.remake_webview(num, '', false)
            return false
        }
    }

    if(!url || webview.src === url)
    {
        return false
    }

    Bone.remake_webview(num, url, false)
}

// Replaces a webview with a new one
// This is to destroy its content
Bone.remake_webview = function(num, url='', no_display=true, reset_history=true)
{
    let wv = Bone.$(`#webview_${num}`)
    let rep = Bone.create_webview(num)

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
        Bone.history[`webview_${num}`] = []
    }

    wv.parentNode.replaceChild(rep, wv)

    let wv2 = Bone.$(`#webview_${num}`)

    contextMenu(
    {
        window: wv2,
        showCopyImageAddress: true,
        showSaveImageAs: true,
        showInspectElement: true
    })
}

// Applies zoom level and factor to a loaded webview
Bone.apply_zoom = function(num)
{
    try
    {
        let webview = Bone.$(`#webview_${num}`)
        let zoom = Bone.storage[`webview_${num}`].zoom
        webview.setZoomLevel(0)
        webview.setZoomFactor(zoom)
        Bone.set_zoom_label(num)
    }

    catch(err){}
}

// Sets the zoom level to a webview
Bone.set_zoom_label = function(num)
{
    let zoom = Bone.storage[`webview_${num}`].zoom
    Bone.$(`#webview_${num}_zoom_label`).textContent = `Zoom (${Number(zoom).toFixed(2)})`
}

// Decreases a webview zoom level by config.zoom_step
Bone.decrease_zoom = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom - Bone.config.zoom_step, 2)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom(num)
    Bone.save_local_storage()
}

// Increases a webview zoom level by config.zoom_step
Bone.increase_zoom = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom + Bone.config.zoom_step, 2)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom(num)
    Bone.save_local_storage()
}

// Resets a webview zoom level to zoom_default
Bone.reset_zoom = function(num)
{
    Bone.storage[`webview_${num}`].zoom = Bone.config.zoom_default
    Bone.apply_zoom(num)
    Bone.save_local_storage()
}

// Sets the size to a webview
Bone.set_size_label = function(num)
{
    let size = Bone.storage[`webview_${num}`].size
    Bone.$(`#webview_${num}_size_label`).textContent = `Size (${Number(size).toFixed(2)})`
}

// Decreases a webview size by size_step
Bone.decrease_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size - Bone.config.size_step, 2)

    if(size <= 0)
    {
        return false
    }

    Bone.storage[`webview_${num}`].size = size
    Bone.apply_layout(false)
    Bone.save_local_storage()
    Bone.set_size_label(num)
}

// Increases a webview size by size_step
Bone.increase_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size + Bone.config.size_step, 2)
    Bone.storage[`webview_${num}`].size = size
    Bone.apply_layout(false)
    Bone.save_local_storage()
    Bone.set_size_label(num)
}

// Resets a webview size to size_default
Bone.reset_size = function(num, apply=true)
{
    Bone.storage[`webview_${num}`].size = Bone.config.size_default
    Bone.save_local_storage()
    Bone.set_size_label(num)

    if(apply)
    {
        Bone.apply_layout(false)
    }  
}

// Refreshes a webview with configured url
Bone.refresh_webview = function(num)
{
    let url = Bone.storage[`webview_${num}`].url
    Bone.remake_webview(num, url, false)
}

// Opens a window to swap a webview config with another one
Bone.swap_webview = function(num)
{
    let items = Bone.$$('.swap_webviews_item')

    for(let item of items)
    {
        let num_2 = parseInt(item.id.replace('swap_webviews_', ''))

        if(num === num_2)
        {
            item.style.display = 'none'
        }

        else
        {
            let wv = Bone.storage[`webview_${num_2}`]
            item.style.display = 'block'
            item.textContent = `Swap With: (${num_2}) ${wv.url.substring(0, Bone.config.swap_max_url_length)}`
        }
    }

    Bone.swapping_webview = num
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

        let num = parseInt(e.target.id.replace('swap_webviews_', ''))
        Bone.do_webview_swap(Bone.swapping_webview, num)
        Bone.msg_swap_webviews.close()
    })
}

// Does the webview swapping
Bone.do_webview_swap = function(num_1, num_2)
{
    let w1 = Bone.storage[`webview_${num_1}`]
    let w2 = Bone.storage[`webview_${num_2}`]
    let ourl_1 = w1.url
    let ozoom_1 = w1.zoom

    w1.url = w2.url
    w2.url = ourl_1
    w1.zoom = w2.zoom
    w2.zoom = ozoom_1

    Bone.$(`#menu_window_url_${num_1}`).value = w1.url
    Bone.$(`#menu_window_url_${num_2}`).value = w2.url

    Bone.save_local_storage()
    Bone.apply_url(num_1)
    Bone.apply_url(num_2)
    Bone.apply_zoom(num_1)
    Bone.apply_zoom(num_2)
}

// What to do when a webview is dom ready
Bone.on_webview_dom_ready = function(webview, num)
{
    Bone.apply_zoom(num)
}

// Populates and shows the webview history
Bone.show_history = function(num)
{
    let c = Bone.$('#history_container')
    c.innerHTML = ''

    for(let item of Bone.history[`webview_${num}`])
    {
        let el = document.createElement('div')
        el.classList.add('history_item')
        el.classList.add('action')
        el.textContent = item.substring(0, Bone.history_max_url_length)
        el.dataset.url = item
        el.dataset.num = num
        c.prepend(el)
    }

    Bone.msg_history.show()
}

// Setups history
Bone.setup_history = function()
{
    Bone.$('#history_container').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('history_item'))
        {
            return false
        }

        let url = e.target.dataset.url
        let num = e.target.dataset.num
        let history = Bone.history[`webview_${num}`]
        let index = 0 - Bone.get_child_index(e.target)

        if(index < 0)
        {
            Bone.history[`webview_${num}`] = history.slice(0, index)
        }

        Bone.remake_webview(num, url, false, false)
        Bone.close_all_windows()
    })
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
Bone.setup_resize_handles = function()
{
    let c = Bone.$('#webview_container')

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
    
                let webviews = Bone.$$('.webview')
    
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
                let elements

                if(siblings.length === 1)
                {
                    elements = [owner, ...siblings]
                }

                else
                {
                    elements = [owner]
                }
                
                for(let num of elements)
                {
                    Bone.reset_size(num)
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
Bone.create_webview_container = function(num, amount)
{
    let c = Bone.$('#webview_container')
    c.innerHTML = ''

    if(num === 1)
    {
        c.appendChild(Bone.create_webview(1))
    }

    else if(num === 2)
    {
        for(let i=1; i<=amount; i++)
        {
            c.appendChild(Bone.create_webview(i))
        }
    }

    else if(num === 3)
    {
        let top = document.createElement('div')
        top.classList.add('webview_top')
        top.appendChild(Bone.create_webview(1))

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')
        
        for(let i=2; i<=amount; i++)
        {
            bottom.appendChild(Bone.create_webview(i)) 
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
            top.appendChild(Bone.create_webview(i)) 
        }

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')
        bottom.appendChild(Bone.create_webview(amount))
        
        c.prepend(bottom)
        c.prepend(top)
    }

    else if(num === 5)
    {
        let top = document.createElement('div')
        top.classList.add('webview_top')

        for(let i=1; i<=amount/2; i++)
        {
            top.appendChild(Bone.create_webview(i)) 
        }

        let bottom = document.createElement('div')
        bottom.classList.add('webview_bottom')

        for(let i=amount/2+1; i<=amount; i++)
        {
            bottom.appendChild(Bone.create_webview(i)) 
        }
        
        c.prepend(bottom)
        c.prepend(top)
    }

    else if(num === 6)
    {
        let left = document.createElement('div')
        left.classList.add('webview_left')
        left.appendChild(Bone.create_webview(1))

        let right = document.createElement('div')
        right.classList.add('webview_right')
        
        for(let i=2; i<=amount; i++)
        {
            right.appendChild(Bone.create_webview(i)) 
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
            left.appendChild(Bone.create_webview(i)) 
        }

        let right = document.createElement('div')
        right.classList.add('webview_right')
        right.appendChild(Bone.create_webview(amount))
        
        c.prepend(right)
        c.prepend(left)
    }
}

// What happens after a resizing is done or cancelled
Bone.leave_resize_mode = function()
{
    let c = Bone.$('#webview_container')

    c.classList.remove(`cursor_resize_${Bone.active_resize_handle.dataset.direction}`)
    Bone.active_resize_handle = false
    
    let webviews = Bone.$$('.webview')

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

    let c = Bone.$('#webview_container')
    let direction = Bone.active_resize_handle.dataset.direction
    let siblings_list = Bone.active_resize_handle.dataset.siblings.split(',')
    let owner = Bone.active_resize_handle.dataset.owner
    let group = Bone.active_resize_handle.dataset.group
    let mode = Bone.active_resize_handle.dataset.mode
    let diff_x = e.clientX - Bone.initial_resize_x
    let diff_y = e.clientY - Bone.initial_resize_y
    let elements

    if(siblings_list.length === 1)
    {
        elements = [owner, ...siblings_list]
    }

    else
    {
        elements = [owner]
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
        let el = Bone.$(`#webview_${num}`)
        let nsize

        if(num === owner && mode === 'after')
        {
            nsize = el[oname] + diff
        }
        
        else
        {
            nsize = el[oname] - diff
        }

        let size = Bone.round((nsize / c[oname]) * group, 3)
        Bone.storage[`webview_${num}`].size = size
        Bone.set_size_label(num)
    }

    Bone.apply_layout(false, false, 'no')
    Bone.save_local_storage()
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
        style.parentNode.removeChild(style)
    }

    let style_el = document.createElement('style')
    style_el.classList.add('appended_resize_handle_style')
    style_el.innerHTML = css

    document.head.appendChild(style_el)
}