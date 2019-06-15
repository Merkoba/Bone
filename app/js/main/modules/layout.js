// Applies webview layout setup from current layout
Bone.apply_layout = function(space_num=false, reset_size=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    let c = Bone.webview_container(space_num)
    c.innerHTML = ''
    let space = Bone.space(space_num)
    
    if(space.layout)
    {
        let layout = Bone.generate_layout(space.layout, {mode:'webviews', space_num:space_num})
        c.append(layout)

        let wvs = Bone.wvs(space_num)
        space.webviews = space.webviews.slice(0, wvs.length)
        
        if(reset_size)
        {    
            let swvs = Bone.swvs(space_num)

            for(let swv of swvs)
            {
                swv.size = 1
            }
            
            space.container_sizes = {}
            Bone.space_modified(space_num)
        }
        
        for(let wv of wvs)
        {
            let num = parseInt(wv.dataset.num)
            let swv = Bone.swv(num, space_num)
            let url
            
            if(!swv)
            {
                url = Bone.storage.startpage
                space.webviews.push(Bone.create_webview_object(num, url))
            }
            
            else
            {
                url = swv.url
            }
            
            wv.src = url
        }
        
        Bone.generate_grid_templates(c)
        Bone.create_resizers(c)
    }
    
    else
    {
        c.append(Bone.create_webview(1, space_num))
        Bone.wv(1, space_num).src = Bone.swv(1, space_num).url
    }
}

// Setups the create layout window
Bone.setup_create_layout = function()
{
    Bone.$('#create_layout_grid').addEventListener('click', function(e)
    {
        Bone.change_create_layout_grid(e)
    })

    Bone.$('#create_layout_clear').addEventListener('click', function(e)
    {
        Bone.clear_create_layout(e)
    })

    Bone.$('#create_layout_apply').addEventListener('click', function(e)
    {
        Bone.apply_create_layout(e)
    })
}

// Shows the create layout window
Bone.show_create_layout = function()
{
    Bone.start_create_layout()
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

// Updates the create layout grid based on the create layout object
Bone.update_create_layout = function()
{
    Bone.create_layout_object = Bone.generate_layout_object()

    let c = Bone.$('#create_layout_grid')
    c.innerHTML = ''
    let layout = Bone.generate_layout(Bone.create_layout_object, {mode:'create_layout'})
    c.append(layout)
}

// Generates a layout based on arrays
Bone.generate_layout = function(obj, options)
{
    Bone.generate_layout_num = 1
    Bone.generate_layout_container_num = 1
    return Bone.do_generate_layout(obj, options)
}

// Performs the generate layout action
Bone.do_generate_layout = function(obj, options)
{
    let layout = false

    if(obj.mode)
    {
        layout = document.createElement('div')
        layout.classList.add(`${obj.mode}_grid`)
        layout.classList.add('grid_item')
        layout.classList.add('grid_container')
        layout.classList.add(`grid_container_c_${Bone.generate_layout_container_num}`)
        layout.dataset.num = `c_${Bone.generate_layout_container_num}`
        layout.dataset.mode = obj.mode
        Bone.generate_layout_container_num += 1
    }
    
    if(obj.items && obj.items.length > 0)
    {
        for(let i=0; i<obj.items.length; i++)
        {
            let item = obj.items[i]
            
            if(item.items && item.items.length > 0)
            {
                let layout_2 = Bone.do_generate_layout(item, options)

                if(layout)
                {
                    layout.append(layout_2)
                }

                else
                {
                    layout = layout_2
                }
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
                        layout_2 = Bone.create_webview(Bone.generate_layout_num, options.space_num)
                        Bone.generate_layout_num += 1
                    }
                }

                if(layout)
                {
                    layout.append(layout_2)
                }

                else
                {
                    layout = layout_2
                }
            }
        }
    }

    return layout
}

// Generates the create layout object based on current layout
Bone.generate_layout_object = function(parent=false)
{
    let obj = {}
    
    if(!parent)
    {
        parent = Bone.$('#create_layout_grid')
        Bone.clean_layout_object(parent)
    }

    let items = Bone.$$('.grid_item', parent, true)

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

        if(obj_2.mode !== 'node')
        {
            obj_2.items = Bone.generate_layout_object(item).items
        }

        obj.items.push(obj_2)
    }

    return obj
}

