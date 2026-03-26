import { convertTime } from "./main.js";
const start = performance.now();
 
const time_constraints = {
  minute:{
    2:{

    },
    5:{

    },
    15:{
    
    },
    30:{
    
    },
    45:{
    
    },
  },
  hour:{
    1:{
    
    },
    6:{
    
    },
    12:{
    
    }
  },
  day:{
    1:{

    },
    3:{

    },
    5:{
      
    }
  },
  week:{
    1:{
    },
    2:{
    }
  }
}
export default function detectTimeChange(){
  if(document.querySelectorAll('.si-list-item') && document.querySelectorAll('.si-list-item').length > 0){
    let siS = [...document.querySelectorAll('.si-list-item')];

    siS.forEach(s => {
        updateItem(s, 'pending')

        let datetime = +s.getAttribute('--data-datetime');
        
        let dateNow = performance.now();

        // console.log("TIME COMPARISONS")
        // console.log(Date.now())
        // console.log(dateNow)

        let timeLeft = (datetime - Date.now());

        // 43,200,000 = 12 hours

        let hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let minutes = Math.floor(timeLeft / 1000 / 60);
        let seconds = Math.floor(timeLeft / 1000);

        let timeobj = {hours:hours,minutes:minutes,seconds:seconds}

        // console.log("MS",timeLeft);
        // console.log("SECONDS",timeLeft / 1000);
        // console.log("MINUTES",timeLeft / 1000 / 60);
        // console.log("HOURS",timeLeft / (1000 * 60 * 60));

        
      handleTimeConstraints(timeobj,s)
    })
} else {
  console.warn('pending list items')
}
}

function handleTimeConstraints(obj,li) {
  if(!obj || !li){
    return false;
  }
  const {hours,minutes,seconds} = obj

  // console.log(obj)

  // console.log(minutes)

  if(!hours || hours < 1) {
    let x_hour_warning = Object.keys(time_constraints['hour']).find(x => (Number(x) - hours) === 1 ) || false;

      x_hour_warning ? console.log(x_hour_warning + " hour warning !") : null;

    if(!minutes || minutes < 1){

      if(!seconds || seconds < 1) {
      // handletimeout
        updateItem(li, 'in-progress')
      } else {
        // handle seconds (only)
      }
    } else {
      // handle minutes and seconds
      let x_minute_warning = Object.keys(time_constraints['minute']).find(x => (Number(x) - minutes) === 0 ) || false;

      x_minute_warning ? console.log(x_minute_warning + " minute warning !") : null;
    }
    
  } else if (hours && hours > 0) {
    // handle hours, minutes and seconds
    let x_hour_warning = Object.keys(time_constraints['hour']).find(x => (Number(x) - hours) === 1 ) || false;

      x_hour_warning ? console.log(x_hour_warning + " hour warning !") : null;
  } else {
    console.log(undefined)
  }
}

function updateItem(element, status) {
  switch(true){
    case status === 'pending':
      element.classList.remove('bg-red')
      element.classList.remove('bg-green')

      element.classList.add('bg-yellow')

    break;
    case status === 'in-progress':
      element.classList.remove('bg-red')
      element.classList.remove('bg-yellow')
      
      element.classList.add('bg-green')

      // disable reservations (join and leave)

      const reservations = [...element.children].filter(child => /(leave|join)/gi.test(child.textContent))
      reservations.map(r => r.classList.add('no-display'))


    break;
    case status === 'completed':
      element.classList.remove('bg-green')
      element.classList.remove('bg-yellow')
      
      element.classList.add('bg-red')
    break;

    default:
      console.log(undefined)
    break;
  }
}