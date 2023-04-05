import React, { useState } from 'react';
import './App.css';

export default function App() {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const axios = require('axios');

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
              'Authorization': `Bearer ${key}`
          }
      }).then((res) => {
        // todo: check status code
        console.log(res.data);
        setResponse(res.data.choices[0].text);
        setPrompt("");
        // setHistory([...history, 
        //   `My input: ${prompt} \n GPT-3 output: ${res.data.choices[0].text}`
        // ]);
      }).catch((error) => {
        // Handle error here
        console.log("some error here");
        console.log(error);
      });;

    } catch(error) {
      // todo: Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  };

    return (
        <div className="app-modal">
        <h1>React Chrome Extension</h1>
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div>
          {tones.map((tone) => (
            <button
              key={tone}
              className={`app-button${selectedTones.includes(tone) ? ' selected' : ''}`}
              onClick={() => handleToneClick(tone)}
            >
              {tone}
            </button>
          ))}
        </div>
        <button className="app-button" onClick={handleGenerateClick}>
          Generate
        </button>
        {response && (
          <textarea className="textarea" value={response} readOnly />
        )}
      </div>
    )
  }

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


// export default App;
