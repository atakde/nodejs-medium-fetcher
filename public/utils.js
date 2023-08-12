// Global variables
let mediumUsername = document.getElementById("medium-username");
let listQuantity = document.getElementById("medium-list-quantity");
let createWidget = document.getElementById("create-widget");
let createWidgetText = document.getElementById("create-widget-text");
let widgetCode = document.getElementById("widget-code-area");

// Function to create the widget
function createMediumWidget() {
    if (mediumUsername.value == "") {
    alert("Please enter your Medium username");
    return;
    }
    if (listQuantity.value == "") {
    alert("Please enter the number of articles you want to display");
    return;
    }
    createWidgetText.style.display = "flex";
    widgetCode.style.display = "flex";
    let mediumUsernameValue = mediumUsername.value;
    let listQuantityValue = listQuantity.value;
    widgetCode.textContent = `![Alt text here](https://nodejs-medium-fetcher.vercel.app/?username=${mediumUsernameValue}&limit=${listQuantityValue}&responseType=svg)(https://medium.com/@${mediumUsernameValue})`;
    }
  
// Create the widget when the button is clicked
createWidget.addEventListener("click", createMediumWidget);
