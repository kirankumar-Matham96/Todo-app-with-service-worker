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
  let card = document.querySelector(cardSelector);
  let cardText = document.querySelector(`${cardSelector}>P`);
  if (card && cardText) {
    card.style.backgroundColor = colorPicker.value;
    cardText.style.color = getContrastColor(colorPicker.value);
    card.style.transition = "all 0.3s ease";
  }
}

// Example usage: Change card color when user selects a new color
document.querySelector(".color-input").addEventListener("input", function () {
  changeCardColor("#card-1", this);
});
