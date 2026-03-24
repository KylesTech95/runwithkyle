import { getMonth } from "../main.js";
export default function generateCalendarListItem(datetime) {
    console.log(datetime)
    let {date,time,int} = datetime;
    
    // date data
    let [y,m,d] = date.split`-`
    // time data
    let [h,min,s] = time.split`:`

    // determing AM || PM
    let morning_or_evening = 'AM'
    if(+h >= 12) {
        if(+h > 12){
            h = Number(h) - 12;
        } else {
            h = 12;
        }
        morning_or_evening = 'PM'
    } 
    if(+h < 1 && +h > -1) {
        h = Number(h) + 12;
        morning_or_evening = 'AM'
    }

    
    // create li
    const list_item = document.createElement('li')
    // ||
    // \/

    // containers
    const [dateContainer,timeContainer] = [document.createElement('div'),document.createElement('div')]

    // contents within containers

    // 1. date container contents
    const [month,day] = [document.createElement('p'),document.createElement('h4')]
    
    // 2. time container contents
    const hours_minutes_seconds = document.createElement('p')

    // ||
    // ||
    // \/

    // add text to datetime vars
    month.textContent = getMonth(m);
    day.textContent = d

    // take the array given above > split and join with :
    // let hms = [h,min,s].join`:` + ` ${morning_or_evening}`
    let hms = [h,min].join`:` + ` ${morning_or_evening}`

    hours_minutes_seconds.textContent = hms;

    // ||
    // ||
    // \/

    // append children to parents
    dateContainer.append(month)
    dateContainer.append(day)

    timeContainer.append(hours_minutes_seconds)

    list_item.append(dateContainer)
    list_item.append(timeContainer)

    console.log(dateContainer)

    // ||
    // ||
    // \/

    // Add classes / setAttribute to elements
    list_item.setAttribute('--data-datetime', int)
    dateContainer.setAttribute('id','date-container')
    timeContainer.setAttribute('id','time-container')


    list_item.classList.add('si-list-item');

    return list_item;

}
{/* <ul id="scheduled-item-list-container">
            <li class="si-list-item">
                <div id="date-container">
                    <p>MAY</p>
                    <h4>15</h4>
                </div>
            </li>
            <li class="si-list-item">
                <div id="date-container">
                    <p>Jun</p>
                    <h4>4</h4>
                </div>
            </li>
            <li class="si-list-item">
                <div id="date-container">
                    <p>Jul</p>
                    <h4>11</h4>
                </div>
            </li>
            <li class="si-list-item">
                <div id="date-container">
                    <p>Aug</p>
                    <h4>8</h4>
                </div>
            </li>
        </ul> */}