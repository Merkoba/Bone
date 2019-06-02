// Setup the menu window
Bone.setup_menu = function()
{
    let squares = Bone.$$('.menu_layout_item')
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

    let layout_container = Bone.$('#menu_layout_container')

    layout_container.addEventListener('click', function(e)
    {
        let layout_item = e.target.closest('.menu_layout_item')

        if(!layout_item)
        {
            return false
        }

        let layout = layout_item.id.replace('layout_', '')
        Bone.space().layout = layout
        Bone.save_local_storage()
        Bone.update_selected_layout()
        Bone.msg_menu.close()
        Bone.apply_layout()
    })

    let webview_controls = Bone.$('#menu_webview_controls')

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        let h = Bone.template_webview_control({num:i})
        let el = document.createElement('div')
        el.innerHTML = h
        let wvc = el.querySelector('.menu_webview_control')
        let zoom = wvc.querySelector('.menu_zoom_controls')

        zoom.querySelector('.webview_control_icon_minus').addEventListener('click', function()
        {
            Bone.decrease_zoom(i)
        })

        zoom.querySelector('.webview_control_icon_plus').addEventListener('click', function()
        {
            Bone.increase_zoom(i)
        })

        zoom.querySelector('.webview_control_label').addEventListener('click', function()
        {
            Bone.reset_zoom(i)
        })

        zoom.querySelector('.webview_control_icon_minus').addEventListener('auxclick', function(e)
        {
            if(e.which === 2)
            {
                Bone.decrease_zoom(i, 'double')
            }
        })

        zoom.querySelector('.webview_control_icon_plus').addEventListener('auxclick', function(e)
        {
            if(e.which === 2)
            {
                Bone.increase_zoom(i, 'double')
            }
        })

        let size = wvc.querySelector('.menu_size_controls')

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

        size.querySelector('.webview_control_icon_minus').addEventListener('auxclick', function(e)
        {
            if(e.which === 2)
            {
                Bone.decrease_size(i, 'double')
            }
        })

        size.querySelector('.webview_control_icon_plus').addEventListener('auxclick', function(e)
        {
            if(e.which === 2)
            {
                Bone.increase_size(i, 'double')
            }
        })

        let action = wvc.querySelector('.menu_action_controls')

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

    let url_inputs = Bone.$$('.menu_url_input')

    for(let input of url_inputs)
    {
        let num = input.id.replace('menu_url_', '')

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

    Bone.$('#menu_theme_color_picker').addEventListener('change', function()
    {
        Bone.storage.theme = this.value
        Bone.save_local_storage()
        Bone.apply_theme()
    })

    Bone.$('#menu_back').addEventListener('click', function()
    {
        Bone.go_back()
    })

    Bone.$('#menu_history').addEventListener('click', function()
    {
        let space = Bone.space()

        if(space.focused_webview)
        {
            Bone.show_history()
        }
    })

    Bone.$('#menu_copy_url').addEventListener('click', function()
    {
        let url = Bone.get_current_url()

        if(url)
        {
            Bone.copy_string(url)
            Bone.info('URL copied to clipboard')
        }
    })

    Bone.$('#menu_autostart').addEventListener('click', function()
    {
        Bone.show_autostart_presets()
    })

    Bone.$('#menu_save_preset').addEventListener('click', function()
    {
        Bone.msg_create_preset.show(function()
        {
            Bone.$('#create_preset_name').focus()
        })
    })

    Bone.$('#menu_clear_presets').addEventListener('click', function()
    {
        Bone.clear_presets()
    })

    Bone.$('#menu_presets_select').addEventListener('change', function(e)
    {
        let selected = this.options[this.selectedIndex]

        if(!selected.value)
        {
            return false
        }

        Bone.show_handle_preset(selected.value)

        this.selectedIndex = 0
    })

    Bone.$('#menu_auto_hide_panel_checkbox').addEventListener('change', function()
    {
        Bone.storage.auto_hide_panel = this.checked
        Bone.save_local_storage()
        Bone.apply_auto_hide_panel()
    })

    Bone.$('#menu_resize_handle_size_input').addEventListener('blur', function()
    {
        Bone.storage.resize_handle_size = this.value
        Bone.save_local_storage()
        Bone.update_resize_handle_style()
        Bone.apply_layout(false)
    })

    Bone.$('#menu_reset').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to reset the settings? This will not delete saved presets.'))
        {
            Bone.reset_storage()
        }
    })

    Bone.$('#menu_exit').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to exit?'))
        {
            Bone.exit()
        }
    })

    Bone.$('#menu_close_space').addEventListener('click', function()
    {
        if(confirm('Are you sure you want to close this space?'))
        {
            Bone.close_space()
            Bone.close_all_windows()
        }
    })

    Bone.$('#menu_duplicate_space').addEventListener('click', function()
    {
        Bone.duplicate_space()
    })

    Bone.$('#menu_new_space').addEventListener('click', function()
    {
        Bone.new_space()
        Bone.close_all_windows()
    })

    Bone.$('#menu_cycle_spaces_on_wheel_checkbox').addEventListener('change', function()
    {
        Bone.storage.cycle_spaces_on_wheel = this.checked
        Bone.update_wrap_spaces_on_wheel_container()
        Bone.save_local_storage()
    })

    Bone.$('#menu_wrap_spaces_on_wheel_checkbox').addEventListener('change', function()
    {
        Bone.storage.wrap_spaces_on_wheel = this.checked
        Bone.save_local_storage()
    })

    Bone.$('#menu_show_menu_on_panel_click_checkbox').addEventListener('change', function()
    {
        Bone.storage.show_menu_on_panel_click = this.checked
        Bone.save_local_storage()
    })
}

