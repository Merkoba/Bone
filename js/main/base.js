// Init main object and some properties

let Bone = {}

Bone.ls_name = 'boneless_v20'

Bone.layouts =
[
    'single', '2_column', '3_column', '4_column', '2_row', '3_row', '4_row',
    '1_top_2_bottom', '1_top_3_bottom', '2_top_1_bottom', '3_top_1_bottom',
    '2_top_2_bottom', '1_left_2_right', '1_left_3_right', '2_left_1_right', '3_left_1_right'
]

Bone.colorlib = ColorLib()

// This gets called when body loads
// First function that is called
Bone.init = function()
{
    Bone.setup_utils()
    Bone.get_local_storage()
    Bone.setup_templates()
    Bone.create_windows()
    Bone.setup_menu_window()
    Bone.update_menu_window_widgets()
    Bone.setup_top_panel()
    Bone.setup_create_preset()
    Bone.update_presets()
    Bone.apply_theme()
    Bone.setup_webviews()
    Bone.apply_layout(false)
    Bone.apply_size()

    Bone.$('#menu_icon').addEventListener('click', function()
    {
        Bone.msg_menu_window.show()
    })

    console.info('Boneless started')
}

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
    Bone.msg_menu_window = Msg.factory
    ({
        class: 'black'
    })

    Bone.msg_create_preset = Msg.factory
    ({
        class: 'black',
        after_close: function()
        {
            Bone.$('#create_preset_name').value = ''
        }
    })

    Bone.msg_menu_window.set(Bone.template_menu_window())
    Bone.msg_create_preset.set(Bone.template_create_preset())
}

// Create some utilities
Bone.setup_utils = function()
{
    Bone.$ = function(s)
    {
        return document.querySelector(s)
    }

    Bone.$$ = function(s)
    {
        return Array.from(document.querySelectorAll(s))
    }

    Bone.clone_object = function(obj)
    {
        return JSON.parse(JSON.stringify(obj))
    }

    Bone.round = function(value, decimals)
    {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
    }

    Bone.get_percentage = function(n1, n2)
    {
        return (n1 / n2) * 100
    }
}

// Setup the menu window
Bone.setup_menu_window = function()
{
    let squares = Bone.$$('.menu_window_layout_item')

    let layout_number = 0

    for(let square of squares)
    {
        let current_layout = Bone.layouts[layout_number]

        square.id = `layout_${current_layout}`

        if(current_layout === 'single')
        {
            current_layout = '2_column'
        }

        else if(current_layout === '2_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div></div><div></div>'
        }
        
        else if(current_layout === '2_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div></div><div></div>'
        }
        
        else if(current_layout === '1_top_2_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div></div><div class="layout_square_row"><div></div><div></div></div>'
        }

        else if(current_layout === '1_top_3_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div></div><div class="layout_square_row"><div></div><div></div><div></div></div>'
        }

        else if(current_layout === '2_top_1_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div class="layout_square_row"><div></div><div></div></div><div></div>'
        }

        else if(current_layout === '3_top_1_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div class="layout_square_row"><div></div><div></div><div></div></div><div></div>'
        }

        else if(current_layout === '3_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div></div><div></div><div></div>'
        }

        else if(current_layout === '4_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div></div><div></div><div></div><div></div>'
        }

        else if(current_layout === '3_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div></div><div></div><div></div>'
        }

        else if(current_layout === '4_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div></div><div></div><div></div><div></div>'
        }

        else if(current_layout === '2_top_2_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = '<div class="layout_square_row"><div></div><div></div></div><div class="layout_square_row"><div></div><div></div></div>'
        }

        else if(current_layout === "1_left_2_right")
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div></div><div class="layout_square_column"><div></div><div></div></div>'
        }

        else if(current_layout === "1_left_3_right")
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div></div><div class="layout_square_column"><div></div><div></div><div></div></div>'
        }

        else if(current_layout === "2_left_1_right")
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div class="layout_square_column"><div></div><div></div></div><div></div>'
        }

        else if(current_layout === "3_left_1_right")
        {
            square.classList.add('layout_row')
            square.innerHTML = '<div class="layout_square_column"><div></div><div></div><div></div></div><div></div>'
        }

        layout_number += 1
    }

    let layout_container = Bone.$('#menu_window_layout_container')

    layout_container.addEventListener('click', function(e)
    {
        let layout_item = e.target.closest('.menu_window_layout_item')

        if(!layout_item)
        {
            return false
        }

        let layout = layout_item.id.replace('layout_', '')
        Bone.storage.layout = layout
        Bone.save_local_storage()
        Bone.update_selected_layout()
        Bone.apply_layout()
    })

    let webview_controls = Bone.$('#menu_window_webview_controls')

    for(let i=1; i<=4; i++)
    {
        let h = Bone.template_webview_control({num:i})
        let el = document.createElement('div')
        el.innerHTML = h
        let wvc = el.querySelector('.menu_window_webview_control')
        let zoom = wvc.querySelector('.menu_window_zoom_controls')

        zoom.querySelector('.webview_control_icon_minus').addEventListener('click', function()
        {
            Bone.decrease_zoom_level(i)
        })

        zoom.querySelector('.webview_control_icon_plus').addEventListener('click', function()
        {
            Bone.increase_zoom_level(i)
        })

        zoom.querySelector('.webview_control_label').addEventListener('click', function()
        {
            Bone.reset_zoom_level(i)
        })

        let size = wvc.querySelector('.menu_window_size_controls')

        size.querySelector('.webview_control_icon_minus').addEventListener('click', function()
        {
            Bone.decrease_size(i)
        })

        size.querySelector('.webview_control_icon_plus').addEventListener('click', function()
        {
            Bone.increase_size(i)
        })

        size.querySelector('.webview_control_label').addEventListener('click', function()
        {
            Bone.reset_size(i)
        })

        webview_controls.appendChild(wvc)
    }

    let url_inputs = Bone.$$('.menu_window_url_input')

    for(let input of url_inputs)
    {
        let num = input.id.replace('menu_window_url_', '')

        input.addEventListener('blur', function()
        {
            let url = this.value.trim()

            if(Bone.storage[`webview_${num}`].url !== url)
            {
                Bone.storage[`webview_${num}`].url = url
                Bone.save_local_storage()
                Bone.apply_url(num)
            }
        })
    }

    Bone.$('#menu_window_theme_color_picker').addEventListener('change', function()
    {
        Bone.storage.theme = this.value
        Bone.save_local_storage()
        Bone.apply_theme()
    })
}

