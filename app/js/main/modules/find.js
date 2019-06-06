// Setups the find widget
Bone.setup_find = function()
{
    let debounce_input = Bone.debounce(function(e)
    {
        Bone.find_forwards()
    }, 250)

    Bone.$('#find_input').addEventListener('input', debounce_input)

    Bone.$('#find_input').addEventListener('keydown', function(e)
    {
        if(e.key === 'Enter' || e.key === 'F3')
        {
            if(e.shiftKey)
            {
                Bone.find_backwards(true)
            }

            else
            {
                Bone.find_forwards(true)
            }
        }

        if(e.key === 'Escape')
        {
            Bone.close_find()
        }
    })

    Bone.$('#find_prev').addEventListener('click', function()
    {
        Bone.find_backwards()
    })
    
    Bone.$('#find_next').addEventListener('click', function()
    {
        Bone.find_forwards()
    })

    Bone.$('#find_close').addEventListener('click', function()
    {
        Bone.close_find()
    })
}

// Shows the find widget
Bone.show_find = function()
{
    if(Bone.find_on)
    {
        return false
    }

    Bone.$('#find_input').value = ''
    Bone.$('#find_num_results').textContent = '0/0'
    Bone.$('#find').style.top = `${Bone.config.panel_height + 5}px`
    Bone.$('#find').style.display = 'flex'
    Bone.$('#find_input').focus()
    Bone.find_webview = Bone.focused()
    Bone.find_on = true
}

// Hides the find widget
Bone.close_find = function()
{
    if(!Bone.find_on)
    {
        return false
    }

    Bone.find_webview.stopFindInPage('clearSelection')
    Bone.$('#find').style.display = 'none'
    Bone.find_webview = false
    Bone.find_on = false
}

// Updates the number of results in the find widget
Bone.update_find_results = function(result)
{   
    let s 

    if(result && result.activeMatchOrdinal && result.matches)
    {
        s = `${result.activeMatchOrdinal}/${result.matches}`
    }

    else
    {
        s = '0/0'
    }

    Bone.$('#find_num_results').textContent = s
}

// Does a forward find
Bone.find_forwards = function(find_next=false)
{
    let value = Bone.$('#find_input').value.trim()

    if(!value)
    {
        return false
    }

    Bone.focused().findInPage(value, {forward:true, findNext:find_next})
}

// Does a backward find
Bone.find_backwards = function(find_next=false)
{
    let value = Bone.$('#find_input').value.trim()

    if(!value)
    {
        return false
    }

    Bone.focused().findInPage(value, {forward:false, findNext:find_next})
}