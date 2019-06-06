// Returns the history of the focused webview
Bone.history = function()
{
    return Bone.space().history[`webview_${Bone.num()}`]
}

// Shows the handle history window
Bone.show_handle_history = function()
{
    let num = Bone.wvs().length

    if(num < 2)
    {
        return false
    }

    let container = Bone.$('#handle_history_layout_container')
    let layout = Bone.$('#handle_history_layout')
    layout.innerHTML = ''

    let clone = Bone.$(`#layout_${Bone.space().current_layout}`).cloneNode(true)
    clone.id = ''
    clone.classList.add('menu_layout_item_2')

    let items = Bone.$$('.layout_square_item', clone)

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

    Bone.msg_handle_history.set_title(Bone.handled_history_item.dataset.url.substring(0, 50))
    Bone.msg_handle_history.show()
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

// Pushes to a webview history
Bone.push_to_history = function(webview, url)
{
    let num = parseInt(webview.dataset.num)
    let space = parseInt(webview.dataset.space)
    let history = Bone.space(space).history[`webview_${num}`]
        
    if(history.slice(-1)[0] === url)
    {
        return false
    }

    for(let i=0; i<history.length; i++)
    {
        let url_2 = history[i]

        if(url === url_2)
        {
            history.splice(i, 1)
            break
        }
    }

    history.push(url)
}

// Setups history
Bone.setup_history = function()
{
    let container = Bone.$('#history_container')
    
    container.addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('history_item'))
        {
            return false
        }

        Bone.change_url(e.target.dataset.url)
        Bone.close_all_windows()
    })

    container.addEventListener('auxclick', function(e)
    {
        if(!e.target.classList.contains('history_item'))
        {
            return false
        }

        if(e.which === 2)
        {
            Bone.handled_history_item = e.target
            Bone.show_handle_history()
        }
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

    let wvs = Bone.wvs()
    let num_webviews = wvs.length
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

        if(num_webviews > 1)
        {
            el.title = 'Middle click to open in another webview'
        }

        c.prepend(el)
    }

    Bone.handled_history_webview = num
    Bone.msg_history.set_title(`Webview ${num} History`)
    Bone.msg_history.show()
}