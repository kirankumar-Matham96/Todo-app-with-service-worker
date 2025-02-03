"use strict";
const mainInput = document.querySelector("#input");
const addTodoBtn = document.querySelector("#add-todo-btn");
const listContainer = document.querySelector(".list-container");

addTodoBtn.addEventListener("click", () => {
  const newTodo = mainInput.value;

  if (newTodo.length === 0) {
    alert("please add text to add new todo!");
    mainInput.focus();
    return;
  }

  addTodo(newTodo);
  mainInput.value = "";
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

document.addEventListener("DOMContentLoaded", () => addListenerToColorInputs);

const getUniqueId = () => {
  return Date.now();
};

const addTodo = (data) => {
  const newListItem = document.createElement("li");
  newListItem.className = "list-item";
  newListItem.id = `card-${getUniqueId()}`;
  newListItem.innerHTML = `<p class="item-text">${data}</p>
        <div class="list-button-group">
        <div title="Change card color">
                <input type="color" class="color-input" value="#fedd00" />
                </div>
            <div>
            <button class="btn edit-btn">Edit</button>
                <button class="btn delete-btn">Delete</button>
            </div>
        </div>
        `;

  listContainer.appendChild(newListItem);
  addListenerToColorInputs();
};
