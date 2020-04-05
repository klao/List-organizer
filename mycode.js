// Variable that will contain the list of items for the active tab.
// Each list item will be included in this array as an object with 2
// properties, one for the text and one for the status.
let activeList;

// The list which is initially active in the page:
let activeListName = document.querySelector('.activeTab').id;
console.log(`At start active: ${activeListName}`);

initializeTabs();
initializeButtons();
// Get the data for the initially active tab from the localStorage:
updateActiveList();


function initializeTabs() {
    let tabLists = document.querySelectorAll('.listWrapper');
    console.log(tabLists);
    let tabLabels = document.querySelectorAll('.menu li');
    console.log(tabLabels);
    tabLabels.forEach((tab, i) => {
        tab.addEventListener('click', e => {
            // remove the activeTab class from all the tabs
            tabLabels.forEach(tab => {
                tab.classList.remove('activeTab');
            });
            // remove the activeList class from all the listWrappers
            // add the hidden class to all the listWrappers
            tabLists.forEach(list => {
                list.classList.remove('activeWrapper');
                list.classList.add('hidden');
            });
            // add the activeTab class to the clicked tab
            tab.classList.add('activeTab');
            activeListName = document.querySelector('.activeTab').id;
            // add the activeList class to the i-th list
            // console.log(tabLists[i]);
            tabLists[i].classList.add('activeWrapper');
            tabLists[i].classList.remove('hidden');
            updateActiveList();
        });
    });
}

// ** Function **
// get existing list items from the localStorage
// if there are any present run fillAndDisplayList function to populate the list
function updateActiveList() {
    console.log(`The active array is: ${activeListName}`);
    activeList = JSON.parse(localStorage.getItem(activeListName));
    // If there are list items in storage :
    if (activeList) {
        console.log('there is stuff in local storage');
        console.log('Active array contents:', activeList);
        fillAndDisplayList();
    } else {
        // If NO todos in storage - continue
        console.log('You do not have any list items now \nclick the "+" button to add more');
        activeList = [];
    }
}

// ** Function **
function addNewItem() {
    // Only add a new list item if there is a value in the input
    const newestListItem = document.querySelector('#item-to-add').value;
    if(newestListItem){
        // create an object with the input value as text
        // and a default of not checked
        const listObject = {
            text : newestListItem,
            isItDone : false
        };
        console.log(activeList);
        console.log(listObject);
        // add the new list item to the active list array
        activeList.push(listObject);
        // overwrite the list in the storage
        localStorage.setItem(activeListName, JSON.stringify(activeList));
        // run the populate list function
        fillAndDisplayList();
    } else {
        // display error cause empty
        // TODO: display this error for user
        console.log('You must write something in the box');
    }
}

// ** Function **
// Populates the list in the HTML
function fillAndDisplayList() {
    // Delete the current list ;
    const list = document.querySelector('.activeWrapper .list');
    list.innerHTML = '';
    // Create a new item in the list for every item in the activeList array
    activeList.forEach(item => {
        const condition = item.isItDone;
        const itemWrapper = document.createElement('div');
        itemWrapper.classList.add('itemWrapper');
        // for the condition, we only want to add a class if it is not done yet, also false
        //   if it is true we don"t add an additional class
        itemWrapper.innerHTML = `
            <div class="itemText">${item.text}</div>
            <div class="checkbox ${condition == false ? 'notdoneyet': ''}"></div>
            `;
        list.appendChild(itemWrapper);
    });
    updateStrikethrough();
    // We call update boxes here because we want our query selector to select the newly created boxes too
    updateCheckBoxes();
}

// ** Function **
// if a checkbox is clicked, update the information of the list and display it in the page
// This function is executed every time the list is populated, in order to get the new boxes
function updateCheckBoxes () {
    let boxes = document.querySelectorAll('.activeWrapper .checkbox');
    boxes.forEach((box, i) => {
        box.addEventListener('click', e => {
            // toggle the notdoneyet class
            box.classList.toggle('notdoneyet');
            if (box.classList.contains('notdoneyet')) {
                activeList[i].isItDone = false;
            } else {
                activeList[i].isItDone = true;
            }
            // update localStorage as well (not only the array)
            localStorage.setItem(activeListName, JSON.stringify(activeList));
            updateStrikethrough();
        });
    });
}

// ** Function **
// Strike through all the items for which the box is checked
function updateStrikethrough() {
    let boxes = document.querySelectorAll('.activeWrapper .checkbox');
    boxes.forEach(box => {
        if(!box.classList.contains('notdoneyet')){
            // if the box doesn't contain the 'notdoneyet' class
            // add the class 'marked' to the parent element to strike through the text
            box.parentElement.classList.add('marked');
        } else if (box.classList.contains('notdoneyet')) {
            // if the box contains the 'notdoneyet' class
            // add the remove 'marked' to the parent element to not to be striked through
            box.parentElement.classList.remove('marked');
        }
    });
}

function initializeButtons() {
    // *** Add (+) Button *** //
    // if addButton (+) is clicked then run addNewItem and reset the value of the input field
    document.querySelector('#add-button').addEventListener('click', e => {
        // prevent default is necessary because the button is inside a form.
        // we do not want to reload the page
        e.preventDefault();
        addNewItem();
        // reset the input value to make it more user friendly
        document.querySelector('input').value = '';
    });

    // *** Mark All as completed Button(s) *** //
    // if markAll is clicked then remove the 'notdoneyet' class from all the list items and update the list and localstorage
    for (let button of document.querySelectorAll('.markAllCompleted')) {
        button.addEventListener('click', e => {
            e.preventDefault();
            let boxes = document.querySelectorAll('.activeWrapper .checkbox');
            boxes.forEach((box, i) => {
                box.classList.remove('notdoneyet');
                // this box should be set to true in the array
                activeList[i].isItDone = true;
                // update the localStorage
                localStorage.setItem(activeListName, JSON.stringify(activeList));
                updateStrikethrough();
            });
        });
    }

    // *** Clear All Button(s) *** //
    // if clear all is clicked then update the array and localStorage and repopulate the list
    for (let button of document.querySelectorAll('.clearCompleted')) {
        button.addEventListener('click', e => {
            e.preventDefault();
            // selects all the items that have their isItDone property set to false. Others are ignored, redefining the array
            activeList = activeList.filter(item => item.isItDone == false );
            // update the localStorage
            localStorage.setItem(activeListName, JSON.stringify(activeList));
            fillAndDisplayList();
        });
    }
}
