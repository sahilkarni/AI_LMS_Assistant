import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Sorry, your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      console.log('Microphone is on...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('You said:', transcript);
      setPrompt(transcript);
    };

    recognition.onend = () => {
      setListening(false);
      console.log('Microphone turned off.');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      alert(`Error occurred in recognition: ${event.error}`);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (!listening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSend = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const res = await fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    console.log('Response from server:', data.response);
    setResponse(data.response);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>LMS Chatbot</h1>
      <textarea
        rows="4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask something..."
      />
      <br />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Thinking...' : 'Send'}
      </button>
      <button onClick={handleMicClick} style={{ marginLeft: '10px' }}>
        {listening ? 'Stop 🎙️' : 'Speak 🎙️'}
      </button>
      <pre>{response}</pre>
    </div>
  );
}

export default App; 