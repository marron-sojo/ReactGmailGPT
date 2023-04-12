import React, { useState } from 'react';
import './App.css';

export default function App({ onClose }) {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const axios = require('axios');
  const handleCloseClick = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };

  const tones = ['Neutral', 'Formal', 'Smart', 'Concise', 'Professional', 'Firm'];

  const handleToneClick = (tone) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };


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

    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  };

  function generateNewEmail(emailPrompt, tones, context) {
    return `
      Given the context: ${context}.
      You are an assistant helping to draft a ${tones} email. 
      Use the email in the double square bracket as the summary of the email that you need to rewrite. 
      Please note that you are rewriting the email and not replying. 
      Do not include the brackets in the output, only respond with the email. 
      Also, reply in language of the text in bracket. 
      Always have a greeting and closing too:
      [${emailPrompt}]`;
  }

  const [isModalOpen, setIsModalOpen] = useState(true);

  const getButtonClassName = (tone) => {
    // return selectedTones.includes(tone) ? 'btn selected' : 'btn';
    return selectedTones.includes(tone) ? 'btn-selected' : 'btn-not-selected';
  };

  return (
    isModalOpen && (
      <div className="app-modal">
        <button className="close-button" onClick={handleCloseClick}>
          &times;
        </button>
        <h1 className="title">Gmail GPT</h1>
        <input
          type="text"
          className="prompt-input"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div>
          {tones.map((tone) => (
            <button
              className={getButtonClassName(tone)}
              onClick={() => handleToneClick(tone)}
            >{tone}</button>
          ))}
        </div>
        <div className='generate-container'>
          <button className="generate-btn" onClick={handleGenerateClick}>
            Generate
          </button>
        </div>
        {response && (
          <textarea className="response" value={response} readOnly />
        )}
      </div>
    )
  );
}