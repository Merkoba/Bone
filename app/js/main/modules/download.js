// Downloads a file manually
Bone.download = function(url, destination) 
{
    let obj = {}
    obj.bypass_save_dialog_url = url
    obj.bypass_save_dialog_destination = destination
    obj.bypass_save_dialog_date = Date.now()
    ipcRenderer.sendSync('download-options-update', obj)
    remote.getCurrentWindow().webContents.downloadURL(url)
}

// React to a download start message from the main process
Bone.on_download_start = function(args)
{
    let popup = Bone.show_info_popup('File Downloading', false, false, false, args.id)
    popup.last_set_update = 0
    Bone.info_popups[args.id] = popup
}

// React to a download update message from the main process
Bone.on_download_update = function(args)
{
    try
    {
        let popup = Bone.info_popups[args.id]

        if(!popup)
        {
            return false
        }

        if(Date.now() - popup.last_set_update < 1000)
        {
            return false
        }
        
        let onclick = function()
        {
            ipcRenderer.send('cancel-download', {id:args.id})
        }
        
        let percentage = Math.round(((args.received_bytes / args.total_bytes) * 100), 1)
        popup.set(Bone.create_info_popup_item(`File Downloading: ${percentage}%`, 'download', onclick, 'Click to cancel download'))
        popup.last_set_update = Date.now()
    }

    catch(err){}
}

// React to a download done message from the main process
Bone.on_download_done = function(args)
{
    let popup = Bone.info_popups[args.id]

    if(!popup)
    {
        return false
    }

    if(args.state === 'completed') 
    { 
        let onclick = function()
        {
            shell.showItemInFolder(args.destination)
        }

        popup.set(Bone.create_info_popup_item('Download Successful', false, onclick))
    }
            
    else if(args.state === 'cancelled')
    {
        popup.set(`Download Cancelled`)
    }
            
    else 
    {
        popup.set(`Download Failed`)
    }

    setTimeout(function()
    {
        popup.close()
    }, 5000)
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
        Bone.download(url, filename)
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
        let path = e.target.dataset.path
        let filename = `${path}/${url.split('/').slice(-1)[0]}`
        Bone.download(url, filename)
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