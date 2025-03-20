const asyncHandler = require('express-async-handler');
const axios = require('axios');

// Get authorization tokens
const exchangeToken = asyncHandler(async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Make POST request to exchange the code for tokens using axios
        const response = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: 'http://localhost:8080/oauth2callback',
                grant_type: 'authorization_code',
            }
        });

        // The response from Google should include access token, id token, and refresh token
        const { access_token, id_token, refresh_token } = response.data;

        // Send tokens to the client or handle them as needed
        res.json({
            access_token,
            id_token,
            refresh_token
        });

    } catch (err) {
        console.error('Error during OAuth token exchange:', err.message);
        res.status(500).send('Failed to exchange code for tokens');
    }
});

module.exports = { exchangeToken, };
// app.get('/oauth2callback', );