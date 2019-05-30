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

// Setup webviews
Bone.setup_webviews = function()
{
    let c = Bone.$('#webview_container')

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        let wv = Bone.create_webview(i)
        c.appendChild(wv)

        if(i === 1)
        {
            Bone.focused_webview = wv
        }
    }

    Bone.initial_webview_display = Bone.$('#webview_1').style.display
}

// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true, force_url_change=false)
{
    let layout = Bone.storage.layout

    let c = Bone.$('#webview_container')
    c.classList.remove('webview_container_row')
    c.classList.remove('webview_container_column')
    
    let wv = {}

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        wv[i] = {}
        wv[i].el = Bone.$(`#webview_${i}`)
        wv[i].el.style.width = 'initial'
        wv[i].el.style.height = 'initial'
        wv[i].el.style.display = Bone.initial_webview_display

        if(reset_size)
        {
            Bone.reset_size(i, false)
        }
    }

    if(layout === 'single')
    {
        c.classList.add('webview_container_row')
        Bone.remake_webview(2)
        Bone.remake_webview(3)
        Bone.remake_webview(4)
    }

    else if(layout === '2_column')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '100%'
        Bone.remake_webview(3)
        Bone.remake_webview(4)
    }

    else if(layout === '3_column')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '100%'
        wv[2].el.style.width = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '4_column')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '100%'
        wv[2].el.style.width = '100%'
        wv[3].el.style.width = '100%'
    }

    else if(layout === '2_row')
    {
        c.classList.add('webview_container_row')
        Bone.remake_webview(3)
        Bone.remake_webview(4)
    }
    
    else if(layout === '3_row')
    {
        c.classList.add('webview_container_row')
        Bone.remake_webview(4)
    }

    else if(layout === '4_row')
    {
        c.classList.add('webview_container_row')
    }

    else if(layout === '1_top_2_bottom')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '1_top_3_bottom')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '100%'
    }

    else if(layout === '2_top_1_bottom')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '50%'
        wv[2].el.style.width = '50%'
        Bone.remake_webview(4)
    }

    else if(layout === '3_top_1_bottom')
    {
        c.classList.add('webview_container_row')
        wv[4].el.style.width = '100%'
    }

    else if(layout === '2_top_2_bottom')
    {
        c.classList.add('webview_container_row')
        wv[1].el.style.width = '50%'
        wv[2].el.style.width = '50%'
        wv[3].el.style.width = '50%'
        wv[4].el.style.width = '50%'
    }

    else if(layout === '1_left_2_right')
    {
        c.classList.add('webview_container_column')
        wv[1].el.style.height = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '1_left_3_right')
    {
        c.classList.add('webview_container_column')
        wv[1].el.style.height = '100%'
    }

    else if(layout === '2_left_1_right')
    {
        c.classList.add('webview_container_column')
        wv[3].el.style.height = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '3_left_1_right')
    {
        c.classList.add('webview_container_column')
        wv[4].el.style.height = '100%'
    }

    let webviews = Bone.$$('.webview')

    for(let webview of webviews)
    {
        if(force_url_change || !webview.src)
        {
            Bone.apply_url(webview.id.replace('webview_', ''))
        }
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
        rep.style.display = Bone.initial_webview_display
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
    }

    catch(err){}
}

// Sets the zoom level to a webview
Bone.set_zoom_label = function(num)
{
    let zoom = Bone.storage[`webview_${num}`].zoom
    Bone.$(`#webview_${num}_zoom_label`).textContent = `Zoom (${zoom})`
}

// Decreases a webview zoom level by config.zoom_step
Bone.decrease_zoom = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom - Bone.config.zoom_step, 1)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom(num)
    Bone.set_zoom_label(num)
    Bone.save_local_storage()
}

// Increases a webview zoom level by config.zoom_step
Bone.increase_zoom = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom + Bone.config.zoom_step, 1)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom(num)
    Bone.set_zoom_label(num)
    Bone.save_local_storage()
}

// Resets a webview zoom level to zoom_default
Bone.reset_zoom = function(num)
{
    Bone.storage[`webview_${num}`].zoom = Bone.config.zoom_default
    Bone.apply_zoom(num)
    Bone.set_zoom_label(num)
    Bone.save_local_storage()
}

