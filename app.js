"use strict";

/**
 * registering service worker
 */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./todo-service-worker.js")
    .then(() => console.log("Service worker registered!"))
    .catch((err) => console.error(`Failed to register service worker: ${err}`));
}

let todoList = [];

const mainInput = document.querySelector("#input");
const addTodoBtn = document.querySelector("#add-todo-btn");
const listContainer = document.querySelector(".list-container");

/**
 * adds new todo.
 */
addTodoBtn.addEventListener("click", () => {
  const newTodo = mainInput.value;

  // alerts the user if the input is empty
  if (newTodo.length === 0) {
    alert("please add text to add new todo!");
    mainInput.focus();
    return;
  }

  // creates new todo
  addTodo(newTodo);

  // resets the main input and adds focus.
  mainInput.value = "";
  mainInput.style.height = "40px";
  mainInput.focus();
});

/**
 * Calculates the color brightness and returns the suitable color for the text.
 * @param {string} hex
 * @returns hex color code (string)
 */
function getContrastColor(hex) {
  // Convert hex to RGB
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  // Calculate brightness using the luminance formula
  let brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black for light backgrounds and white for dark backgrounds
  return brightness > 128 ? "#000000" : "#FFFFFF";
}

/**
 * Changes the background color of the todo card.
 * @param {string} cardSelector
 * @param {HTMLElement} colorPicker
 */
function changeCardColor(cardSelector, colorPicker) {
  let card = document.getElementById(cardSelector);
  let cardText = document.querySelector(`#${cardSelector}>P`);

  if (card && cardText) {
    // updating the card bg color
    card.style.backgroundColor = colorPicker.value;

    // updating the todo bgColor data in the list
    const itemFound = todoList.find((todo) => todo.id === cardSelector);
    itemFound.bgColor = colorPicker.value;

    // updates the text color that suites the bg color
    cardText.style.color = getContrastColor(colorPicker.value);
    card.style.transition = "all 0.3s ease";

    // updates the local storage with updated list
    localStorage.setItem("todos", JSON.stringify(todoList));
  }
}

/**
 * Adds the event listener to color input of each todo card.
 */
const addListenerToColorInputs = () => {
  const colorInputs = document.querySelectorAll(".color-input");

  colorInputs.forEach((input) => {
    const cardId = input.parentElement.parentElement.parentElement.id;
    input.addEventListener("input", () => {
      changeCardColor(cardId, input);
    });
  });
};

/**
 * sets the element height as the text grows. Maximum height set to 150px.
 * @param {HTMLElement} textarea
 */
function autoResize(textarea) {
  textarea.style.height = "40px";
  const newHeight = Math.min(textarea.scrollHeight, 150);
  textarea.style.height = `${newHeight}px`;
}

/**
 * adjusts the main input(textarea) height as user types.
 */
document.addEventListener("input", function (event) {
  if (event.target.tagName.toLowerCase() === "textarea") {
    autoResize(event.target);
  }
});

/**
 * On load, focusses the main input and fetches the data.
 */
document.addEventListener("DOMContentLoaded", () => {
  mainInput.focus();
  fetchData();
});

/**
 * @returns current date in milliseconds
 */
const getUniqueId = () => {
  return Date.now();
};

/**
 * Creates todo element.
 * @param {object} item
 */
const createListItem = (item) => {
  const newListItem = document.createElement("li");
  newListItem.className = "list-item";
  newListItem.id = item.id;
  newListItem.style.backgroundColor = item.bgColor;
  newListItem.innerHTML = `<p class="item-text" style="color: ${getContrastColor(
    item.bgColor
  )}; text-decoration: ${item.completed ? "line-through" : "none"}">${
    item.title
  }</p>
        <div class="list-button-group">
          <div title="Change card color">
            <input type="color" class="color-input" value="${item.bgColor}"/>
          </div>
          <div>
            <button class="btn close-btn" onclick="toggleComplete('${
              item.id
            }')">
              <img src="${
                item.completed
                  ? "./images/checkmark-circle-filled.png"
                  : "./images/checkmark-circle-02-stroke-sharp.svg"
              }" alt="to be completed"/>
            </button>          
            <button class="btn edit-btn" onclick="showUpdateForm('${item.id}')">
            <img src="./images/edit.png" alt="edit" />
            </button>
            <button class="btn delete-btn" onclick="deleteTodo('${item.id}')">
              <img src="./images/delete.png" alt="edit" />
            </button>
          </div>
        </div>
        `;

  listContainer.appendChild(newListItem);
  // addListenerToColorInputs();
};

/**
 * Creates each todo UI element from the list and adds
 * event listeners to every input in the element.
 */
const displayTodoList = () => {
  listContainer.innerHTML = "";

  // creates todo elements from the list
  todoList.forEach((todo) => {
    createListItem(todo);
  });

  addListenerToColorInputs(); // adds event listeners
};

/**
 * adds new todo to the list and re-renders the UI.
 * @param {string} content
 */
