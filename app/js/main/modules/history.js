// Returns the history of the focused webview
Bone.history = function()
{
    return Bone.swv(Bone.num()).history
}

// Setups the handle history window
Bone.setup_handle_history = function()
{
    Bone.$('#handle_history_container').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('handle_history_item'))
        {
            return false
        }

        Bone.change_url(Bone.handled_history_item.dataset.url, e.target.dataset.num)
        Bone.close_all_windows()
    })
}

// Shows the handle history window
Bone.show_handle_history = function()
{
    let wvs = Bone.wvs()
    
    if(wvs.length < 2)
    {
        return false
    }
    
    let c = Bone.$('#handle_history_container')
    c.innerHTML = ''

    let num = parseInt(Bone.handled_history_item.dataset.num)

    for(let i=1; i<=wvs.length; i++)
    {
        if(i === num)
        {
            continue
        }

        let item = document.createElement('div')
        item.classList.add('handle_history_item')
        item.classList.add('action')
        item.textContent = `Open In: (${i}) ${Bone.swv(i).url.substring(0, Bone.config.small_url_length)}`
        item.dataset.num = i

        c.append(item)
    }

    Bone.msg_handle_history.set_title(Bone.handled_history_item.dataset.url.substring(0, 50))
    Bone.msg_handle_history.show()
}

// Opens a history item
Bone.history_item_open = function()
{
    let item = Bone.handled_history_item
    let url = item.dataset.url
    let num = item.dataset.num
    let history = Bone.swv(num).history
    let index = 0 - Bone.get_child_index(item)

    if(index < 0)
    {
        history = history.slice(0, index)
    }

    Bone.change_url(url, num)
    Bone.close_all_windows()
}

// Pushes to a webview history
Bone.push_to_history = function(webview, url)
{
    let num = parseInt(webview.dataset.num)
    let space = parseInt(webview.dataset.space)
    let history = Bone.swv(num).history
        
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

    for(let item of Bone.swv(num).history)
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