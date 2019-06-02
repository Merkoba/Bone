// Create a webview from a template
Bone.create_webview = function(num, space)
{
    let h = Bone.template_webview({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wv = el.querySelector('webview')
    wv.dataset.num = num

    wv.addEventListener('dom-ready', function()
    {
        Bone.on_webview_dom_ready(this, num)
    })

    wv.addEventListener('focus', function()
    {
        Bone.space().focused_webview = this
    })

    wv.addEventListener('did-navigate', function(e)
    {
        if(!e.url)
        {
            return false
        }

        let history = Bone.space(space).history[`webview_${num}`]
        
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
    let nspace = Bone.space().num
    let layout = Bone.space().layout
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
        wv[i].size = Bone.space()[`webview_${i}`].size
    }

    if(reset_size)
    {
        Bone.reset_size(0, false, 'special_row_1')
    }

    let create_elements = true

    if(create === 'auto')
    {
        if(Bone.space().current_layout === layout)
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
        Bone.setup_webview_container(1)
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

        let space = Bone.space()
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

    Bone.space().current_layout = layout

    if(create_elements)
    {
        Bone.space().focused_webview = Bone.wv(1)
    }
}

// Changes a webview url
Bone.apply_url = function(num)
{
    let webview = Bone.wv(num)
    let url = Bone.space()[`webview_${num}`].url

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
    let wv = Bone.wv(num)
    let rep = Bone.create_webview(num, Bone.current_space)

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
        Bone.space().history[`webview_${num}`] = []
    }

    Bone.replace_element(rep, wv)

    let wv2 = Bone.wv(num)

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
        let webview = Bone.wv(num)
        let zoom = Bone.space()[`webview_${num}`].zoom
        webview.setZoomLevel(0)
        webview.setZoomFactor(zoom)
        Bone.set_zoom_label(num)
    }

    catch(err){}
}

// Sets the zoom level to a webview
Bone.set_zoom_label = function(num)
{
    let zoom = Bone.space()[`webview_${num}`].zoom
    Bone.$(`#webview_${num}_zoom_label`).textContent = `Zoom (${Number(zoom).toFixed(2)})`
}

// Decreases a webview zoom level by config.zoom_step
Bone.decrease_zoom = function(num, mode='normal')
{
    let step = Bone.config.zoom_step

    if(mode === 'double')
    {
        step *= 2
    }

    let zoom = Bone.round(Bone.space()[`webview_${num}`].zoom - step, 2)
    Bone.space()[`webview_${num}`].zoom = zoom
    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_zoom(num)
}

// Increases a webview zoom level by config.zoom_step
Bone.increase_zoom = function(num, mode='normal')
{
    let step = Bone.config.zoom_step

    if(mode === 'double')
    {
        step *= 2
    }

    let zoom = Bone.round(Bone.space()[`webview_${num}`].zoom + step, 2)
    Bone.space()[`webview_${num}`].zoom = zoom
    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_zoom(num)
}

// Resets a webview zoom level to zoom_default
Bone.reset_zoom = function(num)
{
    Bone.space()[`webview_${num}`].zoom = Bone.config.zoom_default
    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_zoom(num)
}

// Sets the size to a webview
Bone.set_size_label = function(num)
{
    let size = Bone.space()[`webview_${num}`].size
    Bone.$(`#webview_${num}_size_label`).textContent = `Size (${Number(size).toFixed(2)})`
}

// Decreases a webview size by size_step
Bone.decrease_size = function(num, mode='normal')
{
    let step = Bone.config.size_step

    if(mode === 'double')
    {
        step *= 2
    }

    let size = Bone.round(Bone.space()[`webview_${num}`].size - step, 2)

    if(size < 0)
    {
        size = 0
    }

    Bone.space()[`webview_${num}`].size = size
    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_layout(false)
    Bone.set_size_label(num)
}

// Increases a webview size by size_step
Bone.increase_size = function(num, mode='normal')
{
    let step = Bone.config.size_step

    if(mode === 'double')
    {
        step *= 2
    }

    let size = Bone.round(Bone.space()[`webview_${num}`].size + step, 2)
    Bone.space()[`webview_${num}`].size = size
    Bone.space_modified()
    Bone.save_local_storage()
    Bone.apply_layout(false)
    Bone.set_size_label(num)
}

// Resets a webview size to size_default
Bone.reset_size = function(num, apply=true, mode='')
{
    if(mode.includes('special'))
    {
        Bone.space().special[mode.replace(/.*special_/, '')] = Bone.config.size_default
    }

    else
    {
        Bone.space()[`webview_${num}`].size = Bone.config.size_default
        Bone.set_size_label(num)
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
    let url = Bone.space()[`webview_${num}`].url
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
            let wv = Bone.space()[`webview_${num_2}`]
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
    let w1 = Bone.space()[`webview_${num_1}`]
    let w2 = Bone.space()[`webview_${num_2}`]
    let ourl_1 = w1.url
    let ozoom_1 = w1.zoom

    w1.url = w2.url
    w2.url = ourl_1
    w1.zoom = w2.zoom
    w2.zoom = ozoom_1

    Bone.$(`#menu_url_${num_1}`).value = w1.url
    Bone.$(`#menu_url_${num_2}`).value = w2.url

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
        let history = Bone.space().history[`webview_${num}`]
        let index = 0 - Bone.get_child_index(e.target)

        if(index < 0)
        {
            Bone.space().history[`webview_${num}`] = history.slice(0, index)
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
            Bone.set_size_label(num)
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
    obj.size = Bone.config.size_default
    obj.zoom = Bone.config.zoom_default
    return obj
}