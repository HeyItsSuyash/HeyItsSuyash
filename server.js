const express = require('express');
const axios = require('axios');
const { generateHero, generateAbout, generateSocial, generateProjectCard, generateStats } = require('./svgBuilder');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = 'HeyItsSuyash';

// Cache data to prevent hitting rate limits
let cachedRepos = [];
let cachedProfile = {};
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 15; // 15 mins

async function fetchData() {
    if (Date.now() - lastFetchTime < CACHE_DURATION && cachedRepos.length > 0) {
        return { profile: cachedProfile, repos: cachedRepos };
    }
    try {
        const profileRes = await axios.get(`https://api.github.com/users/${USERNAME}`);
        const reposRes = await axios.get(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=6`);
        cachedProfile = profileRes.data;
        cachedRepos = reposRes.data;
        lastFetchTime = Date.now();
        return { profile: cachedProfile, repos: cachedRepos };
    } catch (e) {
        console.error("Fetch error, using cache", e);
        return { profile: cachedProfile, repos: cachedRepos };
    }
}

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200'); // Cache for 2 hours
    next();
});

app.get('/api/hero', async (req, res) => {
    const svg = await generateHero();
    res.send(svg);
});

app.get('/api/about', async (req, res) => {
    const svg = await generateAbout();
    res.send(svg);
});

app.get('/api/social/:platform', async (req, res) => {
    const platform = req.params.platform;
    const svg = await generateSocial(platform);
    res.send(svg);
});

app.get('/api/project/:index', async (req, res) => {
    const { repos } = await fetchData();
    const index = parseInt(req.params.index, 10);
    const repo = repos[index] || null;
    const svg = await generateProjectCard(repo);
    res.send(svg);
});

app.get('/api/stats', async (req, res) => {
    const { profile } = await fetchData();
    const stats = {
        repos: profile.public_repos || 25,
        followers: profile.followers || 4,
        stars: 320, 
        contributions: 600 
    };
    const svg = await generateStats(stats);
    res.send(svg);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
