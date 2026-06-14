import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add statsFetcher import
if "statsFetcher" not in content:
    content = content.replace("const { generateSkills", "const { fetchDynamicStats } = require('./statsFetcher');\nconst { generateSkills")

# Replace fetchData implementation
new_fetchData = """let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let cachedRepos = [];
let cachedStats = null;

async function fetchData() {
    if (Date.now() - lastFetchTime < CACHE_DURATION && cachedRepos.length > 0) {
        return { repos: cachedRepos, stats: cachedStats };
    }
    try {
        const reposRes = await axios.get(`https://api.github.com/users/${USERNAME}/repos?per_page=100`);
        let repos = reposRes.data;
        // Sort by stars descending, then by updated_at descending
        repos.sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        cachedRepos = repos.slice(0, 7); // keep top 7
        
        cachedStats = await fetchDynamicStats(USERNAME);
        
        lastFetchTime = Date.now();
    } catch (e) {
        console.error("Error fetching data:", e.message);
    }
    return { repos: cachedRepos, stats: cachedStats };
}"""

content = re.sub(r'let lastFetchTime.*?return \{ profile: cachedProfile, repos: cachedRepos \};\n}', new_fetchData, content, flags=re.DOTALL)

# Add /api/project/view-all endpoint
view_all_endpoint = """app.get('/api/project/view-all', async (req, res) => {
    const svg = await generateViewAllCard();
    res.send(svg);
});

app.get('/api/project/:index'"""

content = content.replace("app.get('/api/project/:index'", view_all_endpoint)

# Replace the hardcoded stats in /api/stats
new_stats = """app.get('/api/stats', async (req, res) => {
    const { stats } = await fetchData();
    const svg = await generateStats(stats);
    res.send(svg);
});"""
content = re.sub(r'app\.get\(\'/api/stats\', async \(req, res\) => \{.*?res\.send\(svg\);\n\}\);', new_stats, content, flags=re.DOTALL)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
