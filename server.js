const express = require('express');
const axios = require('axios');
const { generateSVG } = require('./svgBuilder');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = 'HeyItsSuyash';

app.get('/github.svg', async (req, res) => {
    try {
        // Fetch GitHub Stats
        const profileRes = await axios.get(`https://api.github.com/users/${USERNAME}`);
        const reposRes = await axios.get(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`);
        
        const profile = profileRes.data;
        const repos = reposRes.data;
        
        // Prepare Data
        const stats = {
            repos: profile.public_repos || 25,
            followers: profile.followers || 4,
            stars: 320, // Example hardcoded or calculated
            contributions: 600 // Needs GraphQL for exact count, faking for demo
        };

        // Generate the SVG
        const svgString = await generateSVG(profile, repos, stats);

        // Send SVG Response
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=7200'); // Cache for 2 hours
        res.status(200).send(svgString);

    } catch (error) {
        console.error("Error generating SVG:", error.message);
        res.status(500).send("Internal Server Error generating SVG");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`View SVG at http://localhost:${PORT}/github.svg`);
});
