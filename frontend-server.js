const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static files from the dist directory (default Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
