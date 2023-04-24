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

      // todo: fix this probably so that it's imported only once
      var preconnectLink1 = document.createElement("link");
      preconnectLink1.rel = "preconnect";
      preconnectLink1.href = "https://fonts.googleapis.com";
      document.head.appendChild(preconnectLink1);

      var preconnectLink2 = document.createElement("link");
      preconnectLink2.rel = "preconnect";
      preconnectLink2.href = "https://fonts.gstatic.com";
      preconnectLink2.setAttribute("crossorigin", "");
      document.head.appendChild(preconnectLink2);

      var fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;800&family=Nunito+Sans:wght@200;300;600&display=swap";
      document.head.appendChild(fontLink);

      // todo: fix this icon import thingy probably so that it's imported only once
      // fused to load the script '<URL>' because it violates the following
      // Content Security Policy directive: "script-src 'self' 'wasm-unsafe-eval'
      // 'inline-speculation-rules' <URL> <URL>". Note that 'script-src-elem' was not
      // explicitly set, so 'script-src' is used as a fallback.
      // const script = document.createElement('script');
      // script.src = 'https://kit.fontawesome.com/63203e6c13.js';
      // script.crossOrigin = 'anonymous';
      // document.head.appendChild(script);

      if (newWindow) {
        const sendButton = newWindow.querySelector('div[data-tooltip*="Send"]');
        // Create a logo icon element
        const icon = document.createElement("div");
        const iconWrapper = document.createElement("div");
        const iconImg = document.createElement("img");
        iconImg.src = chrome.runtime.getURL("logo.png"); // Set the logo URL
        iconImg.style.width = "24px"; // Set the desired width
        iconImg.style.height = "24px"; // Set the desired height
        iconImg.style.cursor = "pointer"; // Set the cursor style to pointer

        iconWrapper.style.display = "inline-flex";
        iconWrapper.style.alignItems = "center";
        iconWrapper.style.justifyContent = "center";
        iconWrapper.style.height = "40px"; // Set the desired height for the wrapper

        iconWrapper.appendChild(iconImg);
        icon.appendChild(iconWrapper);
        icon.title = "Click here to launch your email!";
        icon.className = "icon-btn";

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

document.addEventListener("click", function (e) {
  if (
    e.target.tagName === "IMG" &&
    e.target.src === chrome.runtime.getURL("logo.png") &&
    !isModalShowing
  ) {
    const appRoot = document.createElement("div");
    appRoot.id = "app-root";
    document.body.appendChild(appRoot);

    const root = ReactDOM.createRoot(appRoot);
    root.render(
      <React.StrictMode>
        <App
          onClose={() => document.getElementById("app-root").remove()}
          onModalClose={() => (isModalShowing = false)}
        />
      </React.StrictMode>
    );
    isModalShowing = true;
  }
});

observer.observe(document.body, { childList: true });