// Updates widgest in the menu window
Bone.update_menu_window_widgets = function()
{
    Bone.update_selected_layout()

    let url_inputs = Bone.$$('.menu_window_url_input')

    for(let input of url_inputs)
    {
        let num = input.id.replace('menu_window_url_', '')
        input.value = Bone.storage[`webview_${num}`].url
    }

    for(let i=1; i<=4; i++)
    {
        Bone.set_zoom_level_label(i)
        Bone.set_size_label(i)
    }
}

// Makes the current layout highlighted in the menu window
Bone.update_selected_layout = function()
{
    let selected_layouts = Bone.$$('.layout_selected')

    for(let item of selected_layouts)
    {
        item.classList.remove('layout_selected')
    }

    Bone.$(`#layout_${Bone.storage.layout}`).classList.add('layout_selected')
}

// Get the local storage data
Bone.get_local_storage = function()
{
    let obj
    let save = false

    if(localStorage[Bone.ls_name])
    {
        try
        {
            obj = JSON.parse(localStorage.getItem(Bone.ls_name))
        }

        catch(err)
        {
            localStorage.removeItem(Bone.ls_name)
            obj = null
        }
    }

    else
    {
        obj = 
        {
            layout: '2_column',
            theme: '#000000',
            presets: {},
            webview_1:
            {
                url: 'https://mastodon.social',
                zoom: 1,
                size: 1
            },
            webview_2:
            {
                url: 'https://www.dubtrack.fm/join/the-underground',
                zoom: 1,
                size: 1
            },
            webview_3:
            {
                url: 'http://lab.serotoninphobia.info/',
                zoom: 1,
                size: 1
            },
            webview_4:
            {
                url: 'https://arisuchan.jp/',
                zoom: 1,
                size: 1
            }
        }

        save = true
    }

    Bone.storage = obj

    if(save)
    {
        Bone.save_local_storage()
    }
}

// Save the local storage data
Bone.save_local_storage = function()
{
    localStorage.setItem(Bone.ls_name, JSON.stringify(Bone.storage))
}

// Create a webview from a template
Bone.create_webview = function(num)
{
    let h = Bone.template_webview({num:num})
    let el = document.createElement('div')
    el.innerHTML = h
    let wv = el.querySelector('webview')

    wv.addEventListener('dom-ready', function()
    {
        Bone.apply_zoom_level(num)
    })

    return wv
}

