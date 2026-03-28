// imports
import generateCalendarListItem from "./component/calendar.js";
import view_modal from "./component/modal.js";
import detectTimeChange from "./elapse.js";
import { startCamera } from "./component/camera.js";
// vars (variables)
const navToggleContainer = document.getElementById('nav-toggle-container')
const nav_container = document.getElementById('nav-list-container')
const nav_container_mobile = document.getElementById('nav-list-container-mobile')
const mobile_nav_open = 'mobile-nav-open';
const shedule_list_container = document.getElementById('scheduled-item-list-container')
const datetime_submit = document.getElementById('datetime-submit')
const maxBars = 2;
const window_type = 'general'

export let modal_enabled = false;
export let localvideoStreamMain;


// object data
const months = {
            jan:1,
            feb:2,
            mar:3,
            apr:4,
            may:5,
            jun:6,
            jul:7,
            aug:8,
            sep:9,
            oct:10,
            nov:11,
            dec:12
}
const inputs = {
    date:document.getElementById('scheduled-date'),
    time:document.getElementById('appointment-time'),
    distance:document.getElementById("rwk-distance-input"),
    distance_type:document.getElementById("distance-type"),
    select:document.getElementById('run-or-walk')
}
const object = {
    error:'object is not present',
    success:'Object loaded successfully',
    invalid:'invalid object, or mutation'
}
const navigation_commander = {
    mobile:{
        enabled:false,
    },
    regular:null,
}

// control
inputs.date.setAttribute('min', convertTime(Date.now()).date)

// oninputs
for(let i in inputs){

    inputs[i].oninput = e => {
        let target = e.target || undefined;
        
        if(target){
            let value = target.value;

            // check if both values are selected
            if(Object.values(inputs).every(input => input.value)) {

                // submit appears
                addSubmit()

                const sched_message = 'Add event to Schedule ?';
                datetime_submit.onclick = () => confirm_prompt(sched_message).then(d => scheduleExercise(inputs))

            } else {
                // submit disappears
                removeSubmit()
            }
        }
    }
}

/*================================================== */
// testing site

// onkeydown
// remove an item from schedule
// initial detect
detectTimeChange()
let c = 0;
setInterval(()=> {
    detectTimeChange()
},1000)
/*================================================== */


