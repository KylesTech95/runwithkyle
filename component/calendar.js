import { getMonth } from "../main.js";
export default function generateCalendarListItem(datetime) {
    console.log(datetime)
    let {date,time} = datetime;
    
    // date data
    let [y,m,d] = date.split`-`
    // time data
    let [h,min,s] = time.split`:`

    
    // create li
    const list_item = document.createElement('li')
    // ||
    // \/

    // create date-container with contents
    const dateContainer = document.createElement('div')
    const [month,day] = [document.createElement('p'),document.createElement('h4')]
    // ||
    // ||
    // \/

    // add text to datetime vars
    month.textContent = getMonth(m);
    day.textContent = d
    
    // ||
    // ||
    // \/

    // append children to parents
    dateContainer.append(month)
    dateContainer.append(day)

    list_item.append(dateContainer)

    console.log(dateContainer)

    // ||
    // ||
    // \/

    // Add classes / setAttribute to elements
    dateContainer.setAttribute('id','date-container')
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