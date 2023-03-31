// function App() {
//   const appStyles = {
//     position: "fixed",
//     top: "10px",
//     right: "10px",
//     zIndex: 1000,
//     backgroundColor: "white",
//     padding: "10px",
//     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//     borderRadius: "4px",
//   };

//   return (
//     <div style={appStyles}>
//       <h1>React Chrome Extension</h1>
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const tones = ['Neutral', 'Formal', 'Smart', 'Concise', 'Professional', 'Firm'];

  const handleToneClick = (tone) => {
    if (selectedTones.includes(tone)) {
      setSelectedTones(selectedTones.filter((t) => t !== tone));
    } else {
      setSelectedTones([...selectedTones, tone]);
    }
  };

  const handleGenerateClick = async () => {
    // Send API request using the prompt text input data
    // For demonstration purposes, I'll just use a setTimeout to simulate an API call.
    setTimeout(() => {
      setResponse(`Generated response for prompt: "${prompt}" with tones: ${selectedTones.join(', ')}`);
    }, 1000);
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
  );
}

export default App;
