const axios = require('axios');

async function fetchDynamicStats(username) {
    let stars = 0;
    let contributions = 0;
    let reposCount = 0;
    let followers = 0;

    try {
        const profileRes = await axios.get(`https://api.github.com/users/${username}`);
        reposCount = profileRes.data.public_repos || 0;
        followers = profileRes.data.followers || 0;

        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
        stars = reposRes.data.reduce((acc, repo) => acc + repo.stargazers_count, 0);

        const statsRes = await axios.get(`https://github-readme-stats.vercel.app/api?username=${username}`);
        const match = statsRes.data.match(/Total Commits.*?:\s*(\d+)/);
        if (match) {
            contributions = parseInt(match[1], 10);
        }
    } catch (e) {
        console.error("Error fetching dynamic stats:", e.message);
    }
    
    return { repos: reposCount, followers, stars, contributions };
}

module.exports = { fetchDynamicStats };
