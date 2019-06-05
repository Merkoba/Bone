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
        Bone.space().focused_webview = this
        Bone.update_focused_webview()
        Bone.update_url()
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
        wv.stopFindInPage('keepSelection')
    })

    wv.addEventListener('page-favicon-updated', function(e)
    {
        let swv = Bone.swv(parseInt(wv.dataset.num), parseInt(wv.dataset.space))
        Bone.update_favicon(swv.url, e.favicons[0])
    })

    wv.addEventListener('did-navigate', function(e)
    {
        if(!e.url)
        {
            return false
        }

        let history = Bone.space(wv.dataset.space).history[`webview_${wv.dataset.num}`]
        
        if(history.slice(-1)[0] === e.url)
        {
            return false
        }

        history.push(e.url)
        Bone.swv(wv.dataset.num, wv.dataset.space).url = e.url
        Bone.space_modified()
        Bone.save_local_storage()
        Bone.update_url()
        Bone.add_url_to_global_history(e.url)
    })

    return wv
}

// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true, force_url_change=false, create='auto')
{
    let space = Bone.space()
    let nspace = space.num
    let layout = space.layout
    let rhs = `${Bone.storage.resize_handle_size}px`
    let css = ''
    let wv = {}

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        if(reset_size)
        {
            Bone.reset_size(i, false)
        }

        wv[i] = {}
        wv[i].size = space[`webview_${i}`].size
    }

    if(reset_size)
    {
        Bone.reset_size(0, false, 'special_row_1')
    }

    let create_elements = true

    if(create === 'auto')
    {
        if(space.current_layout === layout)
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

    if(create_elements)
    {
        let handles = Bone.webview_container().querySelectorAll('.resize_handle')
        for(let handle of handles)
        {
            Bone.remove_element(handle)
        }
    }

    if(layout === 'single')
    {
        if(create_elements)
        {
            Bone.setup_webview_container(1)
        }
    }

    else if(layout === '2_column')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 2)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 2), Bone.wv(1))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-areas: '.' '.' '.';
        }`
    }

    else if(layout === '3_column')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 3)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.wv(2))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' '.' '.' '.';
        }`
    }

    else if(layout === '4_column')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 4)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.wv(2))
            Bone.insert_after(Bone.create_resize_handle('ns', 3, [4], 3), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-areas: '.' '.' '.' '.' '.' '.' '.';
        }`
    }

    else if(layout === '2_row')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 2)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.wv(1))
        }

        css = `
        #webview_container_${nspace} 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
        }`
    }
    
    else if(layout === '3_row')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 3)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.wv(2))
        }

        css = `
        #webview_container_${nspace} 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . .';
        }`
    }

    else if(layout === '4_row')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(2, 4)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.wv(2))
            Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 3), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace} 
        {
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . . . .';
        }`
    }

    else if(layout === '1_top_2_bottom')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(3, 3)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2, 3], 2), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 2), Bone.wv(2))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        #webview_container_${nspace} .webview_top
        { 
            display: grid;
            grid-area: top;
            grid-template-rows: 1fr ${rhs};
        }
    
        #webview_container_${nspace} .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: bottom;
        }`
    }

    else if(layout === '1_top_3_bottom')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(3, 4)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2, 3, 4], 2), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.wv(2))
            Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 3), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        #webview_container_${nspace} .webview_top
        { 
            display: grid;
            grid-area: top;
            grid-template-rows: 1fr ${rhs};
        }
    
        #webview_container_${nspace} .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . . .';
            grid-area: bottom;
        }`
    }

    else if(layout === '2_top_1_bottom')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(4, 3)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.wv(1))
            Bone.insert_before(Bone.create_resize_handle('ns', 3, [1, 2], 2, 'before'), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${2 - (wv[3].size)}fr ${wv[3].size}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        #webview_container_${nspace} .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: top;
        }
    
        #webview_container_${nspace} .webview_bottom
        {
            display: grid;
            grid-area: bottom;
            grid-template-rows: ${rhs} 1fr;
        }`
    }
    
    else if(layout === '3_top_1_bottom')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(4, 4)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 2, [3], 3), Bone.wv(2))
            Bone.insert_before(Bone.create_resize_handle('ns', 4, [1, 2, 3], 2, 'before'), Bone.wv(4))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${2 - (wv[4].size)}fr ${wv[4].size}fr;
            grid-template-areas: 'top' 'bottom';
        }
    
        #webview_container_${nspace} .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . . .';
            grid-area: top;
        }
    
        #webview_container_${nspace} .webview_bottom
        {
            display: grid;
            grid-area: bottom;
            grid-template-rows: ${rhs} 1fr;
        }`
    }

    else if(layout === '2_top_2_bottom')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(5, 4)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2], 2), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ew', 3, [4], 2), Bone.wv(3))

            let resize = document.querySelector(`#webview_container_${nspace} .webview_resize`)
            resize.append(Bone.create_resize_handle('ns', [1, 2], [3, 4], 2, 'after_special_row_1'))
        }

        let row_1 = 1

        if(space.special && space.special.row_1)
        {
            row_1 = space.special.row_1
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-rows: ${row_1}fr ${rhs} ${2 - row_1}fr;
            grid-template-areas: 'top' 'resize' 'bottom';
        }
    
        #webview_container_${nspace} .webview_top
        { 
            display: grid;
            grid-template-columns: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: top;
        }

        #webview_container_${nspace} .webview_resize
        { 
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            grid-template-areas: '.';
            grid-area: resize;
        }
    
        #webview_container_${nspace} .webview_bottom
        {
            display: grid;
            grid-template-columns: ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-rows: 1fr;
            grid-template-areas: '. . .';
            grid-area: bottom;
        }`
    }
    
    else if(layout === '1_left_2_right')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(6, 3)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2, 3], 2), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 2), Bone.wv(2))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-rows: 1fr;
            grid-template-areas: 'left right';
        }
    
        #webview_container_${nspace} .webview_left
        { 
            display: grid;
            grid-area: left;
            grid-template-columns: 1fr ${rhs};
        }
    
        #webview_container_${nspace} .webview_right
        {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' '.';
            grid-area: right;
        }`
    }
    
    else if(layout === '1_left_3_right')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(6, 4)
            Bone.insert_after(Bone.create_resize_handle('ew', 1, [2, 3], 2), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.wv(2))
            Bone.insert_after(Bone.create_resize_handle('ns', 3, [4], 3), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: ${wv[1].size}fr ${2 - (wv[1].size)}fr;
            grid-template-rows: 1fr;
            grid-template-areas: 'left right';
        }
    
        #webview_container_${nspace} .webview_left
        { 
            display: grid;
            grid-area: left;
            grid-template-columns: 1fr ${rhs};
        }
    
        #webview_container_${nspace} .webview_right
        {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[2].size}fr ${rhs} ${wv[3].size}fr ${rhs} ${wv[4].size}fr;
            grid-template-areas: '.' '.' '.' '.';
            grid-area: right;
        }`
    }

    else if(layout === '2_left_1_right')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(7, 3)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 2), Bone.wv(1))
            Bone.insert_before(Bone.create_resize_handle('ew', 3, [1, 2], 2, 'before'), Bone.wv(3))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-columns: ${2 - (wv[3].size)}fr ${wv[3].size}fr;
            grid-template-areas: 'left right';
        }
    
        #webview_container_${nspace} .webview_left
        { 
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr;
            grid-template-areas: '.' '.' .';
            grid-area: left;
        }
    
        #webview_container_${nspace} .webview_right
        {
            display: grid;
            grid-area: right;
            grid-template-columns: ${rhs} 1fr;
        }`
    }
    
    else if(layout === '3_left_1_right')
    {
        if(create_elements) 
        {
            Bone.setup_webview_container(7, 4)
            Bone.insert_after(Bone.create_resize_handle('ns', 1, [2], 3), Bone.wv(1))
            Bone.insert_after(Bone.create_resize_handle('ns', 2, [3], 3), Bone.wv(2))
            Bone.insert_before(Bone.create_resize_handle('ew', 4, [1, 2, 3], 2, 'before'), Bone.wv(4))
        }

        css = `
        #webview_container_${nspace}
        {
            grid-template-columns: 1fr;
            grid-template-columns: ${2 - (wv[4].size)}fr ${wv[4].size}fr;
            grid-template-areas: 'left right';
        }
    
        #webview_container_${nspace} .webview_left
        { 
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: ${wv[1].size}fr ${rhs} ${wv[2].size}fr ${rhs} ${wv[3].size}fr;
            grid-template-areas: '.' '.' .' '.' '.';
            grid-area: left;
        }
    
        #webview_container_${nspace} .webview_right
        {
            display: grid;
            grid-area: right;
            grid-template-columns: ${rhs} 1fr;
        }`
    }

    let styles = Bone.$$(`.appended_layout_style_${nspace}`)

    for(let style of styles)
    {
        Bone.remove_element(style)
    }

    let style_el = document.createElement('style')
    style_el.classList.add(`appended_layout_style_${nspace}`)
    style_el.innerHTML = css

    document.head.appendChild(style_el)

    let webviews = Bone.wvs()

    for(let webview of webviews)
    {
        if(force_url_change || !webview.src)
        {
            Bone.apply_url(webview.dataset.num)
        }
    }

    space.current_layout = layout

    if(create_elements)
    {
        space.focused_webview = Bone.wv(1)
        Bone.update_focused_webview()
    }
}

