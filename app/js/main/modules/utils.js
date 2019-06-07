// Fetch a single element
Bone.$ = function(s)
{
    return document.querySelector(s)
}

// Fetch multiple elements
Bone.$$ = function(s, container=false)
{
    if(!container)
    {
        container = document
    }

    return Array.from(container.querySelectorAll(s))
}

// Returns a cloned object
Bone.clone_object = function(obj)
{
    return JSON.parse(JSON.stringify(obj))
}

// Rounds to the specified decimal point
Bone.round = function(value, decimals)
{
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

// Gets the element index relative to its parent
Bone.get_child_index = function(element) 
{
    return Array.from(element.parentNode.children).indexOf(element)
}

// Gets a child element at a given index
Bone.get_child_at_index = function(parent, index)
{
    return Array.from(parent.children)[index]
}

// Inserts an element after another one
Bone.insert_after = function(el, reference_node) 
{
    reference_node.parentNode.insertBefore(el, reference_node.nextSibling)
}

// Inserts an element before another one
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

// Gets the index of the element relative to its parent
Bone.get_element_index = function(element) 
{
    return [...element.parentNode.children].indexOf(element)
}

// Removes an element
Bone.remove_element = function(element)
{
    element.parentNode.removeChild(element)
}

// Replaces an element with another one
Bone.replace_element = function(replacement, original)
{
    original.parentNode.replaceChild(replacement, original)
}

// Copies a string to the clipboard
Bone.clipboard_write = function(s)
{
    clipboard.writeText(s)
}

// Reads the content of the clipboard
Bone.clipboard_read = function()
{
    return clipboard.readText().trim()
}

// Checks if all text in a text element is selected
Bone.check_if_all_text_selected = function(element)
{
    return element.selectionStart === 0 && element.selectionEnd === element.value.length
}

// Moves the cursor to the end
Bone.move_cursor_to_end = function(element)
{
    element.selectionStart = element.selectionEnd = element.value.length
}

// Checks if any item of a given class has a display other than none
Bone.check_any_item = function(cls)
{
    for(let item of Bone.$$(cls))
    {
        if(item.style.display !== 'none')
        {
            return true
        }
    }

    return false
}

Bone.perini = new RegExp
(
    '^' +
    '(?:(?:(?:https?|ftp):)?\\/\\/)' +
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    '(?:' +
        '(?:' +
        '[a-z0-9\\u00a1-\\uffff]' +
        '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
        ')?' +
        '[a-z0-9\\u00a1-\\uffff]\\.' +
    ')+' +
    '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
    ')' +
    '(?::\\d{2,5})?' +
    '(?:[/?#]\\S*)?' +
    '$', 'i'
)