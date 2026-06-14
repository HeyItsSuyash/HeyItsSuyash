import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update fetchData to also fetch README
new_fetchData = """let lastFetchTime = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
let cachedRepos = [];
let cachedStats = null;

async function fetchReadme(repoName) {
    try {
        const res = await axios.get(`https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`);
        let text = res.data;
        // Strip markdown: headers, bold, italics, links, images, code blocks
        text = text.replace(/<[^>]*>?/gm, ''); // html tags
        text = text.replace(/\\!\\[.*?\\]\\(.*?\\)/g, ''); // images
        text = text.replace(/\\[(.*?)\\]\\(.*?\\)/g, '$1'); // links
        text = text.replace(/#+\\s/g, ''); // headers
        text = text.replace(/\\*\\*/g, ''); // bold
        text = text.replace(/`/g, ''); // inline code
        text = text.replace(/\\n+/g, ' ').trim(); // newlines to spaces
        return text.substring(0, 120) + (text.length > 120 ? '...' : '');
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
        // Sort by stars descending, then by updated_at descending
        repos.sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        let topRepos = repos.slice(0, 7); // keep top 7
        
        // Fetch READMEs for top repos
        const reposWithReadme = await Promise.all(topRepos.map(async (repo) => {
            const readmeText = await fetchReadme(repo.name);
            return { ...repo, readme_snippet: readmeText };
        }));
        
        cachedRepos = reposWithReadme;
        cachedStats = await fetchDynamicStats(USERNAME);
        lastFetchTime = Date.now();
    } catch (e) {
        console.error("Error fetching data:", e.message);
    }
    return { repos: cachedRepos, stats: cachedStats };
}"""

content = re.sub(r'let lastFetchTime.*?return \{ repos: cachedRepos, stats: cachedStats \};\n}', new_fetchData, content, flags=re.DOTALL)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
