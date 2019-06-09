// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true, force_url_change=false, create='auto')
{
    let space = Bone.space()

    if(space.layout)
    {
        let layout = Bone.generate_layout(space.layout, {mode:'webviews'})
        Bone.$(`#webview_container_${Bone.current_space}`).innerHTML = layout.innerHTML

        let wvs = Bone.wvs()

        for(let wv of wvs)
        {
            let num = parseInt(wv.dataset.num)
            let space_num = parseInt(wv.dataset.space_num)
            let swv = Bone.swv(num, space_num)
            let url

            if(!swv)
            {
                url = Bone.config.startpage
                space.webviews.push(Bone.create_webview_object(num, url))
            }

            else
            {
                url = swv.url
            }

            wv.src = url
        }
    }

    else
    {
        Bone.webview_container().append(Bone.create_webview(1))
        Bone.wv(1).src = Bone.swv(1).url
    }

    return false
    let space9 = Bone.space()
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

// Setups the create layout window
Bone.setup_create_layout = function()
{
    Bone.$('#create_layout_grid_container').addEventListener('click', function(e)
    {
        Bone.update_create_layout_grid(e)
    })

    Bone.$('#create_layout_apply').addEventListener('click', function(e)
    {
        Bone.apply_create_layout(e)
    })
}

// Shows the create layout window
Bone.show_create_layout = function()
{
    Bone.create_layout_object = 
    {
        mode:'container',
        id: 'create_layout_grid', 
        items:[{mode: 'node', element: Bone.make_create_layout_grid_item()}]
    }

    Bone.update_create_layout()
    Bone.msg_create_layout.show()
}

// Creates an item for the create layout grid
Bone.make_create_layout_grid_item = function()
{
    let h = Bone.template_create_layout_grid_item()
    let el = document.createElement('div')
    el.innerHTML = h
    let item = el.querySelector('.create_layout_grid_item')
    return item
}

// Generates a layout based on arrays
Bone.generate_layout = function(obj, options)
{
    Bone.generate_layout_num = 1
    return Bone.do_generate_layout(obj, options)
}

// Performs the generate layout action
Bone.do_generate_layout = function(obj, options)
{
    let layout = document.createElement('div')
    layout.classList.add(`${obj.mode}_grid`)

    if(obj.id)
    {
        layout.id = obj.id
    }

    if(obj.classes)
    {
        let classlist = obj.classes.split(' ')

        for(let cls of classlist)
        {
            layout.classList.add(cls)
        }
    }
    
    if(obj.items && obj.items.length > 0)
    {
        for(let i=0; i<obj.items.length; i++)
        {
            let item = obj.items[i]
            
            if(item.items && item.items.length > 0)
            {
                layout.append(Bone.do_generate_layout(item, options))
            }
            
            else
            {
                let layout_2

                if(item.mode === 'node')
                {
                    if(options.mode === 'create_layout')
                    {
                        layout_2 = Bone.make_create_layout_grid_item()
                    }
            
                    else if(options.mode === 'webviews')
                    {
                        layout_2 = Bone.create_webview(Bone.generate_layout_num)
                        Bone.generate_layout_num += 1
                    }
                }
                
                else
                {
                    layout_2 = document.createElement('div')
                    layout_2.classList.add(`${item.mode}_grid`)
                }

                layout.append(layout_2)
            }
        }
    }

    return layout
}

// Updates the create layout grid based on the create layout object
Bone.update_create_layout = function()
{
    let c = Bone.$('#create_layout_grid_container')
    c.innerHTML = ''
    c.append(Bone.generate_layout(Bone.create_layout_object, {mode:'create_layout'}))
}

// Generates the create layout object based on current layout
Bone.generate_layout_object = function(parent=false, options={})
{
    let obj = {}
    
    if(!parent)
    {
        parent = Bone.$('#create_layout_grid')
        obj.id = options.container_id
        obj.classes = options.container_classes
    }

    let items = Bone.$$('.create_layout_grid_item', parent, true)

    if(items && items.length > 0)
    {
        obj.items = []
    }

    for(let item of items)
    {
        let obj_2 = {}

        if(item.classList.contains('horizontal_grid'))
        {
            obj_2.mode = 'horizontal'
        }
        
        else if(item.classList.contains('vertical_grid'))
        {
            obj_2.mode = 'vertical'
        }
        
        else
        {
            obj_2.mode = 'node'
        }
        
        obj_2.classes = options.item_class

        if(obj_2.mode !== 'node')
        {
            obj_2.items = Bone.generate_layout_object(item, options).items
        }

        obj.items.push(obj_2)
    }

    return obj
}

// Updates the create layout grid based on arrow use
Bone.update_create_layout_grid = function(e)
{
    if
    (
        !e.target.classList.contains('create_layout_grid_item_arrows_h') && 
        !e.target.classList.contains('create_layout_grid_item_arrows_v')
    )
    {
        return false
    }

    let item = e.target.closest('.create_layout_grid_item')
    let mode = e.target.dataset.mode
    let parent = item.parentElement
    let add_to_parent = false
  
    if(mode === 'horizontal')
    {
        if(parent && parent.classList.contains('horizontal_grid'))
        {
            add_to_parent = true
        }
            
        else
        {
            item.classList.add('horizontal_grid')
        }
    }
        
    else if(mode === 'vertical')
    {
        if(parent && parent.classList.contains('vertical_grid'))
        {
            add_to_parent = true
        }
            
        else
        {
            item.classList.add('vertical_grid')
        }
    }
        
    if(add_to_parent)
    {
        Bone.insert_after(Bone.make_create_layout_grid_item(), item)
    }
        
    else
    {
        item.innerHTML = ''
        item.append(Bone.make_create_layout_grid_item())
        item.append(Bone.make_create_layout_grid_item())
    }
        
    Bone.create_layout_object = Bone.generate_layout_object(false,
    {
        container_id: 'create_layout_grid',
        container_classes: 'none',
        item_class: 'create_layout_grid_item',
    })

    Bone.update_create_layout()
}

// Applies the created layout
Bone.apply_create_layout = function()
{
    let layout_object = Bone.generate_layout_object(false,
    {
        container_id: `container`,
        container_classes: 'webview_container',
        item_class: 'webview_layout_item',
    })

    let space = Bone.space()
    space.layout = layout_object
    Bone.space_modified()
    Bone.apply_layout()
    Bone.close_all_windows()
}