const addTodo = (content) => {
  // object construction
  const newTodo = {
    title: content,
    id: `card-${getUniqueId()}`,
    bgColor: "#fedd00",
  };

  todoList.unshift(newTodo); // adds the new todo at the top of the list
  localStorage.setItem("todos", JSON.stringify(todoList)); // updates the localstorage
  displayTodoList(); // updates the UI
};

/**
 * Gets the desired card and replaces the inner content with updating content format.
 * @param {string} cardId
 */
const showUpdateForm = (cardId) => {
  const cardEl = document.getElementById(cardId); // get the element
  const item = todoList.find((todo) => todo.id === cardId); // get the item from the list
  cardEl.innerHTML = ""; // clear the content

  // create new content with the existing data (to be edited by the user)
  cardEl.innerHTML = `<textarea class="item-text-input" style="color: ${getContrastColor(
    item.bgColor
  )}">${item.title}</textarea>
        <div class="list-button-group">
          <div title="Change card color">
            <input type="color" class="color-input" value="${item.bgColor}"/>
          </div>
          <div>
            <button class="btn update-btn" onclick="updateTodo('${cardId}')">Update</button>
          </div>
        </div>
        `;

  const inputEl = cardEl.querySelector("textarea");
  inputEl.focus(); // auto focus to edit
  inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length); // shows the cursor at the end of the text
  inputEl.caretColor = getContrastColor(item.bgColor); // sets the cursor color to text color (black or white)
};

/**
 * Updates the text and bgColor of the todo card by the id.
 * Once updated, it will updates the localstorage and rerender the entire list in the UI.
 * @param {string} id
 */
const updateTodo = (id) => {
  const cardEl = document.getElementById(id);
  const textEl = cardEl.querySelector(`textarea`);
  const colorEl = cardEl.querySelector(`.color-input`);
  const updatedText = textEl.value;
  const bgColor = colorEl.value;

  // updating the details of the todo
  const index = todoList.findIndex((todo) => todo.id === id);
  todoList[index].title = updatedText;
  todoList[index].bgColor = bgColor;

  // updating the localstorage
  localStorage.setItem("todos", JSON.stringify(todoList));

  // re-rendering the UI
  displayTodoList();
};

/**
 * Deletes the todo
 * @param {string} cardId
 */
const deleteTodo = (cardId) => {
  // removing the item from the list
  todoList = todoList.filter((todo) => todo.id !== cardId);

  // updating the local storage with the new list
  localStorage.setItem("todos", JSON.stringify(todoList));

  // updating the UI (removing the item card with the matching ID)
  const cardElement = document.getElementById(cardId);
  if (cardElement) cardElement.remove();
};

/**
 * Toggles the complete status for a todo.
 * When completed applies the strike on text and vise versa.
 * @param {string} id
 */
const toggleComplete = (id) => {
  let isCompleted;
  todoList = todoList.map((todo) => {
    if (todo.id === id) {
      todo.completed = !todo.completed;
      isCompleted = todo.completed;
    }
    return todo;
  });

  const cardText = document.querySelector(`#${id}>.item-text`);
  const toggleBtnImg = document.querySelector(`#${id}>div>div>.close-btn>img`);
  if (isCompleted) {
    cardText.style.textDecoration = "line-through";
    toggleBtnImg.src = "./images/checkmark-circle-filled.png";
  } else {
    cardText.style.textDecoration = "none";
    toggleBtnImg.src = "./images/checkmark-circle-02-stroke-sharp.svg";
  }
};

/**
 * Converts color component from rgb to hex code.
 * @param {Number} c
 * @returns
 */
const colorComponentToHex = (c) => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

/**
 * Converts RGB to HEX code.
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @returns
 */
const rgbToHex = (r, g, b) => {
  return `#${colorComponentToHex(r)}${colorComponentToHex(
    g
  )}${colorComponentToHex(b)}`;
};

/**
 * Generates random RGB color and returns.
 * @returns random rgb color (string)
 */
const getRandomColor = () => {
  let r = Math.abs(Math.floor(Math.random() * 100 - 225));
  let g = Math.abs(Math.floor(Math.random() * 100 - 225));
  let b = Math.abs(Math.floor(Math.random() * 100 - 225));
  console.log(r, g, b);
  return rgbToHex(r, g, b);
};

/**
 * Fetches the data from an API and and stores in local storage.
 * If the local storage is already populated, it will gt the data from there.
 * @returns void
 */
const fetchData = async () => {
  // checking if local storage has the data
  const cachedTodos = localStorage.getItem("todos");

  // if data exists, it will display it.
  if (cachedTodos) {
    todoList = JSON.parse(cachedTodos);
    displayTodoList();
    return;
  }

  try {
    // fetching the data
    const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
    const data = await resp.json();

    // showing only 10 results from the response
    todoList = data.slice(0, 10);

    // adding additional parameters to every item
    todoList = todoList.map((todo) => {
      // todo.bgColor = "#fedd00";
      todo.bgColor = getRandomColor();
      todo.id = "card-" + todo.id;
      return todo;
    });

    // storing in localstorage
    localStorage.setItem("todos", JSON.stringify(todoList));

    // displaying the data
    displayTodoList();
  } catch (error) {
    console.log(error);
  }
};
