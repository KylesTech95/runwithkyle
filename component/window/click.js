import { exitModal } from "../modal.js";
import { modal_enabled } from "../../main.js";
const modal = document.getElementById('modal-container')

// main function 
export default function global_window_click(e,type){
    // define target
    const target = e.target || window;

    if(type === 'modal'){
        // if modal is showing
        if(modal_enabled) {
            console.log('modal is enabled')
            // exit modal
            // handleModlaExit(target)
        }
    }
    





}

function handleModlaExit(target) {
    // exit modal method
        if(target.id !== modal.id && target.id !== 'modal-exit') {
            exitModal()
        }

}