// Setup webviews
Bone.setup_webviews = function()
{
    let c = Bone.$('#webview_container')

    for(let i=1; i<=4; i++)
    {
        let wv = Bone.create_webview(i)
        c.appendChild(wv)
    }

    Bone.initial_webview_display = Bone.$('#webview_1').style.display
}

// Applies webview layout setup from current layout
Bone.apply_layout = function(reset_size=true)
{
    let layout = Bone.storage.layout
    let c = Bone.$('#webview_container')
    let w1 = Bone.$('#webview_1')
    let w2 = Bone.$('#webview_2')
    let w3 = Bone.$('#webview_3')
    let w4 = Bone.$('#webview_4')

    w1.style.width = 'initial'
    w2.style.width = 'initial'
    w3.style.width = 'initial'
    w4.style.width = 'initial'

    w1.style.height = 'initial'
    w2.style.height = 'initial'
    w3.style.height = 'initial'
    w4.style.height = 'initial'

    w1.style.display = Bone.initial_webview_display
    w2.style.display = Bone.initial_webview_display
    w3.style.display = Bone.initial_webview_display
    w4.style.display = Bone.initial_webview_display

    c.classList.remove('webview_container_row')
    c.classList.remove('webview_container_column')

    if(reset_size)
    {
        Bone.reset_size(1, false)
        Bone.reset_size(2, false)
        Bone.reset_size(3, false)
        Bone.reset_size(4, false)
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
        w1.style.width = '100%'
        Bone.remake_webview(3)
        Bone.remake_webview(4)
    }

    else if(layout === '3_column')
    {
        c.classList.add('webview_container_row')
        w1.style.width = '100%'
        w2.style.width = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '4_column')
    {
        c.classList.add('webview_container_row')
        w1.style.width = '100%'
        w2.style.width = '100%'
        w3.style.width = '100%'
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
        w1.style.width = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '1_top_3_bottom')
    {
        c.classList.add('webview_container_row')
        w1.style.width = '100%'
    }

    else if(layout === '2_top_1_bottom')
    {
        c.classList.add('webview_container_row')
        w1.style.width = '50%'
        w2.style.width = '50%'
        Bone.remake_webview(4)
    }

    else if(layout === '3_top_1_bottom')
    {
        c.classList.add('webview_container_row')
        w4.style.width = '100%'
    }

    else if(layout === '2_top_2_bottom')
    {
        c.classList.add('webview_container_row')
        w1.style.width = '50%'
        w2.style.width = '50%'
        w3.style.width = '50%'
        w4.style.width = '50%'
    }

    else if(layout === '1_left_2_right')
    {
        c.classList.add('webview_container_column')
        w1.style.height = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '1_left_3_right')
    {
        c.classList.add('webview_container_column')
        w1.style.height = '100%'
    }

    else if(layout === '2_left_1_right')
    {
        c.classList.add('webview_container_column')
        w3.style.height = '100%'
        Bone.remake_webview(4)
    }

    else if(layout === '3_left_1_right')
    {
        c.classList.add('webview_container_column')
        w4.style.height = '100%'
    }

    let webviews = Bone.$$('.webview')

    for(let webview of webviews)
    {
        Bone.apply_url(webview.id.replace('webview_', ''))
    }
}

// Changes a webview url
Bone.apply_url = function(num)
{
    let webview = Bone.$(`#webview_${num}`)

    if(webview.style.display === 'none')
    {
        return false
    }

    let url = Bone.storage[`webview_${num}`].url

    if(!url || webview.src === url)
    {
        return false
    }

    webview.src = url
}

// Replaces a webview with a new one
// This is to destroy its content
Bone.remake_webview = function(num, no_display=true)
{
    let wv = Bone.$(`#webview_${num}`)
    let rep = Bone.create_webview(num)

    if(no_display)
    {
        rep.style.display = 'none'
    }

    wv.parentNode.replaceChild(rep, wv)
}

// Applies zoom level to a loaded webview
Bone.apply_zoom_level = function(num)
{
    try
    {
        let webview = Bone.$(`#webview_${num}`)
        let zoom = Bone.storage[`webview_${num}`].zoom
        webview.setZoomLevel(zoom)
    }

    catch(err){}
}

// Sets the zoom level to a webview
Bone.set_zoom_level_label = function(num)
{
    let zoom = Bone.storage[`webview_${num}`].zoom
    Bone.$(`#webview_${num}_zoom_label`).textContent = `Zoom (${zoom})`
}

