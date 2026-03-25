// function to access modal
// args: (type, options = {calendar:{li:undefined}})
const modal = document.getElementById('modal-container')
const body = document.body;
const wrapper = document.getElementById('wrapper')
const window_type = 'modal'

export default function view_modal(type, options = {calendar:{li:undefined}}) {

    if(!type) {
        console.error('view_modal: Check arguments');
        return;
    }

    viewModal()
    appendExit()
    

    switch(true) {
        case type == 'calendar':
        if(!options.calendar.li || options.calendar.li == undefined) {
            console.warn('options.calendar.li: check object / element');
            return;
        }
        
        // process calendar item
        processCalendarItem(options.calendar.li);
        
        // window click 
        window.onclick = e => global_window_click(e,window_type)
            
        console.log('view calendar item here !')
        break;


        case type == 'notification':
        break;

        
        case type == 'milestone':
        break;


        case type == 'error':
        break;  


        default: console.log(undefined)
        break;
    }
}

function viewModal() {
    if(modal.classList.contains('no-display')){
        // modal appears
        modal.classList.remove('no-display')

        // set body to no-pointer
        wrapper.classList.add('no-pointer', 'stale-body')
    }
}
function appendExit() {
    if(modal && !modal.classList.contains('no-display')) {
        // exit modal

        // create exit element
        const p = document.createElement('p')
        // set attributes and textcontent
        p.setAttribute('id','modal-exit')
        p.textContent = 'X'
        
        // append exit to modal
        modal.append(p)

        // exit modal onclick
        p.onclick = () => exitModal()


    } else {
        console.error('exitModal: check modal state')
        return;
    }

}

export function exitModal() {
if(!modal.classList.contains('no-display')){
        // modal appears
        modal.classList.add('no-display')

        // set body to no-pointer
        wrapper.classList.remove('no-pointer', 'stale-body')
    }
}

function processCalendarItem(element) {
    console.log(element)
}