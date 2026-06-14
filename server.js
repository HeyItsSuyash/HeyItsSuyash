const express = require('express');
const axios = require('axios');
const { fetchDynamicStats } = require('./statsFetcher');
const { generateHero, generateAbout, generateSocial, generateProjectCard, generateStats, generateSkills, generateViewAllCard } = require('./svgBuilder');

const app = express();
const PORT = process.env.PORT || 3000;
const USERNAME = 'HeyItsSuyash';

let cachedRepos = [];
let cachedStats = null;
let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 15; // 15 mins

async function fetchReadme(repoName) {
    try {
        const res = await axios.get(`https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`);
        let text = res.data;
        // Strip markdown
        text = text.replace(/<[^>]*>?/gm, ''); 
        text = text.replace(/!\[.*?\]\(.*?\)/g, ''); 
        text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
        text = text.replace(/#+\s/g, ''); 
        text = text.replace(/\*\*/g, ''); 
        text = text.replace(/`/g, ''); 
        text = text.replace(/\n+/g, ' ').trim();
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    } catch(e) {
        return "No description available.";
    }
}

async function fetchData() {
    if (Date.now() - lastFetchTime < CACHE_DURATION && cachedRepos.length > 0) {
        return { repos: cachedRepos, stats: cachedStats };
    }
    try {
        const reposRes = await axios.get(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
        let repos = reposRes.data;
        repos.sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        let topRepos = repos.slice(0, 7);
        const reposWithReadme = await Promise.all(topRepos.map(async (repo) => {
            const readmeText = await fetchReadme(repo.name);
            return { ...repo, readme_snippet: readmeText };
        }));
        
        cachedRepos = reposWithReadme;
        cachedStats = await fetchDynamicStats(USERNAME);
        lastFetchTime = Date.now();
        return { repos: cachedRepos, stats: cachedStats };
    } catch (e) {
        console.error("Fetch error, using cache", e);
        return { repos: cachedRepos, stats: cachedStats };
    }
}

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=7200');
    next();
});

app.get('/api/hero', async (req, res) => { res.send(await generateHero()); });
app.get('/api/about', async (req, res) => { res.send(await generateAbout()); });
app.get('/api/social/:platform', async (req, res) => { res.send(await generateSocial(req.params.platform)); });
app.get('/api/project/view-all', async (req, res) => { res.send(await generateViewAllCard()); });
app.get('/api/project/:index', async (req, res) => {
    const { repos } = await fetchData();
    const index = parseInt(req.params.index, 10);
    const repo = repos && repos[index] ? repos[index] : null;
    res.send(await generateProjectCard(repo));
});
app.get('/api/skills', async (req, res) => { res.send(await generateSkills()); });
app.get('/api/stats', async (req, res) => {
    const { stats } = await fetchData();
    res.send(await generateStats(stats));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
