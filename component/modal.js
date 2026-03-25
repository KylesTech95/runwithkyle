// Rules
// all contents within a modal will be stored within a div#modal-content-div element

/* ------------------------------------------- */

const modal = document.getElementById('modal-container')
const body = document.body;
const wrapper = document.getElementById('wrapper')
const window_type = 'modal'

export default function view_modal(type, options = {calendar:{li:undefined}}) {

    if(!type) {
        console.error('view_modal: Check arguments');
        return;
    }

    viewModal() // view modal
    clearModal() // clear modal of previous items
    appendExit() // append exit
    

    switch(true) {
        case type == 'calendar':
        if(!options.calendar.li || options.calendar.li == undefined) {
            console.warn('options.calendar.li: check object / element');
            return;
        }
        // process calendar item
        processCalendarItem(options.calendar.li);
        
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

function clearModal() {
    if(modal && !modal.classList.contains('no-display')) {

        // if modal has children
        if(modal.children) {
            
            console.log(modal.children)
            let div_element = [...modal.children].find(child => child.id === 'modal-content-div'); // store child as div

            // if div exists
            if(div_element && div_element.children){
                // remove children
                return [...div_element.children].map(x => x.remove());
            } else {
                console.log('div_element does not have any children');
                return false;
            }
        } else {
            console.log('modal does not need to be cleared at this time')
            return false;
        }
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