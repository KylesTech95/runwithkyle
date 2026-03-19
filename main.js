// vars
const navToggleContainer = document.getElementById('nav-toggle-container')
const nav_container = document.getElementById('nav-list-container')
const nav_container_mobile = document.getElementById('nav-list-container-mobile')
const mobile_nav_open = 'mobile-nav-open';

const maxBars = 2;


// object data
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


navToggleContainer.onclick = toggleNav;