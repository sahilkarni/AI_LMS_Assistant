import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  console.log('[Backend] Received prompt:', prompt);

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma3',
        prompt: prompt,
        stream: false
      }),
    });

    console.log('[Backend] Ollama response status:', response.status);
    const data = await response.json();
    console.log('[Backend] Ollama response data:', data);

    res.json({ response: data.response || '[No response]' });
  } catch (err) {
    console.error('[Backend] Ollama fetch error:', err);
    res.status(500).json({ response: 'Backend error' });
  }
});


app.listen(3001, () => {
  console.log('Server running at http://localhost:3001');
});
