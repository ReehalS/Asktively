import React, { useState } from 'react';
import './App.css';
import { generateQuestions } from '../../background';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function App() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const output = await generateQuestions();
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    console.log(output);
    setResponses([output]);
  }

  const downloadHandler = () => {
    console.log("downloading...");
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Welcome to <strong>Asktively</strong>!</p>
      </header>

      {responses.length === 0 ? 
        <button className="generate-button" onClick={generateHandler}>
          Generate Questions
        </button>
        :
        <button className="download-button" onClick={downloadHandler}>
          Download
        </button>  
      }

      <CSSTransition 
        in={loading}
        timeout={50}
        classNames="fade"
        unmountOnExit
      >
        <div className="loader" />
      </CSSTransition>

      <TransitionGroup>
        {responses.length > 0 && !loading && 
          responses.map((response, index) => (
            <CSSTransition
              key={index}
              timeout={500}
              classNames="fade"
            >
              <div>
                <h3>{response.type} Questions</h3>
                <p>{JSON.stringify(response.output, null, 2)}</p>
              </div>
            </CSSTransition>
          ))
        }
      </TransitionGroup>

    </div>
  );
}

export default App;
