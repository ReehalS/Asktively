import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    // Listen for messages from background.js
    chrome.runtime.onMessage.addListener((message) => {
      if (message.output) {
        setResponses((prevResponses) => [
          ...prevResponses,
          { type: message.type, output: message.output }
        ]);
      }
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to <strong>Asktively</strong>!</p>
        <div>
          {responses.map((response, index) => (
            <div key={index}>
              <h3>{response.type} Questions</h3>
              <pre>{JSON.stringify(response.output, null, 2)}</pre>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
