import React, { useEffect, useState } from "react";
import "./App.css";
import SettingModal from "./SettingModal";
import "./Spinner.css";

export default function App({ onClose, onModalClose }) {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState("Write an email that ");
  const [response, setResponse] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApiKey, setIsLoadingApiKey] = useState(false);

  const axios = require("axios");
  const endPoint = "https://api.openai.com/v1/completions";

  useEffect(() => {
    getApiKey();
  }, []);

  const getApiKey = () => {
    chrome.storage.local.get(["apiKey"]).then((result) => {
      console.log("Value currently is " + result.apiKey);
      setApiKey(result.apiKey);
    });
  };

  const tones = [
    "Concise",
    "Professional",
    "Confident",
    "Nice",
    "Passionate",
    "Apologetic",
  ];

  const handleCloseClick = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleSettingClick = () => {
    setIsSettingOpen(true);
  };

  const handleToneClick = (tone) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  // TODO: implement save logic
  // it'd be great to have a window indicating that we are testing the connection
  const handleSaveClick = async () => {
    const isValid = await checkApiKeyValidity(apiKey);
    if (isValid) {
      // Save the API key to chrome storage
      chrome.storage.local.set({ apiKey: apiKey }).then(() => {
        console.log("API Key is set!");
      });

      // Close the settings modal
      setIsSettingOpen(false);
      setIsLoadingApiKey(false);
      return Promise.resolve();
    } else {
      alert("The API key is invalid. Try again.");
      chrome.storage.local.set({ apiKey: "" }).then(() => {
        console.log("API Key is empty!");
      });
      setApiKey("");
      setIsLoadingApiKey(false);
      return Promise.reject();
    }
  };

  const handleApiKeyAlert = () => {
    alert("Please register your API key");
    setIsSettingOpen(true);
  };

  const handleGenerateClick = () => {
    setIsLoading(true);
    if (apiKey === "") {
      handleApiKeyAlert();
      setIsLoading(false);
      return;
    }
    try {
      axios
        .post(
          endPoint,
          {
            model: "text-davinci-003",
            prompt: generateNewEmail(prompt, "", ""),
            max_tokens: 100, // word count
            n: 1,
            stop: null,
            temperature: 0.8, // 0(safe) - 1(creative)
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          }
        )
        .then((res) => {
          // TODO: check status code
          console.log(res.data);
          setResponse(res.data.choices[0].text);
          setPrompt("");
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  const handleInsertClick = () => {
    // Insert the response text into the email body
    const emailBody = document.querySelector('div[aria-label="Message Body"]');
    if (emailBody) {
      // emailBody.innerHTML = response + emailBody.innerHTML;
      const cleanedResponse = response
        .replace(/^\n/, "")
        .replace(/\n/g, "<br>");
      emailBody.insertAdjacentHTML("afterbegin", cleanedResponse);
    }

    // Close the modal
    handleCloseClick();
  };

  const getButtonClassName = (tone) => {
    // return selectedTones.includes(tone) ? 'btn selected' : 'btn';
    return selectedTones.includes(tone) ? "btn-selected" : "btn-not-selected";
  };

  const checkApiKeyValidity = async (apiKey) => {
    try {
      const response = await axios.post(
        endPoint,
        {
          model: "text-davinci-003",
          prompt: generateNewEmail("Hello", "", ""),
          max_tokens: 5,
          n: 1,
          stop: null,
          temperature: 0.8,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const generateNewEmail = (emailPrompt, tones, context) => `
    Given the context: ${context}.
    You are an assistant helping to draft a ${tones} email. 
    Use the email in the double square bracket as the summary of the email that you need to rewrite. 
    Please note that you are rewriting the email and not replying. 
    Do not include the brackets in the output, only respond with the email. 
    Also, reply in language of the text in bracket. 
    Always have a greeting and closing too:
    [${emailPrompt}]`;

  return (
    <div>
      {isModalOpen && (
        <div className="app-modal">
          <button className="close-button" onClick={handleCloseClick}>
            &times;
          </button>
          <h1 className="title">GPTmail</h1>
          <p className="text">Briefly explain what your email is about</p>
          <input
            className="prompt-input"
            type="text"
            placeholder="Write an email that "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text">Select the tones</p>
          <div className="tones">
            {tones.map((tone, index) => (
              <button
                key={index}
                className={getButtonClassName(tone)}
                onClick={() => handleToneClick(tone)}
              >
                {tone}
              </button>
            ))}
          </div>

          {response && (
            <div>
              <div className="horizontal-line"></div>
              <p className="text">Response Generated</p>
              <textarea className="response" value={response} readOnly />
            </div>
          )}

          <div className="bottom-container">
            <div className="setting-container">
              <button
                className="setting-btn white-btns"
                onClick={handleSettingClick}
              >
                Settings
              </button>
            </div>

            <div className="right-btns">
              {" "}
              {response && (
                <div className="insert-container">
                  <button
                    className="insert-btn white-btns"
                    onClick={handleInsertClick}
                  >
                    Insert
                  </button>
                </div>
              )}
              <div className="generate-container">
                {/* button should be regenerate once user generated  */}
                <button
                  className={
                    apiKey.length > 0 ? "generate-btn" : "generate-btn-disabled"
                  }
                  onClick={
                    apiKey.length > 0 ? handleGenerateClick : handleApiKeyAlert
                  }
                >
                  {isLoading ? (
                    <>
                      <span className="spinner" />
                      <span style={{ marginLeft: "8px" }}>Generating</span>
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isSettingOpen && (
        <SettingModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          isLoadingApiKey={isLoadingApiKey}
          setIsLoadingApiKey={setIsLoadingApiKey}
          handleSaveClick={() => {
            handleSaveClick();
          }}
          onClose={() => setIsSettingOpen(false)}
        />
      )}
    </div>
  );
}
