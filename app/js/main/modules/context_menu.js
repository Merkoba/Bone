// Setups the context menu widget
Bone.setup_context_menu = function()
{
    let cm = Bone.$('#context_menu')

    cm.addEventListener('blur', function()
    {
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_copy').addEventListener('click', function()
    {
        Bone.clipboard_write(Bone.context_menu_event.params.selectionText)
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_paste').addEventListener('click', function()
    {
        let text = Bone.clipboard_read()
        Bone.context_menu_event.target.insertText(text)
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_copy_link_url').addEventListener('click', function()
    {
        Bone.clipboard_write(Bone.context_menu_event.params.linkURL)
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_copy_image_url').addEventListener('click', function()
    {
        Bone.clipboard_write(Bone.context_menu_event.params.srcURL)
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_download_image').addEventListener('click', function()
    {
        let url = Bone.context_menu_event.params.srcURL

        dialog.showSaveDialog(remote.getCurrentWindow(),
        {
            title: 'Download Image File',
            defaultPath: url.split('/').slice(-1)[0]
        }, function(filename)
        {
            Bone.start_download({url:url, filename:filename, type:'image'})
        })

        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_copy_video_url').addEventListener('click', function()
    {
        Bone.clipboard_write(Bone.context_menu_event.params.srcURL)
        Bone.hide_context_menu()
    })

    Bone.$('#context_menu_download_video').addEventListener('click', function()
    {
        let url = Bone.context_menu_event.params.srcURL

        dialog.showSaveDialog(remote.getCurrentWindow(),
        {
            title: 'Download Video File',
            defaultPath: url.split('/').slice(-1)[0]
        }, function(filename)
        {
            Bone.download(url, filename)

            .then(res =>
            {
                Bone.start_download({url:url, filename:filename, type:'video'})
            })
        })

        Bone.hide_context_menu()
    })
}

// Handles a context menu trigger
Bone.handle_context_menu = function(e)
{
    let cm = Bone.$('#context_menu')
    let p = e.params

    Bone.$('#context_menu_copy').style.display = p.selectionText ? 'block' : 'none'
    Bone.$('#context_menu_paste').style.display = p.isEditable ? 'block' : 'none'
    Bone.$('#context_menu_copy_link_url').style.display = p.linkURL ? 'block' : 'none'
    Bone.$('#context_menu_copy_image_url').style.display = (p.mediaType === 'image' && p.srcURL) ? 'block' : 'none'
    Bone.$('#context_menu_download_image').style.display = (p.mediaType === 'image' && p.srcURL) ? 'block' : 'none'
    Bone.$('#context_menu_copy_video_url').style.display = (p.mediaType === 'video' && p.srcURL) ? 'block' : 'none'
    Bone.$('#context_menu_download_video').style.display = (p.mediaType === 'video' && p.srcURL) ? 'block' : 'none'

    Bone.context_menu_event = e
    Bone.show_context_menu()

    let window_height = Bone.$('#main_container').clientHeight
    let window_width = Bone.$('#main_container').clientWidth

    let y = e.params.y
    let x = e.params.x

    if(y + cm.clientHeight + 10 > window_height)
    {
        y = window_height - cm.clientHeight - 10
    }

    if(x + cm.clientWidth + 10 > window_width)
    {
        x = window_width - cm.clientWidth - 10
    }

    cm.style.top = `${y}px`
    cm.style.left = `${x}px`
}

// Shows the context menu
Bone.show_context_menu = function()
{
    let cm = Bone.$('#context_menu')
    cm.style.display = 'grid'
    cm.focus()
}

// Hides the context menu
Bone.hide_context_menu = function()
{
    let cm = Bone.$('#context_menu')
    cm.style.display = 'none'
}