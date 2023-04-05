import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// create a new MutationObserver object and pass it a callback function
const observer = new MutationObserver(function (mutationsList, observer) {
  // iterate through each mutation in the mutations list
  for (const mutation of mutationsList) {
    // check if a new element has been added to the body
    if (
      mutation.type === "childList" &&
      mutation.addedNodes.length > 0 &&
      mutation.target === document.body
    ) {
      // do something with the new element, such as log a message to the console
      //   console.log('A new element was added to the body:', mutation.addedNodes[0]);

      const addedNode = mutation.addedNodes[0];
      const newWindow = addedNode.closest('div[aria-label="New Message"]');
      console.log(newWindow);
      if (newWindow) {
        const sendButton = document.querySelector('div[data-tooltip*="Send"]');
        // Create a new icon element
        const icon = document.createElement("div");
        icon.innerHTML = "🦧";
        icon.title = "Click here to launch your email!";

        // Add the icon to the parent element of the Send button
        // sendButton.parentNode.insertBefore(icon, sendButton);
        if (
          sendButton &&
          sendButton.parentNode &&
          sendButton.parentNode.parentNode &&
          sendButton.parentNode.parentNode.parentNode
        ) {
          sendButton.parentNode.parentNode.parentNode.insertAdjacentElement(
            "afterend",
            icon
          );
        }
      }
    }
  }
});


let isModalShowing = false;

document.addEventListener('click', function(e) {
    // if '🚀' is clicked, <App/> component appears
    if (e.target.innerHTML === "🦧" && !isModalShowing) {
      // Create a new div element and give it an id
      const appRoot = document.createElement("div");
      appRoot.id = "app-root";
      document.body.appendChild(appRoot);
  
      const root = ReactDOM.createRoot(appRoot);
      root.render(
        <React.StrictMode>
          {/* <App /> */}
          <App onClose={() => document.getElementById("app-root").remove()} />
        </React.StrictMode>
      );
      isModalShowing = true;
    }


});


// call the observer's observe method to start watching for changes to the DOM
observer.observe(document.body, { childList: true });

// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     {/* <App /> */}
//   </React.StrictMode>
// );