// Changes a webview url
Bone.apply_url = function(num)
{
    let webview = Bone.wv(num)
    let url = Bone.swv(num).url

    if(webview.style.display === 'none')
    {
        return false
    }

    else
    {
        if(!url)
        {
            Bone.remake_webview(num, false, '', false)
            return false
        }
    }

    if(!url || webview.src === url)
    {
        return false
    }

    Bone.remake_webview(num, false, url, false)
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
        rep.src = Bone.check_url(url)
    }

    if(reset_history)
    {
        Bone.space(space_num).history[`webview_${num}`] = []
    }

    Bone.replace_element(rep, wv)

    let wv2 = Bone.wv(num, space_num)

    contextMenu(
    {
        window: wv2,
        showCopyImageAddress: true,
        showSaveImageAs: true,
        showInspectElement: true
    })

    if(space_num === Bone.current_space)
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

// Refreshes a webview with configured url
Bone.refresh_webview = function(num)
{
    let url = Bone.swv(num).url
    Bone.remake_webview(num, false, url, false)
}

// Opens a window to swap a webview config with another one
Bone.swap_webview = function(num)
{
    let items = Bone.$$('.swap_webviews_item')

    for(let item of items)
    {
        let num_2 = parseInt(item.dataset.num)

        if(num === num_2)
        {
            item.style.display = 'none'
        }

        else
        {
            let swv = Bone.swv(num_2)
            item.style.display = 'block'
            item.textContent = `Swap With: (${num_2}) ${swv.url.substring(0, Bone.config.swap_max_url_length)}`
            item.dataset.url = swv.url
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
    // Do nothing for now
}

// Populates and shows the webview history
Bone.show_history = function(num=false)
{
    if(!Bone.focused())
    {
        return false
    }

    if(!num)
    {
        num = Bone.num()
    }

    let c = Bone.$('#history_container')
    c.innerHTML = ''

    for(let item of Bone.space().history[`webview_${num}`])
    {
        let el = document.createElement('div')
        el.classList.add('history_item')
        el.classList.add('action')
        el.textContent = item.substring(0, Bone.config.history_max_url_length)
        el.dataset.url = item
        el.dataset.num = num
        c.prepend(el)
    }

    Bone.handled_history_webview = num
    Bone.msg_history.set_title(`Webview ${num} History`)
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

        Bone.handled_history_item = e.target
        Bone.show_handle_history()
    })

    Bone.$('#Msg-titlebar-history').addEventListener('click', function()
    {
        let num = Bone.handled_history_webview + 1

        if(num > Bone.config.num_webviews)
        {
            num = 1
        }

        Bone.show_history(num)
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

// Returns the current url based on history
Bone.get_current_url = function()
{
    let url = false
    let history = Bone.history()

    if(history.length > 0)
    {
        url = history[history.length - 1]
    }

    return url
}

// Goes back in history
Bone.go_back = function()
{
    let space = Bone.space()

    if(space.focused_webview)
    {
        let history = Bone.history()
        let num = Bone.num()

        if(history && history.length > 1)
        {
            history.pop()
            Bone.change_url(history.slice(-1)[0], num)
            Bone.close_all_windows()
        }
    }
}

// Returns the number of the focused webview
Bone.num = function()
{
    return parseInt(Bone.focused().dataset.num)
}

// Returns the history of the focused webview
Bone.history = function()
{
    return Bone.space().history[`webview_${Bone.num()}`]
}

// Setups the handle history window
Bone.setup_handle_history = function()
{
    Bone.$('#handle_history_open').addEventListener('click', function()
    {
        Bone.history_item_open()
    })
 
    Bone.$('#handle_history_copy').addEventListener('click', function()
    {
        Bone.copy_string(Bone.handled_history_item.dataset.url)
        Bone.info('URL copied to clipboard')
    })

    Bone.$('#handle_history_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.history_item_open()
        }
    })
}

// Shows the handle history window
Bone.show_handle_history = function()
{
    let num = Bone.wvs().length
    let container = Bone.$('#handle_history_layout_container')
    let layout = Bone.$('#handle_history_layout')
    layout.innerHTML = ''

    if(num > 1)
    {
        let clone = Bone.$(`#layout_${Bone.space().current_layout}`).cloneNode(true)
        clone.id = ''
        clone.classList.add('menu_layout_item_2')

        let items = clone.querySelectorAll('.layout_square_item')

        for(let item of items)
        {
            item.classList.add('action')

            item.addEventListener('click', function()
            {
                Bone.change_url(Bone.handled_history_item.dataset.url, parseInt(this.innerHTML))
                Bone.close_all_windows()
            })
        }

        layout.append(clone)
        container.style.display = 'block'
    }

    else
    {
        container.style.display = 'none'
    }

    Bone.msg_handle_history.set_title(Bone.handled_history_item.dataset.url.substring(0, 50))

    Bone.msg_handle_history.show(function()
    {
        Bone.$('#handle_history_container').focus()
    })
}

// Opens a history item
Bone.history_item_open = function()
{
    let item = Bone.handled_history_item
    let space = Bone.space()
    let url = item.dataset.url
    let num = item.dataset.num
    let history = space.history[`webview_${num}`]
    let index = 0 - Bone.get_child_index(item)

    if(index < 0)
    {
        space.history[`webview_${num}`] = history.slice(0, index)
    }

    Bone.change_url(url, num)
    Bone.close_all_windows()
}

// Focuses current webview
Bone.focus_webview = function(num=false)
{
    let wv

    if(!num)
    {
        wv = Bone.focused()
    }

    else
    {
        wv = Bone.wv(num)
    }

    document.activeElement.blur()
    wv.focus()
    Bone.space().focused_webview = wv
    Bone.check_ghost_webviews()
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

// Changes the url of a specified webview
Bone.change_url = function(url, num=false, space_num=false)
{
    url = url.trim()
    
    if(!num)
    {
        num = Bone.num()
    }
    
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    if(parseInt(Bone.focused().dataset.num) === num)
    {
        let url_el = Bone.$('#url')
        url_el.value = url
        Bone.move_cursor_to_end(url_el)
    }

    Bone.remake_webview(num, space_num, url, false, false)
}

// Handles navigation changes
Bone.handle_navigation = function(wv, e)
{
    if(!e.url)
    {
        return false
    }

    Bone.change_url(e.url, parseInt(wv.dataset.num), parseInt(wv.dataset.space))
}

// Checks and prepares a url
Bone.check_url = function(url)
{
    if(!url.startsWith('http://') && !url.startsWith('https://'))
    {
        if(!url.startsWith('localhost') && !url.startsWith('127.0.0.1'))
        {
            url = `http://${url}`
        }
    }

    return url
}

// Returns the focused webview
Bone.focused = function()
{
    return Bone.space().focused_webview
}

// Cycles webview focus
Bone.cycle_webview = function(direction='right')
{
    let num

    if(direction === 'right')
    {
        num = Bone.num() + 1
    
        if(num > Bone.wvs().length)
        {
            num = 1
        }
    }
    
    else if(direction === 'left')
    {
        num = Bone.num() - 1
    
        if(num <= 0)
        {
            num = Bone.wvs().length
        }
    }
    
    Bone.focus_webview(num)
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
    clearTimeout(Bone.ghost_webviews_shot_timeout)

    for(let webview of Bone.wvs())
    {
        webview.classList.remove('ghost_webview')
    }
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
        Bone.remove_ghost_webviews()
    }
}

// Does a ghost webviews for an instant
Bone.ghost_webviews_shot = function()
{
    Bone.ghost_webviews()

    Bone.ghost_webviews_shot_timeout = setTimeout(function()
    {
        Bone.remove_ghost_webviews()
    }, 800)
}