import { convertTime, confirm_prompt } from "../main.js";
import { updateItem, hideNavTime, showNavTime} from "../elapse.js";
import { handleVibrate } from "../main.js";
import { startCamera } from "./camera.js";
/* ------------------------------------------- */
const playback = {
    play:false,
    pause:false,
    stop:false,
}
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

        detectInprogress(options.calendar.li)
        
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

function detectInprogress(element){
    if(!element) return false;
    const notInProgress = element.classList.contains('bg-green')

    if(!notInProgress){
        hideNavTime()
    } else {
        showNavTime()


        let position = null;

        for(let i in playback){
            let playback_element = document.getElementById(`nav-${i}`);

            playback_element.onclick = () => {
                // send all properties to false
                Object.keys(playback).map(pb => playback[pb] = false)

                if(i){
                    playback[i] = true;
                    if(i === 'stop') return;

                    playback_element.classList.add('no-display')
                    
                    if(i==='play'){ // play
                        
                        document.getElementById('nav-pause').classList.remove('no-display')
                        document.getElementById('nav-stop').classList.remove('no-display')
                        handle_navigation_series(position)
                        console.log('starting our event!')

                        
                    } 
                    if(i==='pause'){ // pause
                        
                        document.getElementById('nav-play').classList.remove('no-display')
                        document.getElementById('nav-stop').classList.add('no-display')
                        handle_navigation_series(position)
                        console.log('pausing our event!')

                    } 
                }
                console.log(playback)
            }
        }

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

        // duration
        if(sib && /duration/gi.test(cal_label[i].textContent) && parent.id === 'cal-duration') {
            let typecontainer = [...element.children].find(d => d.id==='type-container');

            if(typecontainer) {
                let type_p_text = typecontainer.children[1].textContent;
                
                sib.textContent = type_p_text
            }
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

function handle_navigation_series(position){
    console.log(position)
    
    if(!playback.play && playback.pause) {
        console.log('waiting for play');
        console.log(position)
        return position;
    }
    if ("geolocation" in navigator) {
        // Geolocation is available
        var watchId = navigator.geolocation.watchPosition(
            showPosition, 
            showError, 
            { enableHighAccuracy: true } // Request high accuracy
        );
    } else {
        // Geolocation is not supported
        alert("Geolocation is not supported by this browser.");
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                console.error("An unknown error occurred.");
                break;
        }
    }

    var prevPosition = null;
    var totalDistance = 0; // In kilometers

    function showPosition(position) {
        var currentLat = position.coords.latitude;
        var currentLon = position.coords.longitude;

        if (prevPosition) {
            var lat1 = prevPosition.coords.latitude;
            var lon1 = prevPosition.coords.longitude;
            var segmentDistance = calculateDistance(lat1, lon1, currentLat, currentLon);
            
            // Add the new segment distance to the total distance
            totalDistance += segmentDistance;
            
            console.log("Segment distance: " + segmentDistance.toFixed(2) + " km");
            console.log("Total distance traveled: " + totalDistance.toFixed(2) + " km");
        }

        // Update the previous position to the current position for the next update
        prevPosition = position.coords;
        
        // Update UI elements as needed
        document.querySelector(".distance-num").innerHTML = totalDistance.toFixed(2) //+ " km";
    }
    
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance; // Returns the distance in kilometers
    }

        return position;

}
