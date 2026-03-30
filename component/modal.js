import { convertTime, confirm_prompt } from "../main.js";
import { updateItem } from "../elapse.js";
import { handleVibrate } from "../main.js";
import { startCamera } from "./camera.js";
/* ------------------------------------------- */

const modal = document.getElementById('modal-container')
const body = document.body;
const wrapper = document.getElementById('wrapper')
const window_type = 'modal'
const completion_check = document.querySelector('.completion-check')

export default function view_modal(type, options = {calendar:{li:undefined}}) {

    if(completion_check)completion_check.classList.add('no-display')

    if(!type) {
        console.error('view_modal: Check arguments');
        return;
    }

    if(type === 'exit') {
        exitModal();
        return;
    }
    
    viewModal() // view modal
    clearModal() // clear modal of previous items
    appendExit() // append exit
    activateTemplate(type) // template

    switch(true) {
        case type == 'calendar':
        if(!options.calendar.li || options.calendar.li == undefined) {
            console.warn('options.calendar.li: check object / element');
            return;
        }
        // process calendar item
        processCalendarItem(options.calendar.li);
        appendCompletion(options.calendar.li);
        detectCompletion(options.calendar.li)

        
        break;

        case type == 'camera':
            if(document.querySelector('.completion-btn')) document.querySelector('.completion-btn').remove()
            modal.classList.add('camera-view','modal-video-fixed-top');

            // alter media recorder exit button
            if(document.getElementById('modal-exit')) {
                let currentExit = document.getElementById('modal-exit');
                
                currentExit.textContent = '';

                currentExit.classList.add('modal-exit-recorder');
            }

            startCamera(true);
            
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

function detectCompletion(element) {
    if(document.querySelector('.completion-check')) document.querySelector('.completion-check').classList.add('no-display')
        if(element){
        const p = document.createElement('p')
        if(!element.classList.contains('modal-active-view') && element.classList.contains('bg-red')) {
            console.log("DO SOMETHING ABUOT IT!")
            console.log("LIST THE CHECK IMG")
            completion_check.classList.remove('no-display')
        }
    }


}

function appendCompletion(element) {
    if(document.querySelector('.completion-btn')) document.querySelector('.completion-btn').remove()
    if(element){
        const p = document.createElement('p')
        if(element.classList.contains('modal-active-view')) {
            p.classList.add('completion-btn')
            p.textContent = 'Complete'

            modal.append(p)
            const completion_question = 'Confirm event completion'
            p.onclick = () => confirm_prompt(completion_question).then(x => handleCompletion(element))
        }
    }
}

export function exitModal() {
if(!modal.classList.contains('no-display')){
    let allExits = [...document.querySelectorAll('#modal-exit')]
    allExits.map(x => x.remove())
        // document.getElementById('modal-container').classList.remove('camera-remove')
        // turn any cameras back to white (off)
        let all_cameras = [...document.querySelectorAll('.camera-on')];
        all_cameras.map(camera => camera.classList.remove('camera-on'))


        // modal appears
        modal.classList.add('no-display')

        // remove camera
        modal.classList.remove('camera-view', 'modal-video-fixed-top')

        // set body to no-pointer
        wrapper.classList.remove('no-pointer', 'stale-body')

        // turn off camera
        startCamera(false)
}
}

function processCalendarItem(element) {
    const datetime = element.getAttribute('--data-datetime'); // get datetime from li
    const datetime_obj = convertTime(datetime); // get time info

    // iterate through calendar labels
    let cal_label = [...document.querySelectorAll('.cal-label')];
    
    for(let i = 0; i < cal_label.length; i++){
        let parent = cal_label[i].parentElement;
        let sib = [...parent.children].find(ch => ch.classList.contains('cal-answer'));

        // if distance
        if(sib && /distance/gi.test(cal_label[i].textContent) && parent.id === 'cal-distance') {
            let distContainer = [...element.children].find(d => d.id==='distance-container');
            if(distContainer) {
                let type_h4 = distContainer.children[0];
                let type_distance = distContainer.children[1];
                
                let type_h4_text = `${type_h4.textContent} ${type_distance.textContent}`;

                sib.textContent = type_h4_text
            }
        }

        // if how
        if(sib && /how/gi.test(cal_label[i].textContent) && parent.id === 'cal-how') {
            let typecontainer = [...element.children].find(d => d.id==='type-container');
            if(typecontainer) {
                let type_h4 = typecontainer.children[0];
                let type_h4_text = type_h4.textContent;
                
                sib.textContent = type_h4_text
            }
        }

        if(sib && /when/gi.test(cal_label[i].textContent) && parent.id === 'cal-when') {
            let datecontainer = [...element.children].find(d => d.id==='date-container');
            let timecontainer = [...element.children].find(d => d.id==='time-container');
            if(datecontainer) {
                let type_h4 = datecontainer.children[0];
                let type_day = datecontainer.children[1];
                let clock_time = timecontainer.children[0];

                
                let type_h4_text = `${type_h4.textContent} ${type_day.textContent}, ${clock_time.textContent}`;
                
                sib.textContent = type_h4_text;
            }
        }

        // how / how many
        if(sib && /who/gi.test(cal_label[i].textContent) && parent.id === 'cal-who') {
            let min = 1;

            // fetch users who joined
            let users_joined = fetch('/event_id/reserve/accepted').then(d => +d['accepted']||0)
            .catch(err => new Error(err));

            if(users_joined && typeof(users_joined) === 'number'){
                min += users_joined
            }

            sib.textContent = min
        }
        
    }
    


}

function activateTemplate(type) {
    const templates = [...document.querySelectorAll('.modal-template')]
    templates.forEach(t => t.classList.add('no-display'))


    const findTemp = templates.find(t => t.getAttribute('--data-type') === type);

    if(findTemp) findTemp.classList.remove('no-display');
    return;
}

function handleCompletion(element) {
    handleVibrate()
    // set li background to red
    updateItem(element, 'completed');

    exitModal()
}