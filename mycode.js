// Create new arrays for our lists
// Each list item will be included in this array as an object with 2 properties, one for text and another one for the status
let shoppingList = new Array;
let todoList = new Array;
let activeList = new Array;
// The list which is present in the page:
let activeListItems = document.querySelector('.activeTab').id;
console.log(activeListItems);

// First we run the function which gets the fitting data from the localStorage
updateTabs();
// getExistingList();


function updateTabs () {
    let tabLists = document.querySelectorAll('.listWrapper');
    console.log(tabLists);
    let tabLabels = document.querySelectorAll('.menu li');
    console.log(tabLabels);
    tabLabels.forEach((tab, i) => {
        tab.addEventListener('click', e => {
            // remove the activeTab class from all the tabs
            tabLabels.forEach(tab => {
                tab.classList.remove('activeTab');
            })
            // remove the activeList class from all the listWrappers
            // add the hidden class to all the listWrappers
            tabLists.forEach(list => {
                list.classList.remove('activeWrapper');
                list.classList.add('hidden');
            });
            // add the activeTab class to the clicked tab 
            tab.classList.add('activeTab');
            activeListItems = document.querySelector('.activeTab').id;
            // add the activeList class to the i-th list
            // console.log(tabLists[i]);
            tabLists[i].classList.add('activeWrapper');
            tabLists[i].classList.remove('hidden');
            activeList = JSON.parse(localStorage.getItem(`${activeListItems}`));
            getExistingList();
            updateButtons();
        })
   
    })
  
};
// ** Function **
// get existing list items from the localStorage 
// if there are any present run fillAndDisplayList function to populate the list
function getExistingList () {
    // If there are list items in storage :
    if (localStorage.getItem(`${activeListItems}`)){
        console.log('there is stuff in local storage');
        console.log(`The active array is:${activeList}` )
        // Save parse the string into an usable object and save it in the shoppingList array
        activeList = JSON.parse(localStorage.getItem(`${activeListItems}`));
        console.log(`Tartalma: ${activeList}`);
        // Populate the list with the storage data
        fillAndDisplayList();
        return;
    } else {
        // If NO todos in storage - continue
        return 'You do not have any list items now \nclick the "+" button to add more';
    }
}

// ** Function **
function addNewItem(){
    // Only add a new list item if there is a value in the input
    const newestListItem = document.querySelector('#item-to-add').value;
    if(newestListItem){
        // create an object with the input value as text
        // and a default of not checked
        const listObject = {
        text : newestListItem,
        isItDone : false 
        }
        // add the new list item to the active list array
        activeList.push(listObject);
        // overwrite the list in the storage
        localStorage.setItem(`${activeListItems}`, JSON.stringify(activeList));
        // run the populate list function
        fillAndDisplayList();
      
    } else {
        // display error cause empty
        // TODO: display this error for user
        return 'You must write something in the box';
    }
}

// ** Function **
// Populates the list in the HTML
function fillAndDisplayList () {
    // Delete the current list ;
    const list = document.querySelector('.activeWrapper .list')
    list.innerHTML = '';
    // Create a new item in the list for every item in the shoppingList array
    if (activeList){
        activeList.forEach(item =>{
            const condition = item.isItDone;
            itemWrapper = document.createElement('div');
            itemWrapper.classList.add('itemWrapper');
            // for the condition, we only want to add a class if it is not done yet, also false
            //   if it is true we don"t add an additional class
            itemWrapper.innerHTML = `
            <div class="itemText">${item.text}</div>
            <div class="checkbox ${condition == false ? 'notdoneyet': ''}"></div>
            `
            list.appendChild(itemWrapper);
            updateStrikethrough();
            return;
        })
    } 
  // We call update boxes here because we want our query selector to select the newly created boxes too
  updateCheckBoxes()
}

// ** Function **
// if a checkbox is clicked, update the information of the list and display it in the page
// This function is executed every time the list is populated, in order to get the new boxes
function updateCheckBoxes () {
    let boxes = document.querySelectorAll('.activeWrapper .checkbox');
    boxes.forEach((box, i) => {
        box.addEventListener('click', e => {
            // toggle the notdoneyet class on and off
            box.classList.toggle('notdoneyet');
            if(box.classList.contains('notdoneyet')){
                // this box should be set to false in the array
                activeList[i].isItDone = false;
            } else {
                // this box should be set to true in the array
                activeList[i].isItDone = true;
            }
            // update localStorage as well (not only the array)
            localStorage.setItem(`${activeListItems}`, JSON.stringify(activeList));
            updateStrikethrough();
        })
    })
  return;
}

// ** Function **
// This function will get the corresponding text of every checked box and strike it through
function updateStrikethrough() {
    //get boxes
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
    })
    return;
}

// *** Add (+) Button *** //
// if addButton (+) is clicked then run addNewItem and reset the value of the input field
document.querySelector('#add-button').addEventListener('click', e=>{
    // prevent default is necessary because the button is inside a form.
    // we do not want to reload the page
    e.preventDefault();
    addNewItem();
    // reset the input value to make it more user friendly
    document.querySelector('input').value = ''
})

// *** Mark All as completed Button *** //
function updateButtons() {
    // if markAll is clicked then remove the 'notdoneyet' class from all the list items and update the list and localstorage
    document.querySelector('.activeWrapper .markAllCompleted').addEventListener('click', e=>{
        e.preventDefault();
        let boxes = document.querySelectorAll('.activeWrapper .checkbox');
        boxes.forEach((box, i) => { 
            box.classList.remove('notdoneyet');
            // this box should be set to true in the array
            activeList[i].isItDone = true;
            // update the localStorage
            localStorage.setItem(`${activeListItems}`, JSON.stringify(activeList));
            updateStrikethrough();
        })
    })

    // *** Clear All Button *** //
    // if clear all is clicked then update the array and localStorage and repopulate the list
    document.querySelector('.activeWrapper .clearCompleted').addEventListener('click', e=>{
        e.preventDefault();
        // selects all the items that have their isItDone property set to false. Others are ignored, redefining the array
        activeList = activeList.filter(item => item.isItDone == false );
        // update the localStorage
        localStorage.setItem(`${activeListItems}`, JSON.stringify(activeList));
        fillAndDisplayList();
})
}