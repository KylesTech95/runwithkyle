// imports
import generateCalendarListItem from "./component/calendar.js";


// vars (variables)
const navToggleContainer = document.getElementById('nav-toggle-container')
const nav_container = document.getElementById('nav-list-container')
const nav_container_mobile = document.getElementById('nav-list-container-mobile')
const mobile_nav_open = 'mobile-nav-open';
const shedule_list_container = document.getElementById('scheduled-item-list-container')
const datetime_submit = document.getElementById('datetime-submit')
const maxBars = 2;


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
    time:document.getElementById('appointment-time')
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
                console.log('both items are selected')

                // submit appears
                addSubmit()


                datetime_submit.onclick = () => handleDatetimeSubmit(inputs)
                
            } else {
                console.log('waiting on an item')
                // submit disappears
                removeSubmit()
            }
        }
    }
}









/*================================================== */
// testing site



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
function convertTime(num){ // integer
    const newDate = new Date(num);
    const [year, day, month] = [newDate.getUTCFullYear(), newDate.getDate(), (+newDate.getMonth() < 10 ? `0${+newDate.getMonth() + 1}` : +newDate.getMonth() + 1)]
    const [hours,minutes,seconds] = [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()];

    const date = `${year}-${month}-${day}`;
    const time = `${hours}:${minutes}:${seconds}`;

    return {date:date,time:time}
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
function handleDatetimeSubmit(inputs){
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

    // convert datetime to object {date,time}
    const get_datetime = convertTime(newDateTime);


    // generate list item
    let listitem = generateCalendarListItem(get_datetime);
    shedule_list_container.appendChild(listitem) // append listitem to ul


    // garbage / trash
    removeSubmit()
    inputs.date.value = ''
    inputs.time.value = ''

    // return 
    return true;
}


function removeSubmit() {
    datetime_submit.classList.add('no-display')
}

function addSubmit() {
    datetime_submit.classList.remove('no-display')
}
navToggleContainer.onclick = toggleNav;