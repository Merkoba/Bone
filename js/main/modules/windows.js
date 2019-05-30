// Compile all Handlebars templates
Bone.setup_templates = function()
{
    let templates = Bone.$$('.template')

    for(let template of templates)
    {
        Bone[template.id] = Handlebars.compile(Bone.$(`#${template.id}`).innerHTML)
    }
}

// Create Msg modal windows
Bone.create_windows = function()
{
    let common =
    {
        show_effect: 'none',
        close_effect: 'none'
    }

    Bone.msg_menu_window = Msg.factory(Object.assign({}, common, 
    {
        id: 'menu_window'
    }))

    Bone.msg_create_preset = Msg.factory(Object.assign({}, common, 
    {
        id: 'create_preset',
        after_close: function()
        {
            Bone.$('#create_preset_name').value = ''
        }
    }))

    Bone.msg_handle_preset = Msg.factory(Object.assign({}, common,
    {
        id: 'handle_preset',
        after_close: function()
        {
            Bone.$('#handle_preset_name').value = ''
        }
    }))

    Bone.msg_swap_webviews = Msg.factory(Object.assign({}, common,
    {
        id: 'swap_webviews'
    }))

    Bone.msg_info = Msg.factory(Object.assign({}, common,
    {
        id: 'info'
    }))

    Bone.msg_history = Msg.factory(Object.assign({}, common,
    {
        id: 'history'
    }))

    Bone.msg_menu_window.set(Bone.template_menu_window())
    Bone.msg_create_preset.set(Bone.template_create_preset())
    Bone.msg_handle_preset.set(Bone.template_handle_preset())
    Bone.msg_swap_webviews.set(Bone.template_swap_webviews())
    Bone.msg_info.set(Bone.template_info())
    Bone.msg_history.set(Bone.template_history())
}

// Closes all modal windows
Bone.close_all_windows = function()
{
    Bone.msg_menu_window.close_all()
}

// Setups the info window
Bone.setup_info = function()
{
    Bone.$('#info_container').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.msg_info.close()
        }
    })
}

// Shows a message in the info window
Bone.info = function(message)
{
    let c = Bone.$('#info_container')
    c.textContent = message

    Bone.msg_info.show(function()
    {
        c.focus()
    })    
}