// Decreases a webview zoom level by 0.1
Bone.decrease_zoom_level = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom - 0.1, 1)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom_level(num)
    Bone.set_zoom_level_label(num)
    Bone.save_local_storage()
}

// Increases a webview zoom level by 0.1
Bone.increase_zoom_level = function(num)
{
    let zoom = Bone.round(Bone.storage[`webview_${num}`].zoom + 0.1, 1)
    Bone.storage[`webview_${num}`].zoom = zoom
    Bone.apply_zoom_level(num)
    Bone.set_zoom_level_label(num)
    Bone.save_local_storage()
}

// Resets a webview zoom level to 1
Bone.reset_zoom_level = function(num)
{
    Bone.storage[`webview_${num}`].zoom = 1
    Bone.apply_zoom_level(num)
    Bone.set_zoom_level_label(num)
    Bone.save_local_storage()
}

// Setups top panel
Bone.setup_top_panel = function()
{
    Bone.$('#menu_icon').addEventListener('auxclick', function(e)
    {
        if(e.which === 2)
        {
            let num = 0

            for(let i=0; i<Bone.layouts.length; i++)
            {
                let layout = Bone.layouts[i]

                if(layout === Bone.storage.layout)
                {
                    num = i
                    break
                }
            }

            let new_num = num + 1

            if(new_num > Bone.layouts.length - 1)
            {
                new_num = 0
            }

            Bone.storage.layout = Bone.layouts[new_num]
            Bone.save_local_storage()
            Bone.apply_layout()
        }
    })

    Bone.$('#menu_window_save_preset').addEventListener('click', function()
    {
        Bone.msg_create_preset.show(function()
        {
            Bone.$('#create_preset_name').focus()
        })
    })

    Bone.$('#menu_window_preset_container').addEventListener('click', function(e)
    {
        if(!e.target.classList.contains('menu_window_preset_item'))
        {
            return false
        }

        Bone.apply_preset(e.target.dataset.name)
    })

    Bone.$('#menu_window_preset_container').addEventListener('auxclick', function(e)
    {
        if(!e.target.classList.contains('menu_window_preset_item'))
        {
            return false
        }

        if(e.which === 2)
        {
            Bone.delete_preset(e.target.dataset.name)
            Bone.update_presets()
        }
    })
}

// Setups the create preset window
Bone.setup_create_preset = function()
{
    Bone.$('#create_preset_submit').addEventListener('click', function()
    {
        let name = Bone.$('#create_preset_name').value
        Bone.save_preset(name)
        Bone.update_presets()
        Bone.msg_create_preset.close()
    })

    Bone.$('#create_preset_name').addEventListener('keyup', function(e)
    {
        if(e.key === 'Enter')
        {
            Bone.save_preset(this.value)
            Bone.update_presets()
            Bone.msg_create_preset.close()
        }
    })
}

// Updates the presets container
Bone.update_presets = function()
{
    let c = Bone.$('#menu_window_preset_container')
    c.innerHTML = ''

    for(let name in Bone.storage.presets)
    {
        let el0 = document.createElement('div')
        let el = document.createElement('div')
        el.classList.add('menu_window_preset_item')
        el.classList.add('action')
        el.innerHTML = name
        el.dataset.name = name
        el.title = 'Middle Click To Delete'
        el0.append(el)
        c.prepend(el0)
    }
}

// Applies css styles based on current theme
Bone.apply_theme = function()
{
    let theme = Bone.storage.theme

    if(theme.startsWith('#'))
    {
        theme = Bone.colorlib.array_to_rgb(Bone.colorlib.hex_to_rgb(theme))
    }

    let bg_color_1 = theme
    let font_color_1 = Bone.colorlib.get_lighter_or_darker(bg_color_1, 0.8)
    let font_color_1_alpha = Bone.colorlib.rgb_to_rgba(font_color_1, 0.7)
    let bg_color_2 = Bone.colorlib.get_lighter_or_darker(bg_color_1, 0.1)
    let bg_color_3 = Bone.colorlib.get_lighter_or_darker(bg_color_1, 0.3)

    let css = `
    #top_panel
    {
        background-color: ${bg_color_1} !important;
        color: ${font_color_1} !important;
    }

    .Msg-overlay
    {
        background-color: ${font_color_1_alpha} !important;
    }

    .Msg-window
    {
        background-color: ${bg_color_1} !important;
        color: ${font_color_1} !important;
    }

    .Msg-window-inner-x:hover
    {
        background-color: ${bg_color_2} !important;
    }

    .menu_window_layout_item
    {
        background-color: ${bg_color_2} !important;
        box-shadow: 0 0 2px ${font_color_1} !important;
    }

    .menu_window_layout_item.layout_column > div, .menu_window_layout_item.layout_row > div,
    .layout_square_row > div, .layout_square_column > div
    {
        box-shadow: 0 0 2px ${font_color_1} !important;
    }

    .layout_selected
    {
        background-color: ${bg_color_3} !important;
    }

    .Msg-container ::-webkit-scrollbar-thumb
    {
        background-color: ${bg_color_3} !important;
    }
    `

    let styles = Bone.$$('.appended_theme_style')

    for(let style of styles)
    {
        style.parentNode.removeChild(style)
    }

    let style_el = document.createElement('style')
    style_el.classList.add('appended_theme_style')
    style_el.innerHTML = css

    document.head.appendChild(style_el)
}

