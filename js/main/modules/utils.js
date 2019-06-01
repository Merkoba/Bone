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

Bone.get_percentage = function(n1, n2, whole=false)
{
    return (n1 / n2) * 100
}

Bone.get_remaining_percentage = function(sum)
{
    return Math.floor(100 - sum) - 0.1
}

Bone.get_child_index = function(element) 
{
    return Array.from(element.parentNode.children).indexOf(element)
}

Bone.insert_after = function(el, reference_node) 
{
    reference_node.parentNode.insertBefore(el, reference_node.nextSibling)
}

Bone.insert_before = function(el, reference_node) 
{
    reference_node.parentNode.insertBefore(el, reference_node)
}

Bone.debounce = function(func, wait, immediate) 
{
    let timeout
    
    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() 
    {
        // Store the context of this and any
        // parameters passed to executedFunction
        let context = this
        let args = arguments
            
        // The function to be called after 
        // the debounce time has elapsed
        let later = function() 
        {
            // null timeout to indicate the debounce ended
            timeout = null
                
            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args)
        }
    
        // Determine if you should call the function
        // on the leading or trail end
        let callNow = immediate && !timeout
        
        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the 
        // inside of the previous setTimeout  
        clearTimeout(timeout)
        
        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait)
        
        // Call immediately if you're dong a leading
        // end execution
        if(callNow) func.apply(context, args)
    }
}

Bone.get_element_index = function(element) 
{
    return [...element.parentNode.children].indexOf(element)
}

Bone.remove_element = function(element)
{
    element.parentNode.removeChild(element)
}

Bone.replace_element = function(replacement, original)
{
    original.parentNode.replaceChild(replacement, original)
}