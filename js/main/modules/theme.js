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
    let bg_color_4 = Bone.colorlib.get_lighter_or_darker(bg_color_1, 0.2)

    let css = `
    #panel
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

    .Msg-window-inner-x
    {
        background-color: ${bg_color_1} !important;
        color: ${font_color_1};
    }

    .titlebar_inner_x
    {
        background-color: ${bg_color_2} !important;
        color: ${font_color_1};
    }

    .Msg-window-inner-x:hover, .titlebar_inner_x:hover
    {
        background-color: ${bg_color_4} !important;
        color: ${font_color_1};
    }

    .custom_titlebar
    {
        background-color: ${bg_color_2} !important;
        color: ${font_color_1} !important;
    }

    .menu_layout_item
    {
        background-color: ${bg_color_2} !important;
        box-shadow: 0 0 1px ${font_color_1} !important;
        color: ${font_color_1} !important;
    }

    .menu_layout_item:not(.menu_layout_item_2):hover
    {
        box-shadow: 0 0 5px ${font_color_1} !important;
    }

    .menu_layout_item.layout_column > div, .menu_layout_item.layout_row > div,
    .layout_square_row > div, .layout_square_column > div
    {
        box-shadow: 0 0 1px ${font_color_1} !important;
    }

    .menu_layout_item_2 .layout_square_item:hover
    {
        background-color: ${bg_color_4} !important;
    }

    .layout_selected
    {
        background-color: ${bg_color_3} !important;
    }

    .Msg-container ::-webkit-scrollbar-thumb
    {
        background-color: ${bg_color_3} !important;
    }

    .resize_handle
    {
        background-color: ${bg_color_1} !important;
    }

    #url
    {
        background-color: ${bg_color_2} !important;
        color: ${font_color_1} !important;
        border: 5px solid ${bg_color_1} !important;
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