let current_slide = 0

function init()
{
    create_modals()
    setup_screenshots()
    setup_slides()
}

function create_modals()
{
    image_modal = Msg.factory(
    {
        window_height: '90vh',
        window_max_height: '90vh',
        window_width: '90vw',
        window_max_width: '90vw',
        titlebar_enabled: false,
        window_x: 'none',
        overlay_x: 'right'
    })
}

function setup_screenshots()
{
    let screenshots = Array.from(document.querySelectorAll('.screenshot'))

    for(let screenshot of screenshots)
    {
        screenshot.addEventListener('click', function(e)
        {
            let img = document.createElement('img')
            img.src = this.src
            img.classList.add('modal_screenshot')
            
            img.addEventListener('click', function(e)
            {
                image_modal.close()
            })

            image_modal.show(img)
        })
    }
}

function setup_slides()
{
    let slides =  Array.from(document.querySelectorAll('.slide_container'))
    num_slides = slides.length

    for(let slide of slides)
    {
        slide.querySelector('.slide_controls').addEventListener('click', function(e)
        {
            next_slide()
        })

        slide.style.display = 'none'
    }

    next_slide()
}

function next_slide()
{
    let old_slide = current_slide
    current_slide += 1

    if(current_slide > num_slides)
    {
        current_slide = 1
    }

    if(old_slide > 0)
    {
        document.querySelector(`#slide_container_${old_slide}`).style.display = 'none'
    }

    document.querySelector(`#slide_container_${current_slide}`).style.display = 'flex'
}