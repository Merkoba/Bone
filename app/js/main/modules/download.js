Bone.download = function(url, dest) 
{
    return new Promise((resolve, reject) => 
    {
        let http_module

        if(url.startsWith('http:'))
        {
            http_module = http
        }

        else if(url.startsWith('https:'))
        {
            http_module = https
        }

        else
        {
            reject('Not a valid URL')
        }

        const file = fs.createWriteStream(dest, {flags: 'w'})

        const request = http_module.get(url, response => 
        {
            if(response.statusCode === 200) 
            {
                response.pipe(file)
            } 
            
            else 
            {
                file.close()
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`)
            }
        })

        request.on('error', err => 
        {
            file.close()
            reject(err.message)
        })

        file.on('finish', () => 
        {
            resolve()
        })

        file.on('error', err => 
        {
            file.close()
            reject(err.message)
        })
    })
}

// Starts a download
Bone.start_download = function(args={})
{
    let location = path.dirname(args.filename)
    Bone.push_to_download_locations(location)

    let open_function = function()
    {
        shell.showItemInFolder(args.filename)
    }

    Bone.download(args.url, args.filename)

    .then(res =>
    {
        if(args.type === 'image')
        {
            Bone.show_info_popup('Image Downloaded', 'download', open_function)
        }
        
        else if(args.type === 'video')
        {
            Bone.show_info_popup('Video Downloaded', 'download', open_function)
        }
    })

    .catch(err =>
    {
        Bone.show_info_popup('Error downloading file', 'error')
    })
}

// Pushes a directory path to download locations
Bone.push_to_download_locations = function(path)
{
    let locations = Bone.storage.download_locations

    if(path.length > 1 && path.endsWith('/'))
    {
        path = path.substring(0, path.length - 1)
    }

    for(let i=0; i<locations.length; i++)
    {
        let path_2 = locations[i]

        if(path === path_2)
        {
            locations.splice(i, 1)
            break
        }
    }

    locations.push(path)
    
    if(locations.length > Bone.config.max_download_locations)
    {
        locations = locations.slice(0 - Bone.config.max_download_locations)
    }

    Bone.save_local_storage()
}

// Shows the save as dialog
Bone.show_save_as_dialog = function()
{
    let url = Bone.handle_download_args.url
    let type = Bone.handle_download_args.type
    let title

    if(type === 'image')
    {
        title = 'Save Image File'
    }

    else if(type === 'video')
    {
        title = 'Save Video File'
    }

    dialog.showSaveDialog(remote.getCurrentWindow(),
    {
        title: title,
        defaultPath: url.split('/').slice(-1)[0]
    }, 
    function(filename)
    {
        Bone.start_download({url:url, filename:filename, type:type})
    })
}

// Setups the handle download window
Bone.setup_handle_download = function()
{
    Bone.$('#handle_download_save_as').addEventListener('click', function(e)
    {
        Bone.show_save_as_dialog()
        Bone.msg_handle_download.close()
    })

    Bone.$('#handle_download_locations').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('handle_download_locations_item'))
        {
            return false
        }

        
        let url = Bone.handle_download_args.url
        let type = Bone.handle_download_args.type
        let path = e.target.dataset.path
        let filename = `${path}/${url.split('/').slice(-1)[0]}`
        Bone.start_download({url:url, filename:filename, type:type})
        Bone.msg_handle_download.close()
    })
}

// Shows the handle download window
Bone.show_handle_download = function(args={})
{
    Bone.handle_download_args = args

    let dl = Bone.$('#handle_download_locations')
    
    if(Bone.storage.download_locations.length > 0)
    {
        dl.innerHTML = ''
        
        for(let path of Bone.storage.download_locations)
        {
            let el = document.createElement('div')
            el.classList.add('handle_download_locations_item')
            el.classList.add('action')
            el.textContent = `Save in: ${path}`
            el.dataset.path = path
            dl.prepend(el)
        }

        Bone.msg_handle_download.show()
    }
    
    else
    {
        Bone.show_save_as_dialog()
    } 
}