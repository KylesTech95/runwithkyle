import {localvideoStreamMain} from "../main.js";

// export vars
export let localvideoStream;
export let mediarecorder

// Optional: Initialize binary type for native WebSockets (Socket.IO handles this automatically, but good practice)
// socket.binaryType = 'blob';

// vars
let localStream;
let expanded = false;
let duration_interval;
let currentMode = 'environment';
let chunks = [];
let screenchunks = [];
let duration, timeframe, formattime;

// const notifications = document.getElementById('notification-gallery')
// const highlightscontainer = document.getElementById('tracker-list-highlights-container')
// const highlightTitle = document.querySelector('.stats-highlight-title')
// const highlightHr = document.querySelector('.highlight-hr')

const audio_options = {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        sampleRate: 48000,
        channelCount: 2,
    };


// start camera
export async function startCamera(bool,resolution={height:1080,width:1920}) {
    expanded = false
        try {
            
             if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.error('getUserMedia is not supported in this browser.');
                return;
            }
            const permissionStatus = await navigator.permissions.query({ name: 'camera' })
            
            // get video element
                let videoElement = document.createElement('video');
                
                let circleDiv = document.createElement('div')
                let circleDiv_recorder = new Image();
                let cameraflip = document.createElement('span')
                let env_img = new Image()
                
                circleDiv_recorder.src = 'https://cdn.recballmedia.com/media/record.png'
                circleDiv_recorder.classList.add('circle-div-recorder')

            // time
            if(bool){
                duration = 0
                // console.log('Start Time:', duration)
                duration_interval = setInterval(()=> duration++ ,1000)
            } else {
                if(duration) {
                  clearInterval(duration_interval); // clear interval
                  // console.log(duration)
                  timeframe = duration * 1000;
                  formattime = millisToMinutesAndSeconds(timeframe);
                  // console.log(formattime)
                  duration = undefined;
                }
            }
            if(bool!==false){
                permissionStatus.onchange = e => {
                    return null;
                }
                if(document.getElementById('video-feed')||document.querySelector('.circle-div')){
                    document.getElementById('video-feed').remove();
                    document.querySelector('.circle-div').remove();
                }
                // video stream
                let stream = await navigator.mediaDevices.getUserMedia({ video:{advanced:[{focusMode: 'continuous'}],
                    frameRate: {
                        ideal: 30, // Request an ideal FPS of 30
                        max: 60    // Set a maximum limit of 60 FPS
                        },
                    height:{ideal:resolution.height},
                    width:{ideal:resolution.width},
                    // height:{ideal:1080},
                    // width:{ideal:1920},
                    facingMode:currentMode
                },audio:false});    
                // audio stream
                let audioStream = await navigator.mediaDevices.getUserMedia({video:false, 
                    audio: audio_options
                })
                
                let combinedStream = new MediaStream([
                    ...stream.getVideoTracks(),
                    ...audioStream.getAudioTracks()
                ])

                let settings = audioStream.getAudioTracks()[0].getSettings();
                console.log(`Actual sample rate: `, settings.sampleRate)
                
                localStream = combinedStream;

                let expand_minimize = document.createElement('img')
                expand_minimize.classList.add('expand-min')
                expand_minimize.src = 'https://cdn.recballmedia.com/media/expand.png'

                    circleDiv.classList.add('circle-div')
                    cameraflip.classList.add('camera-flip')
                    env_img.classList.add('env-img')
                    videoElement.setAttribute('id','video-feed')
                    videoElement.setAttribute('autoplay',true)
                    videoElement.setAttribute('playsinline',true)
                    // videoElement.srcObject = stream;
                    videoElement.srcObject = combinedStream;
                    //https://stackoverflow.com/questions/61515250/how-to-fix-an-extensive-echoing-while-recording-audio-using-navigator-mediadevic
                    // fix here would be to add a muted element to the playback on your page.

                    videoElement.muted = true

                    circleDiv.appendChild(videoElement)
                    // circleDiv.appendChild(circleDiv_recorder)
                    cameraflip.appendChild(env_img)
                    // circleDiv.appendChild(expand_minimize)
                    document.getElementById('modal-container').appendChild(circleDiv)
                    if(document.getElementById('modal-exit')){
                        document.getElementById('modal-exit').classList.add('camera-remove')
                    }

                    // expand_minimize.onclick = () => {
                    //     // islarge = !islarge
                    //     expanded = !expanded;
                    //     if(navigator.vibrate)navigator.vibrate(133)
                    //     circleDiv.classList.toggle('enlarge-window')
                    //     expanded && bool ? circleDiv.appendChild(circleDiv_recorder) : circleDiv_recorder.remove()
                    //     if(expanded && bool){
                    //         circleDiv.appendChild(circleDiv_recorder)
                    //     } else {
                    //         circleDiv_recorder.remove()
                    //     }
                    // }
                    circleDiv_recorder.onclick = () => {
                        handleCamera();
                        expanded = false
                    }
                    
                    // permissions
                    let permissions = await navigator.permissions.query({ name: 'camera' });
                    if(permissions.state !== 'granted'){
                    } else {
                    }                   
                    // screen capture the local stream
                    screenCapture(combinedStream,bool)
            } else {
                if (localStream) {
                    localStream.getTracks().forEach(track => {
                        track.stop(); // Stop each individual track
                        // // console.log(`Stopped track: ${track.kind}`);
                    });
                    
                    // Optionally, clear the srcObject of the video element
                    const videoElement = document.querySelector('video');
                    if (videoElement) {
                        videoElement.srcObject = null;
                    }
                    
                }
                document.getElementById('video-feed') ? document.getElementById('video-feed').remove():null;
                document.querySelector('.circle-div') ? document.querySelector('.circle-div').remove():null;

            
            }
            
        } catch (err) {
            // Handle cases where the user denies permission or no camera is found
            console.error("Error accessing camera:", err);
        }

        
        
}


