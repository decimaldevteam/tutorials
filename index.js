require('dotenv').config(); // Loads all env variables

const express = require('express');
const app = express();
const axios = require('axios');

// Simple test response
app.get('/', (req, res) => {
    res.status(200).json({ message: 'OK' });
});

// Login page
app.get('/login', (req, res) => {
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}`);
});

// Callback page
app.get('/callback', async (req, res) => {
    let code = req.query.code;
    if(!code) return res.status(400).json({ message: 'no code provided!' });

    try{
        const token = await axios({
            method: 'POST',
            url: `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}`,
            headers: {
                'Accept': 'application/json'
            }
        });

        const user = await axios({
            method: 'GET',
            url: `https://api.github.com/user`,
            headers: {
                Authorization: `token ${token.data.access_token}`
            }
        });

        res.status(200).json({ message: 'success', data: user.data });
        console.log(`${user.data.login} has logged in at ${Date.now()}`);
    }catch(e){
        console.log(e);
        res.status(500).json({ message: 'internal server error!' });
    }
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port 3000!');
});