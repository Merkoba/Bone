// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true, force_url_change=false, create='auto')
{
    let c = Bone.$(`#webview_container_${Bone.current_space}`)
    c.innerHTML = ''
    let space = Bone.space()

    if(space.layout)
    {
        let layout = Bone.generate_layout(space.layout, {mode:'webviews'})
        let items = Bone.$$('.webview_layout_item', layout, true)

        for(let item of items)
        {
            c.append(item)
        }

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
        c.append(Bone.create_webview(1))
        Bone.wv(1).src = Bone.swv(1).url
    }
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
        container_id: `webview_shell`,
        container_classes: 'webview_container',
        item_class: 'webview_layout_item',
    })

    let space = Bone.space()
    space.layout = layout_object
    Bone.space_modified()
    Bone.apply_layout()
    Bone.close_all_windows()
}