// screen capture 
export function screenCapture(stream=undefined, bool,screencapture=false){ // assuming video is true

    // Check if the browser supports the MediaRecorder API
    if (!MediaRecorder.isTypeSupported('video/mp4; codecs=vp9')) {
        console.warn('VP9 codec not supported, trying "video/mp4"');
    }
    
    // record the stream
    const streamoptions = {
        screencapture:{
            options:{ mimeType: 'video/webm;codecs="vp9,opus"', videoBitsPerSecond:18000000},
        },
        video_record:{
            options:{ mimeType: 'video/mp4;codecs="avc1.42E01E, mp4a.40.2"', videoBitsPerSecond:18000000, audioBitsPerSecond: 128000},
            // options:{ mimeType: 'video/mp4;codecs=opus', videoBitsPerSecond:18000000, audioBitsPerSecond: 128000},
            optionsAvc3:{ mimeType: 'video/mp4; codecs="hev1.1.06.L120.90"', videoBitsPerSecond: 18000000,audioBitsPerSecond: 128000}
        }
    }
    
    
    //   if (MediaRecorder.isTypeSupported(optionsAvc3.mimeType && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Linux/ig.test(navigator.userAgent))) {
      if(stream && bool !== false){
        if(screencapture !== false){
            mediarecorder = new MediaRecorder(stream,streamoptions.screencapture.options)
            
        } else {
            if (MediaRecorder.isTypeSupported(streamoptions.video_record.options.mimeType)) {
            mediarecorder = new MediaRecorder(stream,streamoptions.video_record.options)
            
            // ... rest of your recording logic ...
            } else {
                console.error('mimetype mismatch')
            }
        }
    } 
    if(mediarecorder){
            // add data to chuks [array] if available
        mediarecorder.addEventListener('dataavailable',e => {
            if(e.data.size > 0) {
                    // console.log(e.data)
                    chunks.push(e.data);
            }
        })

        // save recording onstop / download
        mediarecorder.addEventListener('stop', e => {
            // console.log('video stopped')
            mediarecorder.stop();
            stream.getTracks().forEach(track => track.stop()); // Stop all tracks

            const blob = new Blob(chunks, {
            // type: `video/${screencapture ? 'webm' : 'mp4'}`
            type: `video/mp4`
        }); 
        
            const url = URL.createObjectURL(blob);
            const li = document.createElement('li')
            const a = document.createElement('a');
            const remove = document.createElement('span')
            // const newtime = document.getElementById('time-actual');
            
            
            li.classList.add('highlight-li')
            li.classList.add('unseen')
            a.classList.add('highlight-link')

            // update url
            a.href = url;


            // date object
            const dateObj = new Date()
            const dateTime = dateObj.getTime()
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1; // Months are 0-based, so add 1
            const day = dateObj.getDate();

            // Format with leading zeros if needed
            const formattedMonth = month < 10 ? `0${month}` : month;
            const formattedDay = day < 10 ? `0${day}` : day

            // a.download = `rbs-${year}.${formattedMonth}.${formattedDay}-${dateTime}.${ext}`;
            a.download = `rwk-${year}.${formattedMonth}.${formattedDay}-${dateTime}.${'mp4'}`;
            
            a.click()
            
            let maketime = new Image(20,20)
            maketime.src = 'https://cdn.recballmedia.com/media/timeframe.png'

            videotrack.appendChild(li)

            notifications.classList.remove('no-display')
            notifications.textContent = +notifications.textContent + 1;

            highlightscontainer.classList.remove('no-display')
            highlightTitle.classList.remove('no-display')
            highlightHr.classList.remove('no-display')

            // previewVideo.remove();
            chunks.length = 0; // Clear the array for the next recording

        })
    // start recording
    // Start recording, gathering data every 200ms
    bool ? mediarecorder.start(100) : mediarecorder.stop();
    chunks = [] 

    }
}

// milliseconds to minutes and seconds 04:12
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}