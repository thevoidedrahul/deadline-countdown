const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS
app.use(cors());

// Deadline API endpoint
app.get('/api/deadline', (req, res) => {
  // Set a deadline 5 minutes from now for testing
  const deadline = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  const secondsLeft = Math.floor((deadline.getTime() - Date.now()) / 1000);
  
  console.log(`API called: Seconds left = ${secondsLeft}`);
  
  res.json({
    secondsLeft: Math.max(0, secondsLeft)
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`Deadline endpoint: http://localhost:${PORT}/api/deadline`);
});
