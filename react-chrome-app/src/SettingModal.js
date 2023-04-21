import React from "react";
import "./SettingModal.css";

const SettingModal = ({ apiKey, setApiKey, handleSaveClick, onClose }) => (
  <div className="app-setting-modal">
    <button className="close-settings-button" onClick={onClose}>
      &times;
    </button>
    <p>
      <span class="title-1">Welcome to GmailGPT</span>
      <br></br>
      <span class="thin-2">
        a chrome extension to help you write email <i>easier</i> but{" "}
        <i>better</i>
      </span>
      <br></br>
      <br></br> To get started, you need an OpenAI account.<br></br>
      Sign up here and your API Key will be under{" "}
      <a
        href="https://platform.openai.com/account/api-keys"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline" }}
      >
        User settings
      </a>
      <br></br>
      <br></br>Don't worry, your secret API key will only be stored locally on
      your device.{" "}
    </p>
    <input
      type="text"
      className="api-key-input"
      placeholder="Paste your API Secret key here ..."
      value={apiKey}
      onChange={(e) => setApiKey(e.target.value)}
    />
    <div className="save-btn-container">
      <button className="save-btn" onClick={handleSaveClick}>
        Save
      </button>
    </div>
  </div>
);

export default SettingModal;