// Updates the create layout grid based on arrow use
Bone.change_create_layout_grid = function(e)
{
    if
    (
        !e.target.classList.contains('create_layout_grid_item_arrows_h') && 
        !e.target.classList.contains('create_layout_grid_item_arrows_v') &&
        !e.target.classList.contains('create_layout_grid_item_delete')
    )
    {
        return false
    }

    let item = e.target.closest('.create_layout_grid_item')
    let mode = e.target.dataset.mode
    let parent = item.parentElement
    let add_to_parent = false

    if(mode === 'delete')
    {
        Bone.remove_element(item)
        Bone.update_create_layout()
        return false
    }
  
    else if(mode === 'horizontal' || mode === 'vertical')
    {
        if(parent && parent.classList.contains(`${mode}_grid`))
        {
            add_to_parent = true
        }
            
        else
        {
            item.classList.add(`${mode}_grid`)
            item.classList.add('grid_container')
            item.dataset.mode = mode
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

    Bone.update_create_layout()
}

// Applies the created layout
Bone.apply_create_layout = function()
{
    let layout_object = Bone.generate_layout_object()

    let space = Bone.space()
    space.layout = layout_object
    Bone.space_modified()
    Bone.apply_layout(false, true)
    Bone.focus(1)
    Bone.close_all_windows()
}

// Generates a template to use in grid columns or rows
Bone.generate_grid_templates = function(layout, space_num=false)
{
    if(!space_num)
    {
        space_num = Bone.current_space
    }

    let horizontal = Bone.$$('.horizontal_grid', layout)
    let vertical = Bone.$$('.vertical_grid', layout)

    for(let container of horizontal)
    {
        Bone.do_generate_grid_templates(container, space_num)
    }

    for(let container of vertical)
    {
        Bone.do_generate_grid_templates(container, space_num)
    }
}

// Does generate grid templates for container items
Bone.do_generate_grid_templates = function(container, space_num)
{
    let s = ''
    let items = Array.from(container.children)

    for(let i=0; i<items.length; i++)
    {
        let item = items[i]

        if(item.classList.contains('resize_handle'))
        {
            continue
        }

        if(i !== 0)
        {
            s += `auto `
        }

        if(item.classList.contains('webview'))
        {
            let num = parseInt(item.dataset.num)
            s += `${Bone.swv(num, space_num).size}fr `
        }
        
        else
        {
            let num = item.dataset.num
            s += `${Bone.get_container_size(num, space_num) || 1}fr `
        }
    }

    if(container.classList.contains('horizontal_grid'))
    {
        container.style.gridTemplateColumns = s
    }
    
    else if(container.classList.contains('vertical_grid'))
    {
        container.style.gridTemplateRows = s
    }
}

// Gets a layout webview container
Bone.layout_container = function(n, c)
{
    return Bone.$(`.grid_container_${n}`, c)
}

// Clears the create grid layout
Bone.clear_create_layout = function()
{
    Bone.start_create_layout(true)
}

// Starts the create layout window
Bone.start_create_layout = function(clear=false)
{
    let c = Bone.$('#create_layout_grid')
    c.innerHTML = ''
    let layout = Bone.space().layout

    if(layout && !clear)
    {
        c.append(Bone.generate_layout(layout, {mode:'create_layout'}))
    }

    else
    {
        c.append(Bone.make_create_layout_grid_item())
        Bone.update_create_layout()
    }
}

// Removes empty containers from the create layout grid object
Bone.clean_layout_object = function(parent)
{
    let go = true

    while(go)
    {
        let horizontal = Bone.$$('.horizontal_grid', parent)
        let res_1 = Bone.do_clean_layout_object(horizontal)

        let vertical = Bone.$$('.vertical_grid', parent)
        let res_2 = Bone.do_clean_layout_object(vertical)

        go = res_1 || res_2
    }
}

// Does the clean layout object operation
Bone.do_clean_layout_object = function(containers)
{
    let removed = false
    
    for(let container of containers)
    {
        let children = Array.from(container.children)
        let parent = container.parentElement

        if(children.length === 0)
        {
            Bone.remove_element(container)
            removed = true
        }

        else if(container.children.length === 1 && container.children[0].classList.contains('grid_container'))
        {
            container.before(container.children[0])
            Bone.remove_element(container)
            removed = true
        }

        else if(container.dataset.mode && container.dataset.mode === parent.dataset.mode)
        {
            for(let child of children)
            {
                container.before(child)
            }

            Bone.remove_element(container)
            removed = true
        }
    }

    return removed
}