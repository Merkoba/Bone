// Setups global history
Bone.setup_global_history = function()
{
    Bone.sort_global_history()
}

// Adds a url to the history
// This is used to show url suggestions in the url bar
Bone.add_to_global_history = function(url)
{
    let history = Bone.storage.global_history

    url = url.trim()

    if(url.length > Bone.config.global_history_url_max_length)
    {
        return false
    }

    let urls = history.map(obj => obj.url)

    if(urls.includes(url))
    {
        let item = Bone.get_global_history_item(url)
        item.num_used += 1
        item.last_used = Date.now()
        Bone.sort_global_history()
        Bone.save_local_storage()
        return false
    }
    
    let obj = {url:url, last_used:Date.now(), num_used:1}

    history.push(obj)
    Bone.sort_global_history()

    if(history.length > Bone.config.max_global_history_items)
    {
        Bone.storage.global_history = history.slice(0, Bone.config.max_global_history_items)
    }
    
    Bone.save_local_storage()
}

// Gets a global history item from a given url
Bone.get_global_history_item = function(url)
{
    for(let item of Bone.storage.global_history)
    {
        if(item.url === url)
        {
            return item
        }
    }

    return false
}

// Sorts global history by last used date
Bone.sort_global_history = function()
{
    Bone.storage.global_history.sort(function(a, b)
    {
        return b.last_used - a.last_used
    })
}

// Finds history urls that match a certain url or title
Bone.find_global_history_matches = function(search_term, max=false, title=false)
{
    search_term = search_term.trim()

    if(!search_term)
    {
        return []
    }

    let matches = []
    let found = 0

    for(let item of Bone.storage.global_history)
    {
        let gottem = false

        if(search_term.includes(item.url) || item.url.includes(search_term))
        {
            matches.push(item)
            found += 1
            gottem = true
        }

        if(!gottem)
        {
            if(title && item.title)
            {
                if(search_term.includes(item.title) || item.title.includes(search_term))
                {
                    matches.push(item)
                    found += 1
                    gottem = true
                }
            }
        }

        if(gottem)
        {
            if(max && found >= max)
            {
                break
            }
        }
    }

    return matches
}

// Updates a global history item with a favicon url
Bone.update_favicon = function(url, favicon_url)
{
    let urls = Bone.storage.global_history.map(obj => obj.url)

    if(urls.includes(url))
    {
        let item = Bone.get_global_history_item(url)
        item.favicon_url = favicon_url
        Bone.save_local_storage()
    }
}

// Updates a global history item with a page title
Bone.update_title = function(url, title)
{
    if(!url || !title)
    {
        return false
    }

    let urls = Bone.storage.global_history.map(obj => obj.url)

    if(urls.includes(url))
    {
        title = title.substring(0, 200)
        let item = Bone.get_global_history_item(url)
        item.title = title
        Bone.save_local_storage()
    }
}