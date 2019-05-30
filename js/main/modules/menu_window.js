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
            square.innerHTML = `<div class='layout_square_item'>1</div>`
        }

        else if(current_layout === '2_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div>`
        }
        
        else if(current_layout === '2_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div>`
        }
        
        else if(current_layout === '1_top_2_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_row'><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div></div>`
        }

        else if(current_layout === '1_top_3_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_row'><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div><div class='layout_square_item'>4</div></div>`
        }

        else if(current_layout === '2_top_1_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_row'><div class='layout_square_item'>1</div><div class='layout_square_item'>2</div></div><div class='layout_square_item'>3</div>`
        }

        else if(current_layout === '3_top_1_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_row'><div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div></div><div class='layout_square_item'>4</div>`
        }

        else if(current_layout === '3_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div>`
        }

        else if(current_layout === '4_row')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div><div class='layout_square_item'>4</div>`
        }

        else if(current_layout === '3_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div>`
        }

        else if(current_layout === '4_column')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div><div class='layout_square_item'>4</div>`
        }

        else if(current_layout === '2_top_2_bottom')
        {
            square.classList.add('layout_column')
            square.innerHTML = `<div class='layout_square_row'><div class='layout_square_item'>1</div><div class='layout_square_item'>2</div></div><div class='layout_square_row'><div class='layout_square_item'>3</div><div class='layout_square_item'>4</div></div>`
        }

        else if(current_layout === '1_left_2_right')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_column'><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div></div>`
        }

        else if(current_layout === '1_left_3_right')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_item'>1</div><div class='layout_square_column'><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div><div class='layout_square_item'>4</div></div>`
        }

        else if(current_layout === '2_left_1_right')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_column'><div class='layout_square_item'>1</div><div class='layout_square_item'>2</div></div><div class='layout_square_item'>3</div>`
        }

        else if(current_layout === '3_left_1_right')
        {
            square.classList.add('layout_row')
            square.innerHTML = `<div class='layout_square_column'><div class='layout_square_item'>1</div><div class='layout_square_item'>2</div><div class='layout_square_item'>3</div></div><div class='layout_square_item'>4</div>`
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

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        let h = Bone.template_webview_control({num:i})
        let el = document.createElement('div')
        el.innerHTML = h
        let wvc = el.querySelector('.menu_window_webview_control')
        let zoom = wvc.querySelector('.menu_window_zoom_controls')

        zoom.querySelector('.webview_control_icon_minus').addEventListener('click', function()
        {
            Bone.decrease_zoom_factor(i)
        })

        zoom.querySelector('.webview_control_icon_plus').addEventListener('click', function()
        {
            Bone.increase_zoom_factor(i)
        })

        zoom.querySelector('.webview_control_label').addEventListener('click', function()
        {
            Bone.reset_zoom_factor(i)
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

        let action = wvc.querySelector('.menu_window_action_controls')

        action.querySelector('.webview_refresh').addEventListener('click', function()
        {
            Bone.refresh_webview(i)
        })

        action.querySelector('.webview_swap').addEventListener('click', function()
        {
            Bone.swap_webview(i)
        })

        webview_controls.appendChild(wvc)
    }

    let url_inputs = Bone.$$('.menu_window_url_input')

    for(let input of url_inputs)
    {
        let num = input.id.replace('menu_window_url_', '')

        input.addEventListener('blur', function()
        {
            Bone.do_url_change(this.value, num)
        })

        input.addEventListener('keyup', function(e)
        {
            if(e.key === 'Enter')
            {
                Bone.do_url_change(this.value, num)
            }
        })
    }

    Bone.$('#menu_window_theme_color_picker').addEventListener('change', function()
    {
        Bone.storage.theme = this.value
        Bone.save_local_storage()
        Bone.apply_theme()
    })

    Bone.$('#menu_window_back').addEventListener('click', function()
    {
        if(Bone.focused_webview)
        {
            let history = Bone.history[Bone.focused_webview.id]
            let num = Bone.focused_webview.id.replace('webview_', '')

            if(history && history.length > 1)
            {
                history.pop()
                Bone.remake_webview(num, history.slice(-1)[0], false, false)
            }
        }
    })

    Bone.$('#menu_window_history').addEventListener('click', function()
    {
        if(Bone.focused_webview)
        {
            Bone.show_history(Bone.focused_webview.id.replace('webview_', ''))
        }
    })

    Bone.$('#menu_window_save_preset').addEventListener('click', function()
    {
        Bone.msg_create_preset.show(function()
        {
            Bone.$('#create_preset_name').focus()
        })
    })

    Bone.$('#menu_window_presets_select').addEventListener('change', function(e)
    {
        let selected = this.options[this.selectedIndex]

        if(!selected.value)
        {
            return false
        }

        Bone.msg_handle_preset.show(function()
        {
            Bone.show_handle_preset(selected.value)
        })

        this.selectedIndex = 0
    })

    Bone.$('#menu_window_auto_hide_top_panel_checkbox').addEventListener('change', function()
    {
        Bone.storage.auto_hide_top_panel = this.checked
        Bone.save_local_storage()
        Bone.apply_auto_hide_top_panel()
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

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        Bone.set_zoom_factor_label(i)
        Bone.set_size_label(i)
    }

    Bone.$('#menu_window_theme_color_picker').value = Bone.storage.theme
    Bone.$('#menu_window_auto_hide_top_panel_checkbox').checked = Bone.storage.auto_hide_top_panel
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

// Handles url changes in the interface
Bone.do_url_change = function(url, num)
{
    url = url.trim()

    if(Bone.storage[`webview_${num}`].url !== url)
    {
        Bone.storage[`webview_${num}`].url = url
        Bone.save_local_storage()
        Bone.apply_url(num)
    }
}

// Shows the menu window
Bone.show_menu_window = function()
{
    Bone.msg_menu_window.show(function()
    {
        let disable_back = true

        if(Bone.focused_webview)
        {
            let history = Bone.history[Bone.focused_webview.id]

            if(history && history.length > 1)
            {
                Bone.$('#menu_window_back').classList.remove('disabled')
                disable_back = false
            }
        }

        if(disable_back)
        {
            Bone.$('#menu_window_back').classList.add('disabled')
        }
    })
}