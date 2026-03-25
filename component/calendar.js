import { getMonth } from "../main.js";
export default function generateCalendarListItem(datetime) {
    console.log(datetime)
    let {date,time,int,type} = datetime;
    
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
    const [dateContainer,timeContainer,typeContainer] = [document.createElement('div'),document.createElement('div'),document.createElement('div')]

    // contents within containers

    // 1. date container contents
    const [month,day] = [document.createElement('p'),document.createElement('h4')]
    
    // 2. time container contents
    const hours_minutes_seconds = document.createElement('p')

    // 3. remove / delete button
    const remove_button = document.createElement('span');

    // 4. type (run walk jog)
    const get_type = document.createElement('h4')

    // ||
    // ||
    // \/

    // add text to datetime vars
    month.textContent = getMonth(m);
    day.textContent = d

    // type textcontent
    get_type.textContent = type;

    // remove button textcontent
    remove_button.textContent = 'X';

    // take the array given above > split and join with :
    // let hms = [h,min,s].join`:` + ` ${morning_or_evening}`
    let hms = [h,+min < 10 ? '0'+min : min].join`:` + ` ${morning_or_evening}`

    hours_minutes_seconds.textContent = hms;

    // ||
    // ||
    // \/

    // append children to parents
    dateContainer.append(month)
    dateContainer.append(day)

    timeContainer.append(hours_minutes_seconds)

    typeContainer.append(get_type)

    list_item.append(dateContainer)
    list_item.append(typeContainer)
    list_item.append(timeContainer)
    list_item.append(remove_button)

    // ||
    // ||
    // \/

    // Add classes / setAttribute to elements
    dateContainer.classList.add('no-pointer')
    timeContainer.classList.add('no-pointer')
    typeContainer.classList.add('no-pointer')

    list_item.setAttribute('--data-datetime', int)
    dateContainer.setAttribute('id','date-container')
    timeContainer.setAttribute('id','time-container')
    typeContainer.setAttribute('id','type-container')

    remove_button.classList.add('remove-button')
    list_item.classList.add('si-list-item');

    return list_item;

}