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

    Bone.get_child_index = function(element) 
    {
        return Array.from(element.parentNode.children).indexOf(element)
    }
}