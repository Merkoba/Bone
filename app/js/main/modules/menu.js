// Setup the menu window
Bone.setup_menu = function()
{
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
        Bone.show_create_preset()
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
        Bone.show_handle_close_space()
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

    Bone.$('#menu_wrap_on_webview_cycle_checkbox').addEventListener('change', function()
    {
        Bone.storage.wrap_on_webview_cycle = this.checked
        Bone.save_local_storage()
    })

    Bone.$('#menu_wrap_on_space_cycle_checkbox').addEventListener('change', function()
    {
        Bone.storage.wrap_on_space_cycle = this.checked
        Bone.save_local_storage()
    })

    Bone.$('#menu_create_layout').addEventListener('click', function()
    {
        Bone.show_create_layout()
    })

    Bone.$('#menu_startpage').addEventListener('blur', function()
    {
        Bone.storage.startpage = this.value.trim()
        Bone.save_local_storage()
    })

    Bone.$('#menu_searchpage').addEventListener('blur', function()
    {
        Bone.storage.searchpage = this.value.trim()
        Bone.save_local_storage()
    })

    Bone.update_menu_widgets()
}

// Updates widgest in the menu window
Bone.update_menu_widgets = function()
{
    Bone.$('#menu_theme_color_picker').value = Bone.storage.theme
    Bone.$('#menu_auto_hide_panel_checkbox').checked = Bone.storage.auto_hide_panel
    Bone.$('#menu_resize_handle_size_input').value = Bone.storage.resize_handle_size
    Bone.$('#menu_wrap_on_webview_cycle_checkbox').checked = Bone.storage.wrap_on_webview_cycle
    Bone.$('#menu_wrap_on_space_cycle_checkbox').checked = Bone.storage.wrap_on_space_cycle
    Bone.$('#menu_startpage').value = Bone.storage.startpage
    Bone.$('#menu_searchpage').value = Bone.storage.searchpage
}

// Shows the menu window
Bone.show_menu = function()
{
    Bone.msg_menu.show(function()
    {
        let disable_back = true

        if(Bone.focused())
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
    })
}