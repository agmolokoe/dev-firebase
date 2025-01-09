const express = require('express');
const app = express();

app.use(express.json());

app.post('/submit', (req, res) => {
    const { input } = req.body;
    if (!input || input.trim() === '') {
        return res.status(400).send('Input cannot be empty');
    }
    // Process the input
    res.send('Input received');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});