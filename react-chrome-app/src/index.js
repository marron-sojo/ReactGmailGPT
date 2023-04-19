import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const observer = new MutationObserver(function (mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "childList" &&
      mutation.addedNodes.length > 0 &&
      mutation.target === document.body
    ) {
      const addedNode = mutation.addedNodes[0];
      const newWindow = addedNode.closest('div[aria-label="New Message"]');

      if (newWindow) {
        const sendButton = newWindow.querySelector('div[data-tooltip*="Send"]');
        // Create a new icon element
        const icon = document.createElement("div");
        icon.innerHTML = "🍎";
        icon.title = "Click here to launch your email!";
        icon.className = "icon-btn"; // Add a class name to the icon element

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
  if (e.target.innerHTML === "🍎" && !isModalShowing) {
    const appRoot = document.createElement("div");
    appRoot.id = "app-root";
    document.body.appendChild(appRoot);

    const root = ReactDOM.createRoot(appRoot);
    root.render(
      <React.StrictMode>
        <App onClose={() => document.getElementById("app-root").remove()} onModalClose={() => (isModalShowing = false)}/>
      </React.StrictMode>
    );
    isModalShowing = true;
  }
});

observer.observe(document.body, { childList: true });