// Saves a preset based on current state
Bone.save_preset = function(name)
{
    name = name.trim()
    let obj = Bone.clone_object(Bone.storage)
    obj.presets = undefined
    Bone.storage.presets[name] = obj
    Bone.save_local_storage()
}

// Changes settings to a specified preset
Bone.apply_preset = function(name)
{
    if(!Bone.storage.presets[name])
    {
        return false
    }

    let obj = Bone.clone_object(Bone.storage.presets[name])
    obj.presets = Bone.clone_object(Bone.storage.presets)
    Bone.storage = obj

    Bone.save_local_storage()
    Bone.update_menu_window_widgets()
    Bone.apply_layout(false)
    Bone.apply_theme()
    Bone.apply_size()
}

// Deletes a preset
Bone.delete_preset = function(name)
{
    delete Bone.storage.presets[name]
}

// Applies the configured sizes to the webviews
Bone.apply_size = function()
{
    let layout = Bone.storage.layout

    let w1 = Bone.$('#webview_1')
    let w2 = Bone.$('#webview_2')
    let w3 = Bone.$('#webview_3')
    let w4 = Bone.$('#webview_4')

    let s1 = Bone.storage.webview_1.size
    let s2 = Bone.storage.webview_2.size
    let s3 = Bone.storage.webview_3.size
    let s4 = Bone.storage.webview_4.size

    let c = Bone.$('#webview_container')
    let cheight = c.clientHeight
    let cwidth = c.clientWidth

    if(layout === 'single')
    {
        // Do nothing
    }

    else if(layout === '2_column')
    {
        let sum = s1 + s2
        w1.style.height = `${Bone.get_percentage(s1, sum)}%`
        w2.style.height = `${Bone.get_percentage(s2, sum)}%`
    }

    else if(layout === '3_column')
    {
        let sum = s1 + s2 + s3
        w1.style.height = `${Bone.get_percentage(s1, sum)}%`
        w2.style.height = `${Bone.get_percentage(s2, sum)}%`
        w3.style.height = `${Bone.get_percentage(s3, sum)}%`
    }

    else if(layout === '4_column')
    {
        let sum = s1 + s2 + s3 + s4
        w1.style.height = `${Bone.get_percentage(s1, sum)}%`
        w2.style.height = `${Bone.get_percentage(s2, sum)}%`
        w3.style.height = `${Bone.get_percentage(s3, sum)}%`
        w4.style.height = `${Bone.get_percentage(s4, sum)}%`
    }

    else if(layout === '2_row')
    {
        let sum = s1 + s2
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum)}%`
    }
    
    else if(layout === '3_row')
    {
        let sum = s1 + s2 + s3
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum)}%`
        w3.style.width = `${Bone.get_percentage(s3, sum)}%`
    }

    else if(layout === '4_row')
    {
        let sum = s1 + s2 + s3 + s4
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum)}%`
        w3.style.width = `${Bone.get_percentage(s3, sum)}%`
        w4.style.width = `${Bone.get_percentage(s4, sum)}%`
    }

    else if(layout === '1_top_2_bottom')
    {
        let sum = s1 + 1
        w1.style.height = `${Bone.get_percentage(s1, sum)}%`
        w2.style.height = `${Bone.get_percentage(1, sum)}%`
        w3.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s2 + s3
        w2.style.width = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.width = `${Bone.get_percentage(s3, sum_2)}%`
    }

    else if(layout === '1_top_3_bottom')
    {
        let sum = s1 + 1
        w1.style.height = `${Bone.get_percentage(s1, sum)}%`
        w2.style.height = `${Bone.get_percentage(1, sum)}%`
        w3.style.height = `${Bone.get_percentage(1, sum)}%`
        w4.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s2 + s3 + s4
        w2.style.width = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.width = `${Bone.get_percentage(s3, sum_2)}%`
        w4.style.width = `${Bone.get_percentage(s4, sum_2)}%`
    }

    else if(layout === '2_top_1_bottom')
    {
        let sum = s3 + 1
        w3.style.height = `${Bone.get_percentage(s3, sum)}%`
        w1.style.height = `${Bone.get_percentage(1, sum)}%`
        w2.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s1 + s2
        w1.style.width = `${Bone.get_percentage(s1, sum_2)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum_2)}%`
    }

    else if(layout === '3_top_1_bottom')
    {
        let sum = s4 + 1
        w4.style.height = `${Bone.get_percentage(s4, sum)}%`
        w1.style.height = `${Bone.get_percentage(1, sum)}%`
        w2.style.height = `${Bone.get_percentage(1, sum)}%`
        w3.style.height = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s1 + s2 + s3
        w1.style.width = `${Bone.get_percentage(s1, sum_2)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.width = `${Bone.get_percentage(s3, sum_2)}%`
    }

    else if(layout === '2_top_2_bottom')
    {
        let sum = s1 + s2
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(s2, sum)}%`

        let sum_2 = s3 + s4
        w3.style.width = `${Bone.get_percentage(s3, sum_2)}%`
        w4.style.width = `${Bone.get_percentage(s4, sum_2)}%`
    }

    else if(layout === '1_left_2_right')
    {
        let sum = s1 + 1
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(1, sum)}%`
        w3.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s2 + s3
        w2.style.height = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.height = `${Bone.get_percentage(s3, sum_2)}%`
    }

    else if(layout === '1_left_3_right')
    {
        let sum = s1 + 1
        w1.style.width = `${Bone.get_percentage(s1, sum)}%`
        w2.style.width = `${Bone.get_percentage(1, sum)}%`
        w3.style.width = `${Bone.get_percentage(1, sum)}%`
        w4.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s2 + s3 + s4
        w2.style.height = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.height = `${Bone.get_percentage(s3, sum_2)}%`
        w4.style.height = `${Bone.get_percentage(s4, sum_2)}%`
    }

    else if(layout === '2_left_1_right')
    {
        let sum = s3 + 1
        w3.style.width = `${Bone.get_percentage(s3, sum)}%`
        w1.style.width = `${Bone.get_percentage(1, sum)}%`
        w2.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s1 + s2
        w1.style.height = `${Bone.get_percentage(s1, sum_2)}%`
        w2.style.height = `${Bone.get_percentage(s2, sum_2)}%`
    }

    else if(layout === '3_left_1_right')
    {
        let sum = s4 + 1
        w4.style.width = `${Bone.get_percentage(s4, sum)}%`
        w1.style.width = `${Bone.get_percentage(1, sum)}%`
        w2.style.width = `${Bone.get_percentage(1, sum)}%`
        w3.style.width = `${Bone.get_percentage(1, sum)}%`

        let sum_2 = s1 + s2 + s3
        w1.style.height = `${Bone.get_percentage(s1, sum_2)}%`
        w2.style.height = `${Bone.get_percentage(s2, sum_2)}%`
        w3.style.height = `${Bone.get_percentage(s3, sum_2)}%`
    }
}

// Sets the size to a webview
Bone.set_size_label = function(num)
{
    let size = Bone.storage[`webview_${num}`].size
    Bone.$(`#webview_${num}_size_label`).textContent = `Size (${size})`
}

// Decreases a webview size by 0.1
Bone.decrease_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size - 0.1, 1)

    if(size <= 0)
    {
        return false
    }

    Bone.storage[`webview_${num}`].size = size
    Bone.apply_size(num)
    Bone.set_size_label(num)
    Bone.save_local_storage()
}

// Increases a webview size by 0.1
Bone.increase_size = function(num)
{
    let size = Bone.round(Bone.storage[`webview_${num}`].size + 0.1, 1)
    Bone.storage[`webview_${num}`].size = size
    Bone.apply_size(num)
    Bone.set_size_label(num)
    Bone.save_local_storage()
}

// Resets a webview size to 1
Bone.reset_size = function(num, apply=true)
{
    Bone.storage[`webview_${num}`].size = 1
    Bone.set_size_label(num)
    Bone.save_local_storage()

    if(apply)
    {
        Bone.apply_size(num)
    }
    
}