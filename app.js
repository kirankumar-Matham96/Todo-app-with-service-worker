"use strict";
const mainInput = document.querySelector("#input");
const addTodoBtn = document.querySelector("#add-todo-btn");
const listContainer = document.querySelector(".list-container");

let todoList = [];

addTodoBtn.addEventListener("click", () => {
  const newTodo = mainInput.value;

  if (newTodo.length === 0) {
    alert("please add text to add new todo!");
    mainInput.focus();
    return;
  }

  addTodo(newTodo);
  mainInput.value = "";
  mainInput.style.height = "40px";
  mainInput.focus();
});

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

function changeCardColor(cardSelector, colorPicker) {
  let card = document.getElementById(cardSelector);
  let cardText = document.querySelector(`#${cardSelector}>P`);
  if (card && cardText) {
    card.style.backgroundColor = colorPicker.value;
    const itemFound = todoList.find((todo) => todo.id === cardSelector);
    itemFound.bgColor = colorPicker.value;
    cardText.style.color = getContrastColor(colorPicker.value);
    card.style.transition = "all 0.3s ease";
  }
}

const handleCardColor = (cardSelector, colorInputEl) => {
  changeCardColor(cardSelector, colorInputEl);
};

const addListenerToColorInputs = () => {
  const colorInputs = document.querySelectorAll(".color-input");

  colorInputs.forEach((input) => {
    const cardId = input.parentElement.parentElement.parentElement.id;
    input.addEventListener("input", () => {
      handleCardColor(cardId, input);
    });
  });
};

function autoResize(textarea) {
  textarea.style.height = "40px";
  const newHeight = Math.min(textarea.scrollHeight, 150);
  textarea.style.height = `${newHeight}px`;
}

document.addEventListener("input", function (event) {
  if (event.target.tagName.toLowerCase() === "textarea") {
    autoResize(event.target);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  mainInput.focus();
  addListenerToColorInputs();
});

const getUniqueId = () => {
  return Date.now();
};

const deleteTodo = (cardId) => {
  todoList = todoList.filter((todo) => {
    if (todo.id !== cardId) {
      return true;
    } else {
      return false;
    }
  });
  displayTodoList();
};

const createListItem = (item) => {
  const newListItem = document.createElement("li");
  newListItem.className = "list-item";
  newListItem.id = item.id;
  newListItem.style.backgroundColor = item.bgColor;
  newListItem.innerHTML = `<p class="item-text" style="color: ${getContrastColor(
    item.bgColor
  )}">${item.content}</p>
        <div class="list-button-group">
        <div title="Change card color">
                <input type="color" class="color-input" value="${
                  item.bgColor
                }" />
                </div>
            <div>
            <button class="btn edit-btn" onclick="showUpdateForm('${
              item.id
            }')">Edit</button>
                <button class="btn delete-btn" onclick="deleteTodo('${
                  item.id
                }')">Delete</button>
            </div>
        </div>
        `;

  listContainer.appendChild(newListItem);
  addListenerToColorInputs();
};

const displayTodoList = () => {
  listContainer.innerHTML = "";

  todoList.forEach((todo) => {
    createListItem(todo);
  });
};

const addTodo = (data) => {
  const newTodo = {
    content: data,
    id: `card-${getUniqueId()}`,
    bgColor: "#fedd00",
  };

  todoList.unshift(newTodo);
  displayTodoList();
};

const showUpdateForm = (cardId) => {
  const cardEl = document.getElementById(cardId);

  const item = todoList.find((todo) => todo.id === cardId);

  cardEl.innerHTML = "";
  cardEl.innerHTML = `<textarea class="item-text-input" style="color: ${getContrastColor(
    item.bgColor
  )}">${item.content}</textarea>
        <div class="list-button-group">
          <div title="Change card color">
            <input type="color" class="color-input" value="${item.bgColor}"/>
          </div>
          <div>
            <button class="btn edit-btn" onclick="updateTodo('${cardId}')">Update</button>
          </div>
        </div>
        `;

  const inputEl = cardEl.querySelector("textarea");
  inputEl.focus();
  inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);
  inputEl.caretColor = getContrastColor(item.bgColor);
};

const updateTodo = (id) => {
  const textEl = document.querySelector(`#${id}>textarea`);
  const colorEl = document.querySelector(`#${id}>.list-button-group>div>input`);
  const updatedText = textEl.value;
  const bgColor = colorEl.value;
  const index = todoList.findIndex((todo) => todo.id === id);
  todoList[index].content = updatedText;
  todoList[index].bgColor = bgColor;
  displayTodoList();
};

// TODO: Add edit feature
// TODO: Fetch data from an API and show in the list
// TODO: Add service worker for the list items fetch
