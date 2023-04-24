import React from "react";
import "./SettingModal.css";
import "./Spinner.css";

const SettingModal = ({
  apiKey,
  setApiKey,
  handleSaveClick,
  onClose,
  isLoadingApiKey,
  setIsLoadingApiKey,
}) => (
  <div className="app-setting-modal">
    <button className="close-settings-button" onClick={onClose}>
      &times;
    </button>
    <p>
      <span class="title-1">Welcome to GPTmail</span>
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
      type="password"
      className="api-key-input"
      placeholder="Paste your API Secret key here ..."
      value={apiKey}
      onChange={(e) => setApiKey(e.target.value)}
    />
    <div className="save-btn-container">
      <button
        className="save-btn"
        onClick={() => {
          setIsLoadingApiKey(true);
          handleSaveClick()
            .then(() => {
              setIsLoadingApiKey(false);
            })
            .catch(() => {
              setIsLoadingApiKey(false);
            });
        }}
      >
        {isLoadingApiKey ? (
          <>
            <span className="spinner" />
            <span style={{ marginLeft: "8px" }}>Validating</span>
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  </div>
);

export default SettingModal;
