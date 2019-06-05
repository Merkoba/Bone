// Setups the find widget
Bone.setup_find = function()
{
    Bone.$('#find_input').addEventListener('input', function(e)
    {

    })

    Bone.$('#find_prev').addEventListener('click', function()
    {
        
    })

    Bone.$('#find_next').addEventListener('click', function()
    {

    })

    Bone.$('#find_close').addEventListener('click', function()
    {
        Bone.hide_find()
    })
}

// Shows the find widget
Bone.show_find = function()
{
    Bone.$('#find').style.top = `${Bone.config.panel_height + 5}px`
    Bone.$('#find').style.display = 'flex'
    Bone.find_on = true
}

// Hides the find widget
Bone.hide_find = function()
{
    Bone.$('#find').style.display = 'none'
    Bone.find_on = false
}