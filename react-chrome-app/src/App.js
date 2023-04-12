import React, { useState } from 'react';
import './App.css';

function App({ onClose }) {
  const [selectedTones, setSelectedTones] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

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

  const handleGenerateClick = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailPrompt: {prompt} }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResponse(data.result);
      setPrompt("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  };

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

export default App;


// import React, { useState } from 'react';
// import './App.css';

// function App({ onClose }) {
//   const [selectedTones, setSelectedTones] = useState([]);
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState('');

//   const handleCloseClick = () => {
//     setIsModalOpen(false);
//     if (onClose) {
//       onClose();
//     }
//   };

//   const tones = ['Neutral', 'Formal', 'Smart', 'Concise', 'Professional', 'Firm'];

//   const handleToneClick = (tone) => {
//     if (selectedTones.includes(tone)) {
//       setSelectedTones(selectedTones.filter((t) => t !== tone));
//     } else {
//       setSelectedTones([...selectedTones, tone]);
//     }
//   };

//   const handleGenerateClick = async () => {
//     // Send API request using the prompt text input data
//     // For demonstration purposes, I'll just use a setTimeout to simulate an API call.
//     // setTimeout(() => {
//     //   setResponse(`Generated response for prompt: "${prompt}" with tones: ${selectedTones.join(', ')}`);
//     // }, 1000);

//     // event.preventDefault();
//     try {
//       const response = await fetch("/api/generate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ emailPrompt: {prompt} }),
//       });

//       const data = await response.json();
//       if (response.status !== 200) {
//         throw data.error || new Error(`Request failed with status ${response.status}`);
//       }

//       setResponse(data.result);
//       setPrompt("");
//     } catch(error) {
//       // Consider implementing your own error handling logic here
//       console.error(error);
//       alert(error.message);
//     }
    
//   };

//   const [isModalOpen, setIsModalOpen] = useState(true);

//   return (
//     isModalOpen && (<div className="app-modal">
//       <button className="close-button" onClick={handleCloseClick}>
//           &times;
//         </button>
//       <h1 className="title">Gmail GPT</h1>
//       <input
//         type="text"
//         className="prompt-input"
//         placeholder="Enter your prompt"
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//       />
//       <div>
//         {tones.map((tone) => (
//           <button
//             // key={tone}
//             className={`btn${selectedTones.includes(tone) ? ' selected' : ''}`}
//             onClick={() => handleToneClick(tone)}
//           >
//             {tone}
//           </button>
//         ))}
//       </div>
//       <div className='generate-container'>
//         <button className="generate-btn" onClick={handleGenerateClick}>
//           Generate
//         </button>
//       </div>
//       {response && (
//         <textarea className="response" value={response} readOnly />
//       )}
//     </div>)
//   );
// }

// export default App;