// Applies the configured sizes to the webviews
Bone.apply_size = function()
{
    let layout = Bone.storage.layout
    let c = Bone.$('#webview_container')
    let wv = {}

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        wv[i] = {}
        wv[i].el = Bone.$(`#webview_${i}`)
        wv[i].size = Bone.storage[`webview_${i}`].size
    }

    if(layout === 'single')
    {
        // Do nothing
    }

    else if(layout === '2_column')
    {
        let sum = wv[1].size + wv[2].size
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum)}%`
    }

    else if(layout === '3_column')
    {
        let sum = wv[1].size + wv[2].size + wv[3].size
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum)}%`
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum)}%`
    }

    else if(layout === '4_column')
    {
        let sum = wv[1].size + wv[2].size + wv[3].size + wv[4].size
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum)}%`
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum)}%`
        wv[4].el.style.height = `${Bone.get_percentage(wv[4].size, sum)}%`
    }

    else if(layout === '2_row')
    {
        let sum = wv[1].size + wv[2].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum)}%`
    }
    
    else if(layout === '3_row')
    {
        let sum = wv[1].size + wv[2].size + wv[3].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum)}%`
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum)}%`
    }

    else if(layout === '4_row')
    {
        let sum = wv[1].size + wv[2].size + wv[3].size + wv[4].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum)}%`
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum)}%`
        wv[4].el.style.width = `${Bone.get_percentage(wv[4].size, sum)}%`
    }

    else if(layout === '1_top_2_bottom')
    {
        let sum = wv[1].size + 1
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[2].size + wv[3].size
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum_2)}%`
    }

    else if(layout === '1_top_3_bottom')
    {
        let sum = wv[1].size + 1
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[4].el.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[2].size + wv[3].size + wv[4].size
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum_2)}%`
        wv[4].el.style.width = `${Bone.get_percentage(wv[4].size, sum_2)}%`
    }

    else if(layout === '2_top_1_bottom')
    {
        let sum = wv[3].size + 1
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum)}%`
        wv[1].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[1].size + wv[2].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum_2)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum_2)}%`
    }

    else if(layout === '3_top_1_bottom')
    {
        let sum = wv[4].size + 1
        wv[4].el.style.height = `${Bone.get_percentage(wv[4].size, sum)}%`
        wv[1].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[2].el.style.height = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[1].size + wv[2].size + wv[3].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum_2)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum_2)}%`
    }

    else if(layout === '2_top_2_bottom')
    {
        let sum = wv[1].size + wv[2].size
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(wv[2].size, sum)}%`

        let sum_2 = wv[3].size + wv[4].size
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum_2)}%`
        wv[4].el.style.width = `${Bone.get_percentage(wv[4].size, sum_2)}%`
    }

    else if(layout === '1_left_2_right')
    {
        let sum = wv[1].size + 1
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[2].size + wv[3].size
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum_2)}%`
    }

    else if(layout === '1_left_3_right')
    {
        let sum = wv[1].size + 1
        wv[1].el.style.width = `${Bone.get_percentage(wv[1].size, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[4].el.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[2].size + wv[3].size + wv[4].size
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum_2)}%`
        wv[4].el.style.height = `${Bone.get_percentage(wv[4].size, sum_2)}%`
    }

    else if(layout === '2_left_1_right')
    {
        let sum = wv[3].size + 1
        wv[3].el.style.width = `${Bone.get_percentage(wv[3].size, sum)}%`
        wv[1].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[1].size + wv[2].size
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum_2)}%`
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum_2)}%`
    }

    else if(layout === '3_left_1_right')
    {
        let sum = wv[4].size + 1
        wv[4].el.style.width = `${Bone.get_percentage(wv[4].size, sum)}%`
        wv[1].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[2].el.style.width = `${Bone.get_percentage(1, sum)}%`
        wv[3].el.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = wv[1].size + wv[2].size + wv[3].size
        wv[1].el.style.height = `${Bone.get_percentage(wv[1].size, sum_2)}%`
        wv[2].el.style.height = `${Bone.get_percentage(wv[2].size, sum_2)}%`
        wv[3].el.style.height = `${Bone.get_percentage(wv[3].size, sum_2)}%`
    }
}

// Sets the size to a webview
Bone.set_size_label = function(num)
{
    let size = Bone.storage[`webview_${num}`].size
    Bone.$(`#webview_${num}_size_label`).textContent = `Size (${size})`
}

// Decreases a webview size by size_step
Bone.decrease_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size - Bone.config.size_step, 1)

    if(size <= 0)
    {
        return false
    }

    Bone.storage[`webview_${num}`].size = size
    Bone.apply_size(num)
    Bone.set_size_label(num)
    Bone.save_local_storage()
}

// Increases a webview size by size_step
Bone.increase_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size + Bone.config.size_step, 1)
    Bone.storage[`webview_${num}`].size = size
    Bone.apply_size(num)
    Bone.set_size_label(num)
    Bone.save_local_storage()
}

// Resets a webview size to size_default
Bone.reset_size = function(num, apply=true)
{
    Bone.storage[`webview_${num}`].size = Bone.config.size_default
    Bone.set_size_label(num)
    Bone.save_local_storage()

    if(apply)
    {
        Bone.apply_size(num)
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
    Bone.set_zoom_label(num_1)
    Bone.set_zoom_label(num_2)
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