// Updates widgest in the menu window
Bone.update_menu_widgets = function()
{
    Bone.update_selected_layout()

    let url_inputs = Bone.$$('.menu_url_input')

    for(let input of url_inputs)
    {
        let num = input.id.replace('menu_url_', '')
        input.value = Bone.swv(num).url
    }

    for(let i=1; i<=Bone.config.num_webviews; i++)
    {
        Bone.set_size_label(i)
        Bone.set_zoom_label(i)
    }

    Bone.$('#menu_theme_color_picker').value = Bone.storage.theme
    Bone.$('#menu_auto_hide_panel_checkbox').checked = Bone.storage.auto_hide_panel
    Bone.$('#menu_resize_handle_size_input').value = Bone.storage.resize_handle_size
    Bone.$('#menu_cycle_spaces_on_wheel_checkbox').checked = Bone.storage.cycle_spaces_on_wheel
    Bone.$('#menu_wrap_spaces_on_wheel_checkbox').checked = Bone.storage.wrap_spaces_on_wheel
    Bone.$('#menu_show_menu_on_panel_click_checkbox').checked = Bone.storage.show_menu_on_panel_click

    Bone.update_wrap_spaces_on_wheel_container()
}

// Updates the wheel wrapping of spaces on menu window
Bone.update_wrap_spaces_on_wheel_container = function()
{
    if(Bone.storage.cycle_spaces_on_wheel)
    {
        Bone.$('#menu_wrap_spaces_on_wheel_container').style.display = 'block'
    }
    
    else
    {
        Bone.$('#menu_wrap_spaces_on_wheel_container').style.display = 'none'
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

    Bone.$(`#layout_${Bone.space().layout}`).classList.add('layout_selected')
}

// Handles url changes in the interface
Bone.do_url_change = function(url, num)
{
    url = url.trim()
    let swv = Bone.swv(num)

    if(swv.url !== url)
    {
        swv.url = url
        Bone.space_modified()
        Bone.spacesi
        Bone.save_local_storage()
        Bone.apply_url(num)
    }
}

// Shows the menu window
Bone.show_menu = function()
{
    Bone.msg_menu.show(function()
    {
        let disable_back = true

        if(Bone.space().focused_webview)
        {
            let history = Bone.history()

            if(history && history.length > 1)
            {
                Bone.$('#menu_back').classList.remove('disabled')
                disable_back = false
            }
        }

        if(disable_back)
        {
            Bone.$('#menu_back').classList.add('disabled')
        }

        if(Bone.get_spaces().length > 1)
        {
            Bone.$('#menu_close_space').classList.remove('disabled')
        }
        
        else
        {
            Bone.$('#menu_close_space').classList.add('disabled')
        }
    })
}