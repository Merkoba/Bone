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

    .finally(() =>
    {

    })
}