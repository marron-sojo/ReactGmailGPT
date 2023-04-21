import React, { useState } from "react";
import "./App.css";
import SettingModal from "./SettingModal";

export default function App({ onClose, onModalClose }) {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState("Write an email that ");
  const [response, setResponse] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const axios = require("axios");
  const endPoint = "https://api.openai.com/v1/completions";

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
      // Save the API key
      localStorage.setItem("apiKey", apiKey);

      // Show a toast message
      // toast.success("API key successfully saved", { autoClose: 3000 });

      // Close the settings modal
      setIsSettingOpen(false);
    } else {
      alert("The API key is invalid. Try again.");
    }
  };

  const handleGenerateClick = () => {
    try {
      // const key = "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" // sohee key
      const key = "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";

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
              Authorization: `Bearer ${key}`,
            },
          }
        )
        .then((res) => {
          // TODO: check status code
          console.log(res.data);
          setResponse(res.data.choices[0].text);
          setPrompt("");
        });
    } catch (error) {
      console.error(error);
      alert(error.message);
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
          <h1 className="title">Gmail GPT</h1>
          <p className="text">
            Briefly enter what do you want to generate or choose from the
            template
          </p>
          <input
            className="prompt-input"
            type="text"
            placeholder="Write an email that "
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text">Tone</p>
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
                <button className="generate-btn" onClick={handleGenerateClick}>
                  Generate
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
          handleSaveClick={() => {
            handleSaveClick();
          }}
          onClose={() => setIsSettingOpen(false)}
        />
      )}
    </div>
  );
}
