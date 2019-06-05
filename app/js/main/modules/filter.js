// Activates filter actions for generic filter inputs
Bone.setup_filter = function()
{
    let inputs = Bone.$$('.filter_input')

    for(let input of inputs)
    {
        let group = input.dataset.filterGroup

        Bone[`filter_${group}`] = Bone.debounce(function()
        {
            Bone.do_filter(group)
        }, 250)

        input.addEventListener('input', function()
        {
            Bone[`filter_${group}`]()
        })
    }
}

// Does a filter operation on a generic filter item
Bone.do_filter = function(group)
{
    let c = Bone.$(`#${group}_container`)
    let filter = Bone.$(`#${group}_filter`)
    let value = filter.value.trim()
    let items = c.querySelectorAll('.filter_item')

    for(let item of items)
    {
        if(!filter || item.dataset.filter_content.includes(value))
        {
            item.style.display = 'block'
        }

        else
        {
            item.style.display = 'none'
        }
    }
}