import React, { useState } from 'react';
import './App.css';

export default function App({ onClose, onModalClose }) {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState('Write an email that');
  const [response, setResponse] = useState('');
  const [apiKey, setKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const axios = require('axios');

  const tones = ['Concise', 'Professional', 'Confident', 'Nice', 'Passionate', 'Apologetic'];

  var initialized = false;

  const handleCloseClick = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
    if (onModalClose) {
      onModalClose();
    }
  };

  const handleToneClick = (tone) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  // todo: implement save logic
  // it'd be great to have a window indicating that we are testing the connection
  const handleSaveClick = () => {
    initialized = true;
  
  }

  const handleGenerateClick = () => {
    try {
      // const key = "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" // sohee key
      const key = "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"
      const endPoint = "https://api.openai.com/v1/completions"

      axios.post(endPoint, {
        model: "text-davinci-003",
        prompt: generateNewEmail(prompt, "", ""),
        max_tokens: 100, // word count
        n: 1,
        stop: null,
        temperature: 0.8   // 0(safe) - 1(creative)
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
        }
      }).then((res) => {
        // todo: check status code
        console.log(res.data);
        setResponse(res.data.choices[0].text);
        setPrompt("");
        // setHistory([...history, 
        //   `My input: ${prompt} \n GPT-3 output: ${res.data.choices[0].text}`
        // ]);
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
      const cleanedResponse = response.replace(/^\n/, '').replace(/\n/g, '<br>');
      emailBody.insertAdjacentHTML('afterbegin', cleanedResponse);
    }

    // Close the modal
    handleCloseClick();
  };

  const getButtonClassName = (tone) => {
    // return selectedTones.includes(tone) ? 'btn selected' : 'btn';
    return selectedTones.includes(tone) ? 'btn-selected' : 'btn-not-selected';
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
  
  const SettingModal = () => <div className="app-setting-modal">
    <p><span class="title-1">Welcome to GmailGPT</span><br></br><span class="thin-2">a chrome extension to help you write email <i>easier</i> but <i>better</i></span><br></br><br></ br> To get started, you need an OpenAI account.<br></ br>
      Sign up here and your API Key will be under User settings<br></br><br></br>Don't worry, your secret API key will only be stored locally on your device. </p>
    <input
      type="text"
      className="api-key-input"
      placeholder="Paste your API Secret key here ..."
      value={apiKey}
      onChange={(e) => setKey(e.target.value)}
    />
    <div className="save-btn-container">
      <button className="save-btn" onClick={handleSaveClick}>
        Save
      </button>
    </div>
  </div>;

  const AppModal = () => <div className="app-modal">
    <button className="close-button" onClick={handleCloseClick}>
      &times;
    </button>
    <h1 className="title">Gmail GPT</h1>
    <p className="text">
      Briefly enter what do you want to generate or choose from the template
    </p>
    <input
      type="text"
      className="prompt-input"
      placeholder="Write an email that"
      value={prompt}
      // todo: strange..
      onChange={(e) => setPrompt(e.target.value)}
    />
    <p className="text">
      Tone
    </p>
    <div className="tones">
      {tones.map((tone) => (
        <button
          className={getButtonClassName(tone)}
          onClick={() => handleToneClick(tone)}
        >{tone}</button>
      ))}
    </div>

    {/* todo: draw a line here #DBD9D9 <- color  */}

    {response && (
      <p className="text">
        Response Generated
      </p>
    )}
    {response && (
      <textarea className="response" value={response} readOnly />
    )}
    <div className='bottom-container'>

      <div className='setting-container'>
        <button className="setting-btn white-btns" onClick={handleInsertClick}>
          Settings
        </button>
      </div>

      <div className='right-btns'> {response && (
        <div className="insert-container">
          <button className="insert-btn white-btns" onClick={handleInsertClick}>
            Insert
          </button>
        </div>
      )}
        <div className='generate-container'>
          {/* button should be regenerate once user generated  */}
          <button className="generate-btn" onClick={handleGenerateClick}>
            Generate
          </button>
        </div></div>
    </div>
  </div>;

  return (
    isModalOpen && (
      <div>
        {!apiKey ? <SettingModal /> : <AppModal />}
      </div>
    )
  );
}
