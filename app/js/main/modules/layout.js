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
        let handles = Bone.$$('.resize_handle', Bone.webview_container())
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

    if(create_elements)
    {
        space.focused_webview = Bone.wv(1)
        Bone.update_focused_webview()
    }

    let webviews = Bone.wvs()

    for(let webview of webviews)
    {
        if(force_url_change || !webview.src)
        {
            let num = parseInt(webview.dataset.num)
            Bone.change_url(Bone.swv(num).url, num)
        }
    }

    space.current_layout = layout
    Bone.check_titles()
}