// functions
// toggle navigation (mobile)
function toggleNav(e) {
    const cross = 'cross-'; // var
    const target = e.target||window; // capture toggle container

    // if container is not undefined 
    if(target && target.id === 'nav-toggle-container' && nav_container_mobile) {
        if(target.children.length == maxBars) { // if # of spans/children === current maxBars
            // define the children;
            const [span1,span2] = [...target.children];

            // map ids from elements
            const [nts1,nts2] = [...target.children].map(element => element.id)
            
            // if every span element does not include a certain class 
            const determineToggleState = [...target.children].every(child => {
                let classlist = [...child.classList];
                return !classlist.find(item => /^cross-/g.test(item));
            })

            // condition 1 & 2
            if(determineToggleState && !navigation_commander.mobile.enabled){
                // add the class
                span1.classList.add(cross + nts1)
                span2.classList.add(cross + nts2)

                navigation_commander.mobile.enabled = true;

            } else {
                navigation_commander.mobile.enabled = false;
                // remove the class
                span1.classList.remove(cross + nts1)
                span2.classList.remove(cross + nts2)

            }

            // if 
        } else {
            console.error(object.invalid)
        }
    } else {
        console.error(object.error)
    }

    // check navigation commander for any changes
    if(navigation_commander.mobile.enabled) {
        nav_container_mobile.classList.add(mobile_nav_open);
    } else {
        nav_container_mobile.classList.remove(mobile_nav_open);
    }
}
// convert time from date.now() to m/d/time/etc...
export function convertTime(num){ // integer
    const newDate = new Date(num);
    const [year, day, month] = [newDate.getUTCFullYear(), newDate.getDate(), (+newDate.getMonth() < 10 ? `0${+newDate.getMonth() + 1}` : +newDate.getMonth() + 1)]
    const [hours,minutes,seconds] = [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()];

    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;

    return {date:date,time:time, int:num}
}
// get month
export function getMonth(num){
    num = Number(+num)
   if(!num) return false;
    
    
    // const secured_month = months[num]||undefined;


    let secured_month;
    
    // loop through months/object
    for(let i in months) {
        if (num === months[i]) { // if value === arg
            secured_month = i; // store month
        }
    }
    // if month is not stored
    if(!secured_month){
        console.error('getMonth(): month not selected');
        return false;
    }

    // return result
    return secured_month.toUpperCase();
    


}
// submit date/time onclick 
function scheduleExercise(inputs){

    let str = '';
    
    // check if values are present
    if(inputs.date.value && inputs.time.value){

        // update string
        str += inputs.date.value;
        str += 'T'
        str += inputs.time.value

    }
    // store new datetime in variable
    const newDateTime = new Date(str).getTime();

    // console.log("TIME STR", newDateTime)
    // convert datetime to object {date,time}
    let get_datetime = convertTime(newDateTime);
    get_datetime = {...get_datetime,...{type:inputs.select.value, distance:`${inputs.distance.value} ${inputs.distance_type.value}`}}


    // generate list item
    let listitem = generateCalendarListItem(get_datetime);
    shedule_list_container.appendChild(listitem) // append listitem to ul
    
    const event_in_progress = [...document.querySelectorAll('.si-list-item')].length > 0 && [...document.querySelectorAll('.si-list-item')].find(x => x.classList.contains('bg-green'));
    console.log([...document.querySelectorAll('.si-list-item')])
    console.log("EVENT IN PROGRESS",event_in_progress)
    if(event_in_progress){
        listitem.remove();
        console.warn('scheduleExercise: Event is in progress')
        alert('scheduleExercise: Event is in progress');
        return false;
    }

    // sort schedule container
    let current_children = [...shedule_list_container.children];
    let sort_children = [...current_children].sort((a,b) => {
        return +a.getAttribute('--data-datetime') - +b.getAttribute('--data-datetime')
    })
    // replace children with sorted
    shedule_list_container.replaceChildren(...sort_children)

    // enable clients to view an exercise
    reviewExercise(document.querySelectorAll('.si-list-item'))



    // garbage / trash
    removeSubmit()
    inputs.date.value = ''
    inputs.time.value = ''
    inputs.select.value = ''
    inputs.distance.value = ''
    inputs.distance_type.value = ''


    // handle removal of item
    let remove_buttons = [...shedule_list_container.children]
    for(let i = 0; i < remove_buttons.length; i++) {
        let camera_btn = [...remove_buttons[i].children].find(x => x.classList.contains('camera-btn'))
        let rm_btn = [...remove_buttons[i].children].find(x => x.classList.contains('remove-button'));

        // camera onclick
        camera_btn.onclick = (e) => {
            let cam = e.target;
            let li = remove_buttons[i];

            console.log('camera is clicked!');
            // prompt question
            const take_picture = 'Access camera ?';
            
            confirm_prompt(take_picture).then(y => steamVideo(li,cam))
            
        }
        // click on item
        rm_btn.onclick = (e) => {
            const parent = e.target.parentElement;

            // parent.onclick = null;

            // get current index
            let getIndex = [...document.querySelectorAll('.si-list-item')].indexOf(parent)

            // remove items
            const removal_message = 'Remove Calendar Item ?'
            remove_buttons = confirm_prompt(removal_message).then(d => removeItem(shedule_list_container, getIndex))

        }

        // join exercise
        const join_btn = [...remove_buttons[i].children].find(ch => /join/gi.test(ch.textContent))
        const leave_btn = [...remove_buttons[i].children].find(ch => /leave/gi.test(ch.textContent))
        console.log(join_btn)
        console.log(leave_btn)
        if(join_btn) {
            // click on join btn
            join_btn.onclick = e => {
                const parent = e.target.parentElement;
                // parent.onclick = null;
                const target = e.target;

                target.classList.add('no-display','grayed-out')
                leave_btn.classList.remove('no-display','grayed-out')
            }
        } 

        if(leave_btn) {
            // click on join btn
            leave_btn.onclick = e => {
                const parent = e.target.parentElement;
                // parent.onclick = null;
                const target = e.target;

                target.classList.add('no-display','grayed-out');
                join_btn.classList.remove('no-display','grayed-out');
            }
        } 

    }



    
    // return 
    // return true;
}


// remove submit
function removeSubmit() {
    datetime_submit.classList.add('no-display')
}
// add submit
function addSubmit() {
    datetime_submit.classList.remove('no-display')
}
// remove item from container
function removeItem(container,index){
    if(!container || (!index && index !== 0)) {
        console.error('no arguments. check again')
        return;
    }

    // hide modal
    view_modal('exit')

    // target current children
    let current = [...container.children];

    // splice
    current.splice(index,1);

    // replace children
    container.replaceChildren(...current)

    // console.log(container)
    // console.log(container.children)

    return current
}
// test - handle schedule item removal with keydown (testing site)
function handle_schedule_item_removal(e) {
        if(shedule_list_container.children.length < 1){
            console.warn('handle_schedule_item_removal: Pending children')
        }
        let key = e.key;
        if(shedule_list_container.children){
             if(/[0-9]/.test(key)){
                removeItem(shedule_list_container, +key)
            } else {
                console.warn('select an integer')
            }
        }
}
// click on an exercise
function reviewExercise(arr){

    for(let i = 0;  i < arr.length; i++) {
        // click on exercise
        arr[i].onclick = () => {

            // vibrate
            handleVibrate()

            // view modal
            view_modal('calendar',{calendar:{li:arr[i]}})
            modal_enabled = true;
        }
    }
}
export function handleVibrate() {
    if(navigator.vibrate) navigator.vibrate(133);
}

export function confirm_prompt(question) {
    // vibrate
    handleVibrate()
    
    return new Promise((res,rej) => {
        
        setTimeout(() => {
                let confirmed = false;

                if(confirm(question)) {
                    confirmed = true;
                }

                if (confirmed) {
                    res("Data successfully fetched!"); // Fulfills the promise with a value
                } else {
                    rej("Error: Operation failed."); // Rejects the promise with an error
                }
        }, 100);
    })

}
navToggleContainer.onclick = toggleNav;

// take picture 
function steamVideo(li,cam) {
    cam.classList.add('camera-on')

    console.log('taking picture soon !')

    view_modal('camera', {calendar : {li : li}})

    startCamera(true)

}