// variable to store todo list items
let TODO_LIST_ITEMS = []
let CURRENT_SELECTED_TODO_ITEM_ID = null //variable for updating current selected todo item

/**
 * function to get element by Id 
 * @param {*} id 
 * @returns 
 */
const getElementById = (id) => {
  return document.getElementById(`${id}`)
}
// Initializing all required variables 
const ADD_TODO_ITEM_FORM = getElementById("add-todo-form")
const UPDATE_TODO_ITEM_FORM = getElementById("update-todo-form")
const ADD_TODO_ITEM_FORM_INPUT = getElementById("add-todo-form-input")
const UPDATE_TODO_ITEM_FORM_INPUT = getElementById("update-todo-form-input")
const TODO_WRAPPER_ELEMENT = getElementById("todo-wrapper")
const TODO_LIST_ITEMS_WRAPPER = getElementById("list-items")

/**
 * function to insert a new item to list
 * @param {*} description 
 * @returns 
 */
const addItemToList = (description) => {
  const newItem = {
    id: TODO_LIST_ITEMS.length + 1,
    description,
    isCompleted: false
  }
  TODO_LIST_ITEMS.push(newItem)
  setItemsToLocalStorage(TODO_LIST_ITEMS)
  clearFormInputs()
  loadTodoItems()
  return
}

/**
 * function to update the todo item
 * @param {*} item 
 * @returns 
 */
const updateItem = (item) => {
  const indexOfItem = TODO_LIST_ITEMS.findIndex(t => t.id == item.id)
  const updatedItem = {
    ...TODO_LIST_ITEMS[indexOfItem],
    ...item
  }
  TODO_LIST_ITEMS[indexOfItem] = updatedItem
  setItemsToLocalStorage(TODO_LIST_ITEMS)
  loadTodoItems()
  CURRENT_SELECTED_TODO_ITEM_ID = null
  clearFormInputs()
  loadTodoItems()
  return
}

/**
 * function to delete item from List
 * @param {*} itemId 
 * @returns 
 */
const deleteItemFromList = (itemId) => {
  const userConsent = confirm("Are you sure you want to delete this item ?")
  if (userConsent) {
    TODO_LIST_ITEMS = TODO_LIST_ITEMS.filter(i => i.id !== itemId)
    setItemsToLocalStorage(TODO_LIST_ITEMS)
    clearFormInputs()
    loadTodoItems()
  }
  return
}

/**
 * function to toggle complete/inComplete a todo item
 * @param {*} event 
 * @param {*} itemId 
 */
const toggleComplete = (event, itemId) => {
  if (event.target.classList.contains("todo-item") || event.target.classList.contains("not-completed") || event.target.classList.contains("completed")) {
    const todoItemDetails = TODO_LIST_ITEMS.find(i => i.id == itemId)

    const userConsent = confirm(`Are you sure you want to Mark this item as ${todoItemDetails.isCompleted ? "Un Completed" : "completed"}.`)
    if (userConsent) {
      TODO_LIST_ITEMS = TODO_LIST_ITEMS.map(i => {
        if (i.id == itemId) {
          i.isCompleted = !i.isCompleted
        }
        return i
      })
      setItemsToLocalStorage(TODO_LIST_ITEMS)
    }
    loadTodoItems()
  }

}
/**
 * function to clear the list item wrapper before performing any modification to the UI
 * @returns 
 */
const clearListItemWrapper = () => TODO_LIST_ITEMS_WRAPPER.innerHTML = '';


//function to load todo's to the UI
const loadTodoItems = () => {
  TODO_LIST_ITEMS = getItemsFromLocalStorage()
  // clearing the list item wrapper first
  clearListItemWrapper()
  // dynamically creating the UI for list items
  TODO_LIST_ITEMS.forEach(todoItem => {
    const todoItemElement = document.createElement("div")
    todoItemElement.innerHTML = createTodoItemElement(todoItem)
    TODO_LIST_ITEMS_WRAPPER.appendChild(todoItemElement)
  })
}

/**
 * function to update the UI for updating an item
 * @param {*} todoItemId 
 */
const showItemInEditMode = (todoItemId) => {
  // we have to hide the add todo form and show the update todo form
  ADD_TODO_ITEM_FORM.style.display = 'none';
  UPDATE_TODO_ITEM_FORM.style.display = 'block';
  const todoItemDetails = TODO_LIST_ITEMS.find(t => t.id == todoItemId)
  UPDATE_TODO_ITEM_FORM_INPUT.value = todoItemDetails?.description || ""
  CURRENT_SELECTED_TODO_ITEM_ID = todoItemId
}

// function to create the todoElement for the UI
const createTodoItemElement = (todoItem) => {
  return `
      <div class="todo-item" id=${todoItem.id} onclick="toggleComplete(event,${todoItem.id})">
        <p class="${todoItem.isCompleted ? "completed" : "not-completed"}">${todoItem.description}</p>
        <div>
          <i class="fa-solid fa-pen-to-square" onclick="showItemInEditMode(${todoItem.id})"></i>
          <i class="fa-solid fa-trash" onclick="deleteItemFromList(${todoItem.id})"></i>
        </div>
      </div>`;
}

/**
 * function to handle the add to Event
 * @param {*} event 
 * @returns 
 */
const handleOnSubmit = (event) => {
  event.preventDefault()
  const userInput = event?.target?.children[0]?.value || '';
  if (!userInput || !userInput?.length) {
    showEmptyInputError("ADD")
    return;
  }
  addItemToList(userInput)

  return;
}

/**
 * function to handle the update todo Event
 * @param {*} event 
 * @returns 
 */
const handleOnUpdateSubmit = (event) => {
  event.preventDefault()
  const userInput = event?.target?.children[0]?.value || ""

  if (!userInput || !userInput?.length) {
    showEmptyInputError("UPDATE")
    return;
  }
  updateItem({ id: CURRENT_SELECTED_TODO_ITEM_ID, description: userInput })
}

/**
 * function to show the error in case user enters empty todo
 * @param {*} formType 
 */
const showEmptyInputError = (formType) => {
  if (formType == 'ADD') {
    ADD_TODO_ITEM_FORM_INPUT.classList.add("invalid-input")
  }
  if (formType == 'UPDATE') {
    UPDATE_TODO_ITEM_FORM_INPUT.classList.add("invalid-input")
  }
  hideEmptyInputError()
}

/**
 * function to hide error from input
 */
const hideEmptyInputError = () => {
  setTimeout(() => {
    ADD_TODO_ITEM_FORM_INPUT.classList.remove("invalid-input")
    UPDATE_TODO_ITEM_FORM_INPUT.classList.remove("invalid-input")
  }, 700)
}

/**
 * function to clear form inputs
 */
const clearFormInputs = () => {
  ADD_TODO_ITEM_FORM_INPUT.value = "";
  UPDATE_TODO_ITEM_FORM_INPUT.value = ""
  UPDATE_TODO_ITEM_FORM.style.display = "none";
  ADD_TODO_ITEM_FORM.style.display = "block";
}

/**
 * function to get items from Local storage
 * @returns 
 */
const getItemsFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("TODO_LIST_ITEMS")) || []
}
/**
 * function to set items to local storage
 * @param {*} items 
 * @returns 
 */
const setItemsToLocalStorage = (items) => {
  localStorage.setItem("TODO_LIST_ITEMS",JSON.stringify(items))
  return
}


//Registering the event to load the items on the UI
window.addEventListener('load', () => {
  loadTodoItems()
})