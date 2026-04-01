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



        for(let i in playback){
            let playback_element = document.getElementById(`nav-${i}`);

            playback_element.onclick = () => {
                // send all properties to false
                Object.keys(playback).map(pb => playback[pb] = false)

                if(i){
                    playback[i] = true;
                    if(i === 'stop') return;

                    playback_element.classList.add('no-display')
                    let watchId;
                    
                    if(i==='play'){ // play
                        // nav series
                        
                        document.getElementById('nav-pause').classList.remove('no-display')
                        document.getElementById('nav-stop').classList.remove('no-display')
                        console.log('starting our event!')


                        let totalDistanceMiles = 0;
                        let lastPosition = null;

                        // Radius of the Earth in miles
                        const EARTH_RADIUS_MILES = 3958.8;

                        // 1. Start Tracking
                        if ("geolocation" in navigator) {
                          watchId = navigator.geolocation.watchPosition(
                                updatePosition,
                                (error) => console.error("Error:", error),
                                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
                            );
                        } else {
                            alert("Geolocation not supported");
                        }

                        // 2. Callback function on location change
                        function updatePosition(position) {
                            const currentPosition = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                            if (lastPosition) {
                                // Calculate distance between last and current point
                                const distance = haversineDistance(
                                    lastPosition.lat, lastPosition.lng,
                                    currentPosition.lat, currentPosition.lng
                                );
                                totalDistanceMiles += distance;
                                console.log(`Segment: ${distance.toFixed(2)} mi`);
                                console.log(`Total: ${totalDistanceMiles.toFixed(2)} mi`);

                                document.querySelector('.distance-num').textContent = totalDistanceMiles.toFixed(2);
                            }

                            lastPosition = currentPosition;
                        }

                        // 3. Haversine Formula Converter
                        function haversineDistance(lat1, lon1, lat2, lon2) {
                            const dLat = toRad(lat2 - lat1);
                            const dLon = toRad(lon2 - lon1);
                            
                            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                            
                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                                return EARTH_RADIUS_MILES * c; // Distance in miles
                                }

                        // Helper: Degree to Radian
                        function toRad(value) {
                            return value * Math.PI / 180;
                        }
                    } 
                    if(i==='pause'){ // pause
                        // nav series
                        if (watchId !== null) {
                            navigator.geolocation.clearWatch(watchId);
                            watchId = null; // Reset to indicate it's paused
                        }
                        
                        document.getElementById('nav-play').classList.remove('no-display')
                        document.getElementById('nav-stop').classList.add('no-display')
                        console.log('pausing our event!')

                    } 
                }
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

function convertDistance(num,from,to) {
    const conversions = {
        kilometer_mile:1.609,
    }
    return conversions.hasOwnProperty(`${from}_${to}`) ?  num %= conversions[`${from}_${to}`] : num

}


function targetCurrentPosition(){

if ("geolocation" in navigator) {
  // Geolocation is available
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // Success callback
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("latitude:", latitude);
      console.log("longitude:", longitude);
      return {latitude:latitude, longitude:longitude}
      // Do something with the coordinates, e.g., display on a map
    },
    (error) => {
      // Error callback
      console.error("Error getting location:", error.message);
    },
    {
      // Optional options
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
} else {
  // Geolocation is not supported by the browser
  console.log("Geolocation is not supported by this browser.");
}
}