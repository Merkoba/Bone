// Setups global history
Bone.setup_global_history = function()
{
    Bone.sort_global_history()
}

// Adds a url to the history
// This is used to show url suggestions in the url bar
Bone.add_url_to_global_history = function(url)
{
    url = url.trim()

    if(url.length > Bone.config.global_history_url_max_length)
    {
        return false
    }

    let urls = Bone.storage.global_history.map(obj => obj.url)

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

    Bone.storage.global_history.unshift(obj)
    Bone.sort_global_history()

    if(Bone.storage.global_history.length > Bone.config.max_global_history_items)
    {
        Bone.storage.global_history = Bone.storage.global_history.slice(0, Bone.config.max_global_history_items)
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

// Finds history urls that match a certain url
Bone.find_global_history_matches = function(url, max=false)
{
    url = url.trim()

    if(!url)
    {
        return []
    }

    let matches = []
    let found = 0

    for(let item of Bone.storage.global_history)
    {
        if(url.includes(item.url) || item.url.includes(url))
        {
            matches.push(item.url)
            found += 1

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